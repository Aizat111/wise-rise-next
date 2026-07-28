import { useEffect, useState } from 'react';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import type { IBannersResponse } from '@/core/types/user.types';
import { Alert } from '@/shared/ui/alerts';

const ChatBanners = () => {
  const banners = useFetcher<IBannersResponse>(TYPES.GET_BANNERS).render({ category: 'text-based' });
  const [visibleBanners, setVisibleBanners] = useState<IBannersResponse['banners']>([]);

  useEffect(() => {
    setVisibleBanners(banners?.data?.banners || []);
  }, [banners?.data?.banners]);

  return (
    visibleBanners.length > 0 && (
      <div className="fixed top-30 md:top-0 pt-5 w-full md:max-w-[250px] pb-8 z-10 pl-4 pr-4 bg-gradient-to-b from-bg_content via-bg_content/100 via-80% to-transparent">
        {visibleBanners?.map(banner => (
          <Alert
            key={banner.category}
            title={banner.title}
            description={banner.description}
            image={banner.image}
            variant="announcement"
            size="sm"
            layout="vertical"
            dismissible={true}
            onDismiss={() => {
              setVisibleBanners(visibleBanners.filter(b => b.category !== banner.category));
            }}
            visible={true}
          />
        ))}
      </div>
    )
  );
};

export default ChatBanners;
