import { describe, expect, it } from "vitest";
import {
  faqPageJsonLd,
  organizationJsonLd,
  serializeJsonLd,
} from "./structured-data";

describe("structured data", () => {
  it("builds a FAQPage from answered questions", () => {
    expect(faqPageJsonLd([{ question: "Why?", answer: "Because." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why?",
          acceptedAnswer: { "@type": "Answer", text: "Because." },
        },
      ],
    });
  });

  it("builds an Organization", () => {
    expect(
      organizationJsonLd({
        name: "Example",
        url: "https://example.com",
        description: "An example.",
      }),
    ).toMatchObject({ "@type": "Organization", name: "Example" });
  });

  it("escapes angle brackets so the script tag cannot be closed", () => {
    expect(serializeJsonLd({ text: "</script>" })).not.toContain("<");
  });
});
