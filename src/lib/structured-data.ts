export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue };

export type JsonLdObject = { readonly [key: string]: JsonLdValue };

export type AnsweredQuestion = {
  readonly question: string;
  readonly answer: string;
};

export type OrganizationInput = {
  readonly name: string;
  readonly url: string;
  readonly description: string;
};

export const faqPageJsonLd = (
  entries: readonly AnsweredQuestion[],
): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entries.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

export const organizationJsonLd = ({
  name,
  url,
  description,
}: OrganizationInput): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name,
  url,
  description,
});

export const serializeJsonLd = (data: JsonLdObject): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
