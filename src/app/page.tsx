import { PRODUCT_NAME } from "@/content";

export default function HomePage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-page items-center px-gutter py-section"
    >
      <h1 className="font-display text-display-1">
        <span className="rounded-highlight bg-butter px-1.5">
          {PRODUCT_NAME}
        </span>
      </h1>
    </main>
  );
}
