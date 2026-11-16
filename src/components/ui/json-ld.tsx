import { serializeJsonLd } from "@/lib/structured-data";
import type { JsonLdObject } from "@/lib/structured-data";

export type JsonLdProps = {
  readonly data: JsonLdObject;
};

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
  />
);
