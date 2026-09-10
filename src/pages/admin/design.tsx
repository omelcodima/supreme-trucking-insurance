import type { GetServerSideProps } from "next";
import OwnerDesign from "@/components/OwnerDesign";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  const { ownerSession } = await import("@/lib/ownerAuth");
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers))
    if (typeof value === "string") headers.set(key, value);
  try {
    const session = await ownerSession(headers);
    if (session) {
      const { readHomepageDesign } = await import("@/lib/homepageDesign");
      const initialDesign = await readHomepageDesign().catch(() => null);
      return { props: { initialDesign } };
    }
  } catch { /* Fail closed, like the rest of the owner workspace. */ }
  return { redirect: { destination: "/admin/login", permanent: false } };
};

export default OwnerDesign;
