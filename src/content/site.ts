import { placeholder as markPending } from "@/lib/placeholder";
import { heroImage, problemImage } from "./images";
import type { SiteContent } from "./types";

export const PRODUCT_NAME = "Schmeide";

export const DOMAIN = "schmeide.com";

export const SITE_URL = `https://${DOMAIN}`;

export const PLACEHOLDER_LABEL = "Placeholder";

const placeholder = (note: string, fallback: string | null = null) =>
  markPending(`${PLACEHOLDER_LABEL}: ${note}`, fallback);

const TAGLINE =
  "Tell us about your business. We will build the software for it.";

export const site = {
  meta: {
    title: `${PRODUCT_NAME}: software for your small business, built and run for you`,
    tagline: TAGLINE,
    description: `${PRODUCT_NAME} builds software for small businesses. We ask questions, show you designs, build only what you approve, and keep it running.`,
  },

  nav: {
    label: "Main",
    menuLabel: "Menu",
    skipLinkLabel: "Skip to main content",
    links: [
      { label: "How it works", href: "#how" },
      { label: "What you get", href: "#what-you-get" },
      { label: "Questions", href: "#faq" },
    ],
    cta: { label: "Get early access", href: "#early-access" },
  },

  hero: {
    heading: {
      before: "Tell us about your business. We will build the ",
      highlight: "software",
      after: " for it.",
    },
    lead: "No code, no dev team to hire. We ask good questions, show you designs, and build only what you approve. Then we keep it running for you.",
    primaryCta: { label: "Join the early-access list", href: "#early-access" },
    secondaryCta: { label: "How it works", href: "#how" },
    conversation: {
      label: "Example conversation",
      ownerSpeaker: "Business owner",
      ourSpeaker: PRODUCT_NAME,
      ownerMessage:
        "I run a small bakery. I want people to order custom cakes online and pick a time to collect them.",
      questions: [
        "How far ahead do people usually order?",
        "Do you take a deposit, or payment in full?",
        "Which parts of a cake can customers change?",
      ],
      caption: "We keep asking until we understand. Then we show you designs.",
    },
    image: heroImage,
  },

  problem: {
    heading: "Good software is still hard to get",
    lead: "You know your business. Getting software built for it is the hard part.",
    points: [
      {
        title: "Hiring developers is slow and costly",
        body: "Finding a team, explaining your business to them and managing the work is a job of its own. You already have one.",
      },
      {
        title: "Ready-made tools fit someone else",
        body: "Apps off the shelf are made for the average business. Yours has its own way of taking orders, booking time and getting paid.",
      },
      {
        title: "One-prompt AI builders stop at the demo",
        body: "You type a sentence and get an app. It looks finished until real customers use it. Then the missing details show up.",
      },
      {
        title: "Launch day is the start, not the end",
        body: "Software needs hosting, updates and someone watching when things go wrong. That work does not stop.",
      },
    ],
    image: problemImage,
  },

  howItWorks: {
    heading: "From your idea to a running business",
    lead: "Six steps. You are in the loop for the decisions. We handle the rest.",
    ownerLabel: "You",
    weLabel: "We",
    checksLabel: "Before it moves on",
    phases: [
      {
        id: "understand",
        title: "First, we understand your business",
        summary: "Nothing is built yet. We get it right on paper first.",
      },
      {
        id: "run",
        title: "Then, we build it and run it safely",
        summary:
          "We build what you approved, and every piece is checked before it ships.",
      },
    ],
    steps: [
      {
        id: "questions",
        phase: "understand",
        title: "We ask questions",
        description:
          "About your business, your customers and what you want to happen. We keep asking until we understand.",
        ownerDoes: "Answer in your own words. No technical terms needed.",
        weDo: "Ask, listen and write down what we learn.",
        isApprovalGate: false,
        checks: [],
      },
      {
        id: "designs",
        phase: "understand",
        title: "You review designs",
        description:
          "See real screens before anything is built. Tell us what to change and we refine them.",
        ownerDoes: "Look at the screens and say what is wrong or missing.",
        weDo: "Draw the screens, then redraw them until they fit.",
        isApprovalGate: false,
        checks: [],
      },
      {
        id: "approval",
        phase: "understand",
        title: "You say yes",
        description:
          "Nothing is built until you approve. This is the most important step.",
        ownerDoes: "Approve the designs when they match what you want.",
        weDo: "Turn the approved designs into a detailed plan.",
        isApprovalGate: true,
        checks: ["Your approval"],
      },
      {
        id: "build",
        phase: "run",
        title: "We build it",
        description:
          "In small pieces. The plan is split into large goals, then tasks, then small units of work.",
        ownerDoes: "Nothing is required. You can follow the progress.",
        weDo: "Build each piece and check it against the plan.",
        isApprovalGate: false,
        checks: ["Each piece passes its checks", "The whole is checked again"],
      },
      {
        id: "launch",
        phase: "run",
        title: "It goes live",
        description:
          "On real servers, watched from day one. You see usage and costs in one dashboard.",
        ownerDoes: "Open it, use it and share it with your customers.",
        weDo: "Release it in careful steps and watch how it behaves.",
        isApprovalGate: false,
        checks: ["Monitoring is on from day one"],
      },
      {
        id: "care",
        phase: "run",
        title: "We look after it",
        description:
          "We keep improving it, and if an update goes wrong, we undo it.",
        ownerDoes: "Tell us what you want next.",
        weDo: "Monitor it, update it and undo any update that causes trouble.",
        isApprovalGate: false,
        checks: ["Every update passes the same checks"],
      },
    ],
  },

  whatYouGet: {
    heading: "What you get",
    lead: "Not only an app. Software that is hosted, watched and looked after.",
    items: [
      {
        title: "Software made for your business",
        body: "Built from your answers and the designs you approved. Not a template with your logo on it.",
      },
      {
        title: "Real hosting",
        body: "Your software runs on real servers, not on a demo link. You do not set up or manage any of it.",
      },
      {
        title: "Someone watching",
        body: "We monitor your software, so we notice problems instead of waiting for you to report them.",
      },
      {
        title: "Safe updates",
        body: "Changes go out in careful steps, called rollouts. If one causes trouble, we roll it back: we return to the version that worked.",
      },
      {
        title: "One dashboard",
        body: "See how much your software is used and what it costs, in one place.",
      },
      {
        title: "Work that continues",
        body: "We keep improving your software after launch. Every change goes through the same checks.",
      },
    ],
    preview: {
      usageLabel: "Usage",
      costLabel: "Costs",
      caption:
        "An illustration, not real data. Your dashboard shows your own usage and costs.",
    },
  },

  whyDifferent: {
    heading: "Good input in, checked output out",
    lead: "Software a business can run on does not come from one prompt. It comes from understanding the business first and checking the work before it ships.",
    items: [
      {
        title: "The whole job, in one service",
        body: "Questions, designs, building, hosting and upkeep. You do not stitch five tools together.",
      },
      {
        title: "Understanding before code",
        body: "We do not start from a single sentence. We start from many questions and a design you approved.",
      },
      {
        title: "Run by people who keep software running",
        body: "Our background is production operations: the work of keeping live systems healthy.",
      },
      {
        title: "Continuous work, with checks",
        body: "Work on your software continues around the clock. Nothing ships until it passes its checks.",
      },
    ],
  },

  proof: {
    heading: "We use it ourselves",
    lead: "We are early, and we would rather show you one real thing than a wall of logos.",
    quark: {
      title: "Quark",
      body: "We built Quark with this factory, and we run it with the factory today.",
    },
    details: [
      placeholder("what Quark is, in one plain sentence"),
      placeholder("a link to Quark"),
      placeholder("Quark screenshots"),
      placeholder(
        "whether to mention the open-source factory repo, which is early and still being designed",
      ),
    ],
    stories: [
      placeholder("first customer case study"),
      placeholder("customer testimonial"),
      placeholder(
        "more customer stories",
        "Stories from the first businesses will appear here.",
      ),
    ],
  },

  team: {
    heading: "Who is behind it",
    lead: "Our background is production operations, also called site reliability engineering (SRE). That is the work of keeping live software running.",
    members: [
      {
        name: placeholder("founder name"),
        role: placeholder("founder role"),
        bio: placeholder("founder bio"),
        photo: null,
      },
      {
        name: placeholder("founder name"),
        role: placeholder("founder role"),
        bio: placeholder("founder bio"),
        photo: null,
      },
    ],
  },

  earlyAccess: {
    heading: "Get on the early-access list",
    lead: "We are starting with a small group of businesses. Tell us a little about yours.",
    explainer: placeholder(
      "what early access includes",
      "Early access means we work with a few businesses at a time, starting with people on this list.",
    ),
    pricing: placeholder(
      "pricing to be decided",
      "Pricing is not set yet. Joining the list is free and commits you to nothing.",
    ),
  },

  faq: {
    heading: "Fair questions",
    lead: "If yours is not here, ask us when you join.",
    items: [
      {
        question: "Do I need to know how to code?",
        answer:
          "No. You tell us about your business and react to designs. We handle the technical side.",
      },
      {
        question: "What kind of software do you build?",
        answer: placeholder(
          "the kinds of software we build, to be confirmed",
          "Software a small business runs on, such as taking orders or bookings online. Tell us what you need and we will say honestly whether it fits.",
        ),
      },
      {
        question: "What is automated, and what does a person check?",
        answer: placeholder(
          "what a person reviews on our side, to be confirmed",
          "Much of the building is automated, and every piece must pass checks before it ships. You review and approve the designs before anything is built.",
        ),
      },
      {
        question: "Who owns the software?",
        answer: placeholder("ownership terms to be confirmed"),
      },
      {
        question: "What happens if something breaks?",
        answer: placeholder(
          "support details",
          "We monitor it, and we can roll back a bad update.",
        ),
      },
      {
        question: "Is there anything you will not build?",
        answer: placeholder("list to be confirmed"),
      },
      {
        question: "How long does it take?",
        answer:
          "It depends on what you need. We will not promise a date before we understand the work.",
      },
      {
        question: "What does it cost?",
        answer: placeholder(
          "pricing to be decided",
          "Pricing is not set yet. Joining the list is free.",
        ),
      },
    ],
  },

  finalCta: {
    heading: "Tell us about your business",
    lead: "Join the early-access list. It takes a minute.",
    cta: { label: "Join the early-access list", href: "#early-access" },
  },

  footer: {
    name: PRODUCT_NAME,
    domain: DOMAIN,
    copyright: "Copyright",
    contact: placeholder("contact email address"),
    legalLabel: "Legal",
    legalLinks: [
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
    ],
  },

  waitlistForm: {
    fields: {
      name: { label: "Your name", example: null },
      email: { label: "Email", example: null },
      business: {
        label: "Your business, in one line",
        example: "For example: a bakery that wants online orders",
      },
    },
    errors: {
      name_required: "Please enter your name.",
      email_required: "Please enter your email address.",
      email_invalid: "That email address does not look right. Please check it.",
      business_required: "Please tell us about your business in one line.",
      business_too_long: "Please keep this to 280 characters or fewer.",
    },
    honeypotLabel: "Leave this field empty",
    submitLabel: "Join the list",
    submittingLabel: "Sending",
    saved: "Thank you. You are on the list.",
    unconfigured:
      "Sign-ups are not open yet, so your details were not saved. Please come back soon.",
    failed:
      "Something went wrong and your details were not saved. Please try again.",
    needsJavaScript:
      "This form needs JavaScript. Please turn it on in your browser to join the list.",
  },

  privacy: {
    title: "Privacy",
    description: `How ${PRODUCT_NAME} handles your information.`,
    body: placeholder(
      "legal text to be supplied",
      "We are still writing this page.",
    ),
    homeLink: { label: "Back to the home page", href: "/" },
  },

  terms: {
    title: "Terms",
    description: `The terms for using ${PRODUCT_NAME}.`,
    body: placeholder(
      "legal text to be supplied",
      "We are still writing this page.",
    ),
    homeLink: { label: "Back to the home page", href: "/" },
  },

  notFound: {
    heading: "This page does not exist",
    body: "The link may be old or mistyped.",
    homeLink: { label: "Back to the home page", href: "/" },
  },
} as const satisfies SiteContent;
