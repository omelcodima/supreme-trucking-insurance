"use client";

import { useMemo, useState } from "react";

type SocialShareButtonsProps = {
  title: string;
  url: string;
  description?: string;
  className?: string;
};

const buttonBase =
  "inline-flex items-center justify-center rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5A4B3B] transition-all hover:-translate-y-0.5 hover:border-[#f97316]/60 hover:bg-[#FFF7ED] hover:text-[#9A4D00] focus:outline-none focus:ring-2 focus:ring-[#f97316]/35";

export function SocialShareButtons({ title, url, description, className = "" }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const links = useMemo(() => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || title);

    return [
      {
        name: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        name: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      },
      {
        name: "X",
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      },
      {
        name: "Email",
        href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      },
      {
        name: "Text",
        href: `sms:?&body=${encodedTitle}%20${encodedUrl}`,
      },
    ];
  }, [description, title, url]);

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text: description || title, url });
      return;
    }

    await handleCopy();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={className}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7B6B59]">
        Share this update
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={handleNativeShare} className={buttonBase}>
          Share
        </button>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.name === "Email" || link.name === "Text" ? undefined : "_blank"}
            rel={link.name === "Email" || link.name === "Text" ? undefined : "noopener noreferrer"}
            className={buttonBase}
          >
            {link.name}
          </a>
        ))}
        <button type="button" onClick={handleCopy} className={buttonBase}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
