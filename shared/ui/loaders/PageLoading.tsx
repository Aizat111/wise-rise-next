import { Spinnertext, Toshi } from '@/shared/assets/loading';

const PageLoading = () => {
  return (
    <div className="contents-container min-h-screen mx-auto">
      <div className="pb-16 bg-bg_color flex items-start justify-center min-h-screen pt-[36vh]">
        <div className="relative inline-flex items-center justify-center animate-pulse-in">
          <Spinnertext width={120} height={120} className="animate-spin" style={{ animationDuration: '6s' }} />
          <Toshi
            width={120}
            height={120}
            className="absolute ml-[6.4px] mt-[6px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
