import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/client";
import { isAdminEmail } from "@/lib/admins";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { Resend: ResendClient } = await import("resend");
        const resend = new ResendClient(provider.apiKey!);
        await resend.emails.send({
          from: provider.from!,
          to: [email],
          subject: "Sign in to BuyEOD admin",
          html: emailHtml(url),
          text: emailText(url),
        });
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/check-email",
    error: "/admin/login",
  },
  callbacks: {
    /**
     * Block sign-in attempts from non-admin emails. They'll get the
     * verification email but the link will fail to create a session.
     */
    async signIn({ user }) {
      return isAdminEmail(user.email);
    },
    async session({ session }) {
      // Surface admin status on the client session for UI gating.
      (session.user as { isAdmin?: boolean }).isAdmin = isAdminEmail(
        session.user?.email,
      );
      return session;
    },
  },
  session: { strategy: "database" },
});

function emailHtml(url: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:48px 24px;background:#fffaf6;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro Display',Inter,sans-serif;color:#1d1d1f;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;padding:40px;box-shadow:0 12px 40px -16px rgba(0,0,0,0.12);">
      <div style="font-size:11px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:#d04a17;margin-bottom:6px;">BuyEOD admin</div>
      <h1 style="margin:0;font-size:30px;font-weight:600;letter-spacing:-0.6px;line-height:1.1;">Click to sign in.</h1>
      <p style="margin-top:18px;font-size:15px;line-height:1.55;color:#1d1d1f;">This link expires in 24 hours and works once. If you didn't request it, you can ignore this email.</p>
      <div style="margin-top:28px;">
        <a href="${url}" style="display:inline-block;background:#d04a17;color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:600;">Sign in to BuyEOD</a>
      </div>
      <p style="margin-top:36px;font-size:12px;color:#6e6e73;line-height:1.55;">If the button doesn't work, paste this URL into your browser:<br/><span style="color:#1d1d1f;word-break:break-all;">${url}</span></p>
    </div>
  </body>
</html>`;
}

function emailText(url: string): string {
  return `Sign in to BuyEOD admin\n\nOpen this link to sign in:\n${url}\n\nThe link expires in 24 hours and only works once.`;
}
