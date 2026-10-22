import { NextResponse, type NextRequest } from "next/server";
import { siteMaintenanceResponse } from "./lib/siteMaintenance";

export function proxy(request: NextRequest) {
  // Public maintenance stays on until explicitly disabled for reopening.
  return siteMaintenanceResponse(request.nextUrl.pathname, process.env.WEBSITE_MAINTENANCE !== "false") ?? NextResponse.next();
}
