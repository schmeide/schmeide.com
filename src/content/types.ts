import type { ImageSlot } from "@/lib/images/types";
import type { WaitlistError, WaitlistField } from "@/lib/waitlist/types";
import type { AppHref } from "@/lib/href";
import type { ByLaunchMode } from "@/lib/launch-mode";
import type { Copy, Placeholder } from "@/lib/placeholder";
import type { StartingPointId } from "@/lib/starting-points";

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

export type UseCaseHref = `/for/${string}/`;

export type PageHref =
  "/" | "/privacy/" | "/terms/" | "/early-access/" | UseCaseHref;

export type HomeAnchorHref = `/${SectionHref}`;

export type LinkContent = {
  readonly label: string;
  readonly href: SectionHref | HomeAnchorHref | PageHref | AppHref;
};

export type InnerPageContent = {
  readonly href: PageHref;
  readonly navLabel: string;
  readonly title: string;
  readonly description: string;
  readonly lead: Copy;
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
  readonly signIn: LinkContent;
};

export type HighlightedHeading = {
  readonly before: string;
  readonly highlight: string;
  readonly after: string;
};

export type ConversationContent = {
  readonly label: string;
  readonly ownerSpeaker: string;
  readonly ourSpeaker: string;
  readonly ownerMessage: string;
  readonly questions: readonly string[];
  readonly caption: string;
};

export type HeroContent = {
  readonly heading: HighlightedHeading;
  readonly accountability: Copy;
  readonly lead: string;
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

export type DashboardPreviewContent = {
  readonly usageLabel: string;
  readonly costLabel: string;
  readonly caption: Copy;
};

export type WhatYouGetContent = SectionIntro & {
  readonly items: readonly TitledItem[];
  readonly preview: DashboardPreviewContent;
};

export type WhyDifferentContent = SectionIntro & {
  readonly items: readonly TitledItem[];
};

export type ProofContent = SectionIntro & {
  readonly quark: TitledItem;
  readonly details: readonly Copy[];
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
  readonly explainer: Copy;
  readonly pricing: Copy;
};

export type FaqItem = {
  readonly question: string;
  readonly answer: Copy;
};

export type FaqContent = SectionIntro & {
  readonly items: readonly FaqItem[];
};

export type FinalCtaContent = SectionIntro;

export type FooterContent = {
  readonly name: string;
  readonly domain: string;
  readonly copyright: string;
  readonly contact: Copy;
  readonly pagesLabel: string;
  readonly legalLabel: string;
  readonly legalLinks: readonly LinkContent[];
};

export type LegalPageContent = {
  readonly title: string;
  readonly description: string;
  readonly body: Copy;
  readonly homeLink: LinkContent;
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
  readonly honeypotLabel: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly saved: string;
  readonly unconfigured: string;
  readonly failed: string;
  readonly needsJavaScript: string;
};

export type SpecPart = "users" | "does" | "screens" | "keeps" | "replaces";

export type UseCaseContent = InnerPageContent & {
  readonly href: UseCaseHref;
  readonly slug: string;
  readonly startingPoint: StartingPointId;
  readonly trade: string;
  readonly heading: string;
  readonly pain: Copy;
  readonly sampleSpec: Readonly<Record<SpecPart, Copy>>;
  readonly screenshots: readonly ImageSlot[] | Placeholder;
};

export type UseCasePageContent = {
  readonly painHeading: string;
  readonly specHeading: string;
  readonly specLead: string;
  readonly specParts: Readonly<Record<SpecPart, string>>;
  readonly screenshotsHeading: string;
  readonly ctaHeading: string;
  readonly ctaLead: ByLaunchMode<string>;
};

export type SiteContent = {
  readonly meta: MetaContent;
  readonly mainCta: ByLaunchMode<LinkContent>;
  readonly nav: NavContent;
  readonly hero: HeroContent;
  readonly problem: ProblemContent;
  readonly howItWorks: HowItWorksContent;
  readonly whatYouGet: WhatYouGetContent;
  readonly whyDifferent: WhyDifferentContent;
  readonly proof: ProofContent;
  readonly team: TeamContent;
  readonly earlyAccess: EarlyAccessContent;
  readonly earlyAccessPage: InnerPageContent;
  readonly useCasePage: UseCasePageContent;
  readonly useCases: readonly UseCaseContent[];
  readonly faq: FaqContent;
  readonly finalCta: FinalCtaContent;
  readonly footer: FooterContent;
  readonly waitlistForm: WaitlistFormContent;
  readonly privacy: LegalPageContent;
  readonly terms: LegalPageContent;
  readonly notFound: NotFoundContent;
};
