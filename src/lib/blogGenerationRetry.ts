type RetryMalformedBlogGenerationOptions = {
  maxAttempts?: number;
  onRetry?: (event: { attempt: number; error: Error }) => void;
};

function isRetryableMalformedGeneration(error: unknown): error is Error {
  return (
    error instanceof SyntaxError ||
    (error instanceof Error && error.message.startsWith('OpenAI response did not include'))
  );
}

export async function retryMalformedBlogGeneration<T>(
  generate: (attempt: number) => Promise<T>,
  options: RetryMalformedBlogGenerationOptions = {},
): Promise<T> {
  const maxAttempts = Math.max(1, Math.floor(options.maxAttempts ?? 2));

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await generate(attempt);
    } catch (error) {
      if (attempt === maxAttempts || !isRetryableMalformedGeneration(error)) {
        throw error;
      }

      options.onRetry?.({ attempt, error });
    }
  }

  throw new Error('Blog generation retry loop ended unexpectedly.');
}
