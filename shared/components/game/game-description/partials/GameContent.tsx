import Description from './Description';

const GameContent = ({ data, locale }: { data: { body?: Record<string, unknown> } | null; locale: string }) => {
  return (
    <div className="flex flex-col gap-4">
      <Description data={data} locale={locale} />
    </div>
  );
};

export default GameContent;
