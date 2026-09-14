import { findNearDuplicateBlogTopic } from "./blogTopicSimilarity.ts";

type TitledPost = {
  title: string;
};

type GenerateFirstUniqueBlogPostOptions<TSource, TPost extends TitledPost> = {
  sources: readonly TSource[];
  existingTitles: readonly string[];
  generate: (source: TSource) => Promise<TPost>;
  maxAttempts?: number;
  onDuplicate?: (event: {
    attempt: number;
    source: TSource;
    post: TPost;
    existingTitle: string;
  }) => void;
};

export async function generateFirstUniqueBlogPost<TSource, TPost extends TitledPost>({
  sources,
  existingTitles,
  generate,
  maxAttempts = 3,
  onDuplicate,
}: GenerateFirstUniqueBlogPostOptions<TSource, TPost>): Promise<{
  source: TSource;
  post: TPost;
  attempts: number;
} | null> {
  const attemptLimit = Math.min(
    sources.length,
    Math.max(1, Math.floor(maxAttempts)),
  );

  for (let index = 0; index < attemptLimit; index += 1) {
    const source = sources[index];
    const post = await generate(source);
    const duplicate = findNearDuplicateBlogTopic(post.title, [...existingTitles]);

    if (!duplicate) {
      return {
        source,
        post,
        attempts: index + 1,
      };
    }

    onDuplicate?.({
      attempt: index + 1,
      source,
      post,
      existingTitle: duplicate.existingTitle,
    });
  }

  return null;
}
