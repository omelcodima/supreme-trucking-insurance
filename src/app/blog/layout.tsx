import { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Consider adding a blog-specific header/nav here */}
      {children}
      {/* Consider adding a blog-specific footer here */}
    </div>
  );
}
