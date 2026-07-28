import useMiniGames from '@/shared/hooks/useMiniGames';

const MiniGameModalWrap = () => {
  const { renderModals } = useMiniGames();
  return <>{renderModals()}</>;
};

export default MiniGameModalWrap;
