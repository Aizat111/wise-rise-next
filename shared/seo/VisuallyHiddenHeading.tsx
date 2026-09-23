type VisuallyHiddenHeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
};

/**
 * Heading that stays in the document for crawlers and screen readers,
 * but is clipped out of the visual layout.
 */
export default function VisuallyHiddenHeading({
  as: Tag = "h1",
  children,
}: VisuallyHiddenHeadingProps) {
  return <Tag className="sr-only">{children}</Tag>;
}
