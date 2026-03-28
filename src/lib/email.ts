import nodemailer from "nodemailer";

export async function sendInviteEmail({
  to,
  groupName,
  inviteUrl,
}: {
  to: string;
  groupName: string;
  inviteUrl: string;
}) {
  const transport = nodemailer.createTransport(process.env.EMAIL_SERVER as string);

  await transport.sendMail({
    to,
    from: process.env.EMAIL_FROM,
    subject: `You've been invited to join ${groupName} on Mossy Meetups`,
    text: [
      `You've been invited to join "${groupName}" on Mossy Meetups.`,
      "",
      `Accept here: ${inviteUrl}`,
      "",
      "This link expires in 7 days.",
      "If you weren't expecting this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1a1a18; background: #f3f6f1;">
        <p style="color: #5b3a2e; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 8px;">Mossy Meetups</p>
        <h1 style="font-size: 1.6rem; margin: 0 0 16px; color: #1a1a18;">You're invited to ${groupName}</h1>
        <p style="margin: 0 0 24px; color: #444;">Someone has invited you to join <strong>${groupName}</strong> on Mossy Meetups — a private planning tool for camp meetups.</p>
        <p style="margin: 0 0 32px;">
          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #d7b97f, #b98545); color: #10231d; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-weight: bold;">
            Accept invitation
          </a>
        </p>
        <p style="color: #888; font-size: 0.82em; margin: 0;">This link expires in 7 days. If you weren't expecting this invitation, you can safely ignore this email.</p>
      </div>
    `,
  });
}
