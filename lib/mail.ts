import { Resend } from 'resend';

const domain = process.env.NEXT_PUBLIC_APP_URL;
export async function sendVerificationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verificationLink = `${domain}/auth/verify?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Eventify-No-Reply <mail@sarathmadala.com>',
      to: email,
      subject: 'Verification email for Eventify',
      html: `<p>Click on the link to verify your email. <a href=${verificationLink}>Click here</a></p>`
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verificationLink = `${domain}/auth/new-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Eventify-No-Reply <mail@sarathmadala.com>',
      to: email,
      subject: 'Reset password for Eventify',
      html: `<p>Click on the link to reset your password for Eventify. <a href=${verificationLink}>Click here</a></p>`
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}