import Card from '../../card/Card';

const TowersTab = (): React.ReactNode => {
  return (
    <Card className="flex flex-col rounded-lg overflow-hidden">
      <div className="flex flex-col w-full p-6 gap-6 text-[14px] font-medium leading-[18.9px]">
        <span className="text-[18px] font-bold leading-[24.3px]">Towers</span>
        <div className="flex flex-col gap-6">
          <p className="max-w-[600px]">
            Each result for the Towers game is generated using a combination of a server seed, client seed and a nonce.
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
              {`const towersGenerateDeck = (risk) => {
let deck = [];

for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
  const tilesPerRow = risk === "medium" ? 2 : 3;
  const losePerRow = risk === "hard" ? 2 : 1;

  deck[rowIndex] = [];
  for (let tileIndex = 0; tileIndex < tilesPerRow; tileIndex++) {
    if (tileIndex < losePerRow) {
      deck[rowIndex].push("lose");
    } else {
      deck[rowIndex].push("coin");
    }
  }
}

return deck;
};

const towersShuffleDeck = (deck, combined) => {
let shuffled = [];

for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
  const hash = crypto
    .createHash("sha256")
    .update(\`\${combined}-\${rowIndex}\`)
    .digest("hex");

  const chance = new ChanceJs(hash);
  const shuffledRow = chance.shuffle(deck[rowIndex]);
  shuffled.push(shuffledRow);
}

return shuffled;
};

const combined = \`\${serverSeed}-\${nonce}-\${clientSeed}\`;
let deck = towersGenerateDeck(risk);

// Shuffle towers game deck
deck = towersShuffleDeck(deck, combined);;`}
            </code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default TowersTab;
