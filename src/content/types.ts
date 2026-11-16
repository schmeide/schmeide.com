import type { ImageSlot } from "@/lib/images/types";
import type { WaitlistError, WaitlistField } from "@/lib/waitlist/types";
import type { Copy } from "@/lib/placeholder";

export type SectionId =
  | "problem"
  | "how"
  | "what-you-get"
  | "why-different"
  | "proof"
  | "team"
  | "early-access"
  | "faq";

export type SectionHref = `#${SectionId}`;

export type PageHref = "/" | "/privacy/" | "/terms/";

export type LinkContent = {
  readonly label: string;
  readonly href: SectionHref | PageHref;
};

export type SectionIntro = {
  readonly heading: string;
  readonly lead: Copy | null;
};

export type TitledItem = {
  readonly title: string;
  readonly body: Copy;
};

export type MetaContent = {
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
};

export type NavContent = {
  readonly label: string;
  readonly menuLabel: string;
  readonly skipLinkLabel: string;
  readonly links: readonly LinkContent[];
  readonly cta: LinkContent;
};

export type HighlightedHeading = {
  readonly before: string;
  readonly highlight: string;
  readonly after: string;
};

export type ConversationContent = {
  readonly label: string;
  readonly ownerMessage: string;
  readonly questions: readonly string[];
  readonly caption: string;
};

export type HeroContent = {
  readonly heading: HighlightedHeading;
  readonly lead: string;
  readonly primaryCta: LinkContent;
  readonly secondaryCta: LinkContent;
  readonly conversation: ConversationContent;
  readonly image: ImageSlot | null;
};

export type ProblemContent = SectionIntro & {
  readonly points: readonly TitledItem[];
  readonly image: ImageSlot | null;
};

export type PipelinePhaseId = "understand" | "run";

export type PipelineStep = {
  readonly id: string;
  readonly phase: PipelinePhaseId;
  readonly title: string;
  readonly description: string;
  readonly ownerDoes: string;
  readonly weDo: string;
  readonly isApprovalGate: boolean;
  readonly checks: readonly string[];
};

export type PipelinePhase = {
  readonly id: PipelinePhaseId;
  readonly title: string;
  readonly summary: string;
};

export type HowItWorksContent = SectionIntro & {
  readonly ownerLabel: string;
  readonly weLabel: string;
  readonly checksLabel: string;
  readonly phases: readonly PipelinePhase[];
  readonly steps: readonly PipelineStep[];
};

export type WhatYouGetContent = SectionIntro & {
  readonly items: readonly TitledItem[];
};

export type WhyDifferentContent = SectionIntro & {
  readonly items: readonly TitledItem[];
};

export type ProofContent = SectionIntro & {
  readonly quark: TitledItem;
  readonly stories: readonly Copy[];
};

export type TeamMember = {
  readonly name: Copy;
  readonly role: Copy;
  readonly bio: Copy;
  readonly photo: ImageSlot | null;
};

export type TeamContent = SectionIntro & {
  readonly members: readonly TeamMember[];
};

export type EarlyAccessContent = SectionIntro & {
  readonly pricing: Copy;
};

export type FaqItem = {
  readonly question: string;
  readonly answer: Copy;
};

export type FaqContent = SectionIntro & {
  readonly items: readonly FaqItem[];
};

export type FinalCtaContent = SectionIntro & {
  readonly cta: LinkContent;
};

export type FooterContent = {
  readonly contact: Copy;
  readonly legalLinks: readonly LinkContent[];
};

export type LegalPageContent = {
  readonly title: string;
  readonly body: Copy;
};

export type NotFoundContent = {
  readonly heading: string;
  readonly body: string;
  readonly homeLink: LinkContent;
};

export type WaitlistFieldContent = {
  readonly label: string;
  readonly example: string | null;
};

export type WaitlistFormContent = {
  readonly fields: Readonly<Record<WaitlistField, WaitlistFieldContent>>;
  readonly errors: Readonly<Record<WaitlistError, string>>;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly saved: string;
  readonly unconfigured: string;
  readonly failed: string;
  readonly needsJavaScript: string;
};

export type SiteContent = {
  readonly meta: MetaContent;
  readonly nav: NavContent;
  readonly hero: HeroContent;
  readonly problem: ProblemContent;
  readonly howItWorks: HowItWorksContent;
  readonly whatYouGet: WhatYouGetContent;
  readonly whyDifferent: WhyDifferentContent;
  readonly proof: ProofContent;
  readonly team: TeamContent;
  readonly earlyAccess: EarlyAccessContent;
  readonly faq: FaqContent;
  readonly finalCta: FinalCtaContent;
  readonly footer: FooterContent;
  readonly waitlistForm: WaitlistFormContent;
  readonly privacy: LegalPageContent;
  readonly terms: LegalPageContent;
  readonly notFound: NotFoundContent;
};
