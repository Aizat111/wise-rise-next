import { TRENDING_LIST } from '@/data/games';
import { Switch } from '@/shared/ui/switch';

type TrendingListProps = {
  setSearch: (_search: string) => void;
  activeSearch: string;
};

const TrendingList = ({ setSearch, activeSearch }: TrendingListProps) => {
  const items = TRENDING_LIST.map(item => ({
    id: item.key,
    label: item.label,
    value: item.key
  }));

  return (
    <div className="w-fit overflow-x-auto max-sm:w-full no-scrollbar">
      <Switch
        items={items}
        value={activeSearch}
        onChange={value => setSearch(String(value))}
        variant="minimal"
        className="bg-toshi_body border border-gray-500"
        buttonClassName="!w-fit !flex-none"
        isTranslated={false}
        size="md"
      />
    </div>
  );
};

export default TrendingList;
