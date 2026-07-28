import { gameDescriptionBodyToHtml } from '@/shared/utils/gameDescriptionPortableTextToHtml';

type Props = {
  data: { body?: Record<string, unknown> } | null;
  locale: string;
};

const Description = ({ data, locale }: Props) => {
  const bodyContent = data?.body?.[locale] ?? data?.body?.en;
  const html = bodyContent ? gameDescriptionBodyToHtml(bodyContent) : '';

  if (!html) return null;

  return (
    <div
      className="game-description-portable-text"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Description;
