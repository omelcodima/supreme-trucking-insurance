import { revalidatePath } from "next/cache";
import { ownerAuthOrigin, ownerSession } from "@/lib/ownerAuth";
import { saveHomepageDesign } from "@/lib/homepageDesign";
import { changeHomepageDesign } from "@/lib/homepageDesignRequest";

export async function POST(request: Request) {
  return changeHomepageDesign(request, {
    origin: ownerAuthOrigin,
    session: ownerSession,
    save: saveHomepageDesign,
    invalidate: () => revalidatePath("/"),
  });
}
