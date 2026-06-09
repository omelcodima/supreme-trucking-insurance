import type { BlogPost } from "@/lib/blogPosts";

const baseTags = ["trucking insurance", "commercial truck insurance", "Supreme Trucking Insurance"];

function unique(values: string[]) {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

export function getPostTags(post: Pick<BlogPost, "title" | "category" | "sourceTitle" | "tags">) {
  if (post.tags?.length) {
    return unique([...post.tags, ...baseTags]).slice(0, 12);
  }

  const text = `${post.title} ${post.category} ${post.sourceTitle || ""}`.toLowerCase();
  const tags = [post.category, ...baseTags];

  if (text.includes("fmcsa")) tags.push("FMCSA", "DOT compliance");
  if (text.includes("dot")) tags.push("DOT compliance");
  if (text.includes("qualification") || text.includes("exemption")) {
    tags.push("driver qualification", "motor carrier compliance");
  }
  if (text.includes("safety") || text.includes("inspection")) {
    tags.push("trucking safety", "underwriting review");
  }
  if (text.includes("cargo") || text.includes("reefer")) {
    tags.push("cargo insurance", "motor truck cargo");
  }
  if (text.includes("fleet")) tags.push("fleet insurance", "fleet renewal");
  if (text.includes("owner") || text.includes("operator")) tags.push("owner-operator insurance");
  if (text.includes("new authority") || text.includes("authority")) {
    tags.push("new authority insurance", "MC number", "insurance filings");
  }
  if (text.includes("premium") || text.includes("rate") || text.includes("cost")) {
    tags.push("truck insurance cost", "insurance premiums");
  }
  if (text.includes("liability")) tags.push("trucking liability insurance");
  if (text.includes("broker") || text.includes("freight")) tags.push("freight brokers", "trucking operations");

  return unique(tags).slice(0, 12);
}

export function getPostImageAlt(post: Pick<BlogPost, "title" | "category" | "imageAltText" | "sourceTitle" | "tags">) {
  if (post.imageAltText) {
    return post.imageAltText;
  }

  const tags = getPostTags(post).slice(0, 4).join(", ");
  return `Professional semi truck image for Supreme Trucking Insurance article about ${post.title}, covering ${tags}.`;
}

export function getRelatedServiceLinks(post: Pick<BlogPost, "title" | "category" | "sourceTitle" | "tags">) {
  const tags = getPostTags(post).join(" ").toLowerCase();
  const links = [
    {
      href: "/instant-indication",
      label: "Start with a DOT indication",
      description: "Use your DOT number to start a quick non-binding insurance indication.",
    },
    {
      href: "/quote",
      label: "Request a trucking insurance quote",
      description: "Send the operation details Supreme needs for market review.",
    },
  ];

  if (tags.includes("cargo")) {
    links.unshift({
      href: "/cargo",
      label: "Review cargo insurance options",
      description: "Prepare cargo type, load value, limits, radius, and broker requirements.",
    });
  }

  if (tags.includes("fleet")) {
    links.unshift({
      href: "/fleet",
      label: "Prepare a fleet renewal",
      description: "Organize units, drivers, loss runs, filings, and renewal timing.",
    });
  }

  if (tags.includes("owner-operator")) {
    links.unshift({
      href: "/owner-operator",
      label: "Owner-operator insurance",
      description: "Review liability, cargo, physical damage, bobtail, and non-trucking needs.",
    });
  }

  if (tags.includes("new authority") || tags.includes("filings")) {
    links.unshift({
      href: "/new-venture",
      label: "New authority insurance",
      description: "Understand filings, liability, cargo, and first-policy preparation.",
    });
  }

  return links.slice(0, 3);
}
