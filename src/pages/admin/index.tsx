import type { GetServerSideProps } from "next";
import OwnerDashboard from "@/components/OwnerDashboard";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  const { ownerSession } = await import("@/lib/ownerAuth");
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers))
    if (typeof value === "string") headers.set(key, value);
  try {
    const session = await ownerSession(headers);
    if (session)
      return {
        props: {
          ownerEmail: session.user.email,
          testEnvironment: ["localhost", "127.0.0.1"].includes(
            new URL(process.env.OWNER_AUTH_URL!).hostname,
          ),
        },
      };
  } catch {
    /* No private content is rendered when authentication is unavailable. */
  }
  return { redirect: { destination: "/admin/login", permanent: false } };
};

export default OwnerDashboard;
