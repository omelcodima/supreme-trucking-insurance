import QuoteExperience from "@/components/QuoteExperience";

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <QuoteExperience
      coverage={
        typeof params.coverage === "string" ? params.coverage : undefined
      }
      operation={
        typeof params.operation === "string" ? params.operation : undefined
      }
      full={params.mode === "full"}
    />
  );
}
