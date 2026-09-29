"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface KatexRendererProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export const KatexRenderer: React.FC<KatexRendererProps> = ({
  latex,
  block = false,
  className = "",
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error("KaTeX rendering error:", e);
      return latex;
    }
  }, [latex, block]);

  return (
    <div
      className={`overflow-x-auto my-2 py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
