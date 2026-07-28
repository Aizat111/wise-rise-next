import Card from '../../card/Card';

const PlinkoTab = (): React.ReactNode => {
  return (
    <Card className="flex flex-col rounded-lg max-sm:p-2">
      <div className="flex flex-col w-full p-6 gap-6 text-[14px] font-medium leading-[18.9px]">
        <span className="text-[18px] font-bold leading-[24.3px]">Plinko</span>
        <div className="flex flex-col gap-6">
          <p className="max-w-[600px]">
            Each result for the Plinko game is generated using a combination of a server seed, client seed and a nonce.
            The nonce increases from 0 everytime you play a game, the server seeds reset every 24 hours.
          </p>
          <p className="max-w-[600px]">
            The provably fair generates a number from 0 to 1, if the number is below 0.5, the ball will go left, if the
            number is above 0.5, the ball will go right. Depending on the number of rows, an array of "lefts" and
            "rights" will be generated that can be used to understand which multiplier the ball will end up in.
          </p>
          <p className="max-w-[600px]">
            If the provably fair directs the ball into one of the objects in Toshi Valhalla mode, the result will be 0.
          </p>
          <p className="max-w-[600px]">
            You can replicate any past result by using the following JS code below. You should use the unhashed server
            seed with the script.
          </p>
        </div>
        <div className="rounded-lg bg-bg_menu p-4 overflow-x-auto max-sm:max-w-[320px]">
          <pre className="whitespace-pre text-[12px] leading-[1.5] overflow-x-auto">
            <code className="overflow-x-auto">
              {`const generateBallPath = async ("SERVERSEED", "CLIENTSEED", "NONCE", "AMOUNTOFROWS") => {
  const bytes = Math.floor(53 / 4);
  const maxValue = Math.pow(2, 52);
  const outcomeArray = [];
  const hashOffsetBytes = 8;
  const numHashes = Math.floor(rowsCount / hashOffsetBytes) + 1;

  let hashString = "";
  for (let currentCursor = 0; currentCursor <= numHashes; currentCursor++) {
    hashString += crypto
      .createHash("sha256")
      .update(\`\${serverSeed}\${clientSeed}\${nonce}\${currentCursor}\`)
      .digest("hex");
  }

  for (let i = 0; i < rowsCount; i++) {
    const offset = i * hashOffsetBytes;
    const sliceChunk = hashString.slice(offset, offset + bytes);
    outcomeArray.push(parseInt(sliceChunk, 16) / maxValue);
  }

  return outcomeArray;
};`}
            </code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default PlinkoTab;
