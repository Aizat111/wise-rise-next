import Card from '../../card/Card';

const MinesTab = (): React.ReactNode => {
  return (
    <Card className="flex flex-col rounded-lg">
      <div className="flex flex-col w-full p-6 gap-6 text-[14px] font-medium leading-[18.9px]">
        <span className="text-[18px] font-bold leading-[24.3px]">Mines</span>
        <div className="flex flex-col gap-6">
          <p className="max-w-[600px]">
            Each result for the Mines game is generated using a combination of a server seed, client seed and a nonce.
            The nonce increases from 0 everytime you play a game.
          </p>
          <p className="max-w-[600px]">
            The server seed is visible in hashed form prior to the round being started, allowing you to be sure that the
            outcome has been pre-determined and not changed after the result was generated.
          </p>
          <p className="max-w-[600px]">
            You can replicate any past result by using the following JS code below. You should use the unhashed server
            seed with the script.
          </p>
        </div>
        <div className="rounded-lg bg-bg_menu p-4 overflow-x-auto max-sm:max-w-full">
          <pre className="whitespace-pre text-[12px] leading-[1.5] overflow-x-auto">
            <code className="overflow-x-auto">
              {`async function generateMinePositions(serverSeed, clientSeed, nonce, minesCount) {
    const gameHash = crypto
        .createHash('sha256')
        .update({serverSeed}{clientSeed}{nonce}{minesCount})
        .digest('hex');

    let grid = [];
    for (let i = 0; i < 25; i++) grid.push(i);

    let minePositions = [];
    let currentIndex = 0;
    while (minePositions.length < minesCount) {
        const position = parseInt(gameHash.substring(currentIndex, currentIndex + 2), 16);
        const gridPosition = position % grid.length;
        if (!minePositions.includes(grid[gridPosition])) minePositions.push(grid[gridPosition]);
        grid.splice(gridPosition, 1);
        currentIndex += 2;
        if (currentIndex >= gameHash.length) currentIndex = 0;
    }
    return minePositions.sort((a, b) => a - b);
}`}
            </code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default MinesTab;
