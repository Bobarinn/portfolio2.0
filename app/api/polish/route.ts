import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit, getClientIp, isOriginAllowed } from '@/lib/ratelimit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check if origin is allowed
    if (!isOriginAllowed(req)) {
      return NextResponse.json(
        { error: 'Unauthorized origin. Access denied.' },
        { status: 403 }
      );
    }

    // Rate limiting: 10 polish requests per minute per IP
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(`polish:${clientIp}`, 10, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          }
        }
      );
    }

    const { message } = await req.json();

    if (!message || message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Message too short. Write at least 20 characters.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional communication assistant for Victor on his portfolio website. You help his visitors fill out the contact form. Polish the user's message to be clear, concise, and professional while maintaining their original intent and tone. Also generate a relevant subject line.

Return a JSON object with this exact structure:
{
  "subject": "A concise, relevant subject line (5-8 words max)",
  "message": "The polished message (keep it concise, professional, and true to the original intent)"
}

Guidelines:
- Keep the polished message concise (2-3 paragraphs max)
- Maintain the user's authentic voice and intent
- Fix grammar and clarity issues
- Remove unnecessary words
- Make it professional but not overly formal
- The subject should capture the main ask or topic`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(
      {
        subject: result.subject || 'Inquiry',
        message: result.message || message,
      },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        }
      }
    );
  } catch (error) {
    console.error('Polish API error:', error);
    return NextResponse.json(
      { error: 'Failed to polish message. Please try again.' },
      { status: 500 }
    );
  }
}
