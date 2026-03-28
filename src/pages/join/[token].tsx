import { getServerSession } from "next-auth/next";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

import { authOptions } from "../../lib/auth";
import { getPrismaClient } from "../../lib/prisma";

type Status = "accepted" | "invalid" | "expired" | "already_used" | "wrong_email" | "already_member";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const MESSAGES: Record<Status, { title: string; body: string }> = {
  accepted: {
    title: "Welcome aboard!",
    body: "You've joined the group. Head to the dashboard to see your events.",
  },
  invalid: {
    title: "Invalid invite",
    body: "This invite link is not valid. Ask the group admin to send a new one.",
  },
  expired: {
    title: "Invite expired",
    body: "This invite link has expired (links are valid for 7 days). Ask the group admin to send a new one.",
  },
  already_used: {
    title: "Already accepted",
    body: "This invite link has already been used.",
  },
  wrong_email: {
    title: "Wrong account",
    body: "This invite was sent to a different email address. Sign in with the invited address to accept it.",
  },
  already_member: {
    title: "Already a member",
    body: "You're already a member of this group.",
  },
};

export default function JoinPage({ status, groupName }: Props) {
  const { title, body } = MESSAGES[status as Status];
  const isSuccess = status === "accepted" || status === "already_member";

  return (
    <>
      <Head>
        <title>{title} — Mossy Meetups</title>
      </Head>
      <main className="shell">
        <div className="card">
          <p className="eyebrow">Mossy Meetups</p>
          <h1>{title}</h1>
          {groupName ? <p className="group-name">{groupName}</p> : null}
          <p className="lede">{body}</p>
          <Link href="/" className="btn">
            {isSuccess ? "Go to dashboard →" : "Back to home"}
          </Link>
        </div>
      </main>
      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          background: radial-gradient(circle at top, rgba(245, 201, 120, 0.22), transparent 30%),
            linear-gradient(180deg, #10231d 0%, #0a1512 55%, #07100d 100%);
          color: #f3ebdc;
          min-height: 100vh;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .shell {
          width: 100%;
          min-height: 100vh;
          padding: 48px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 480px;
          border: 1px solid rgba(243, 235, 220, 0.12);
          background: rgba(13, 28, 23, 0.74);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 36px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: #d7b97f;
          margin: 0 0 12px;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 2rem;
          line-height: 1.1;
        }

        .group-name {
          font-size: 1.1rem;
          color: #d7b97f;
          margin: 0 0 12px;
        }

        .lede {
          color: #c9c2b3;
          margin: 0 0 28px;
        }

        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #d7b97f, #b98545);
          color: #10231d;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 700;
          font-family: inherit;
        }

        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params as { token: string };

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`,
        permanent: false,
      },
    };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { props: { status: "invalid", groupName: null } };
  }

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { group: true },
  });

  if (!invite) {
    return { props: { status: "invalid", groupName: null } };
  }

  const groupName = invite.group.name;

  if (invite.usedAt) {
    return { props: { status: "already_used", groupName } };
  }

  if (invite.expiresAt < new Date()) {
    return { props: { status: "expired", groupName } };
  }

  if (invite.email !== session.user.email?.toLowerCase()) {
    return { props: { status: "wrong_email", groupName } };
  }

  // Check if already a member (admin or accepted invite)
  if (invite.group.adminId === session.user.id) {
    return { props: { status: "already_member", groupName } };
  }

  const acceptedInvite = await prisma.invite.findFirst({
    where: { groupId: invite.groupId, userId: session.user.id, usedAt: { not: null } },
  });
  if (acceptedInvite) {
    return { props: { status: "already_member", groupName } };
  }

  // Accept the invite
  await prisma.invite.update({
    where: { id: invite.id },
    data: { usedAt: new Date(), userId: session.user.id },
  });

  return { props: { status: "accepted", groupName } };
};
