"use client";

import { useEffect } from "react";
import { initializeClarity } from "@/lib/clarityRuntime";

export default function ClarityAnalytics() {
  useEffect(() => { initializeClarity(); }, []);
  return null;
}
