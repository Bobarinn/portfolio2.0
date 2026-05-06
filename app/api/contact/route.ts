import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, getClientIp, isOriginAllowed } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Check if origin is allowed
    if (!isOriginAllowed(req)) {
      return NextResponse.json(
        { error: 'Unauthorized origin. Access denied.' },
        { status: 403 }
      );
    }

    // Rate limiting: 3 contact form submissions per hour per IP
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(`contact:${clientIp}`, 3, 60 * 60 * 1000);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      const minutesUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 60000);

      return NextResponse.json(
        {
          error: `Too many messages sent. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString(),
          }
        }
      );
    }

    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'koladeabobarin@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    // Send notification to portfolio inbox
    const { error: notifyError } = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: monospace; color: #e8e8e8; background: #0a0a0a; padding: 32px; border: 1px solid #262626;">
          <h2 style="color: #f59e0b; margin-bottom: 24px;">New Contact Form Submission</h2>

          <div style="margin-bottom: 16px;">
            <strong style="color: #f59e0b;">From:</strong> ${name}
          </div>

          <div style="margin-bottom: 16px;">
            <strong style="color: #f59e0b;">Email:</strong> ${email}
          </div>

          <div style="margin-bottom: 16px;">
            <strong style="color: #f59e0b;">Subject:</strong> ${subject}
          </div>

          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #262626;">
            <strong style="color: #f59e0b;">Message:</strong>
            <p style="margin-top: 12px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (notifyError) {
      console.error('Contact notification email error:', notifyError);
      return NextResponse.json(
        {
          error: 'Email service configuration issue. Please verify your domain at resend.com/domains or contact directly at koladeabobarin@gmail.com',
          details: notifyError.message
        },
        { status: 500 }
      );
    }

    // Send confirmation email to sender (optional - won't fail if this errors)
    const { error: confirmError } = await resend.emails.send({
      from: `Kolade Victor Abobarin <${fromEmail}>`,
      to: email,
      subject: 'Message received – Kolade Victor Abobarin',
      html: `
        <div style="font-family: monospace; color: #e8e8e8; background: #0a0a0a; padding: 32px; border: 1px solid #262626;">
          <h2 style="color: #f59e0b; margin-bottom: 24px;">Thanks for reaching out, ${name}</h2>

          <p style="line-height: 1.6; margin-bottom: 16px;">
            I received your message and will get back to you soon.
          </p>

          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #262626;">
            <strong style="color: #f59e0b;">Your message:</strong>
            <p style="margin-top: 12px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #262626; font-size: 12px; opacity: 0.6;">
            Kolade Victor Abobarin<br/>
            Product Manager<br/>
            koladeabobarin@gmail.com
          </div>
        </div>
      `,
    });

    if (confirmError) {
      console.error('Confirmation email error:', confirmError);
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully!',
      },
      {
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        }
      }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email directly.' },
      { status: 500 }
    );
  }
}
