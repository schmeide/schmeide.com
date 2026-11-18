import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/page-intro";
import { FinalCta } from "@/components/sections/final-cta";
import { SampleSpec } from "@/components/sections/sample-spec";
import { Screenshots } from "@/components/sections/screenshots";
import { UseCasePain } from "@/components/sections/use-case-pain";
import { site } from "@/content";
import { LAUNCH_MODE, PLACEHOLDER_MODE } from "@/lib/env";
import { pickForMode } from "@/lib/launch-mode";
import { isListed } from "@/lib/ready";
import { withStartingPoint } from "@/lib/starting-points";
import { innerPageMetadata, mainCta } from "../../pages";

export const dynamicParams = false;

const findUseCase = (slug: string) =>
  site.useCases.find(
    (useCase) => useCase.slug === slug && isListed(useCase, PLACEHOLDER_MODE),
  ) ?? notFound();

export const generateStaticParams = () =>
  site.useCases.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/for/[slug]">): Promise<Metadata> =>
  innerPageMetadata(findUseCase((await params).slug));

export default async function UseCasePage({
  params,
}: PageProps<"/for/[slug]">) {
  const useCase = findUseCase((await params).slug);
  const labels = site.useCasePage;
  return (
    <main id="main">
      <PageIntro heading={useCase.heading} lead={useCase.lead} />
      <UseCasePain heading={labels.painHeading} pain={useCase.pain} />
      <SampleSpec
        heading={labels.specHeading}
        lead={labels.specLead}
        labels={labels.specParts}
        spec={useCase.sampleSpec}
      />
      <Screenshots
        heading={labels.screenshotsHeading}
        images={useCase.screenshots}
      />
      <FinalCta
        content={{
          heading: labels.ctaHeading,
          lead: pickForMode(labels.ctaLead, LAUNCH_MODE),
        }}
        cta={{
          label: mainCta.label,
          href: withStartingPoint(mainCta.href, useCase.startingPoint),
        }}
      />
    </main>
  );
}
