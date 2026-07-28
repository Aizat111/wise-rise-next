import Card from '../../card/Card';

const RouletteTab = (): React.ReactNode => {
  return (
    <Card className="flex flex-col rounded-lg">
      <div className="flex flex-col w-full p-6 gap-6 text-[14px] font-medium leading-[18.9px]">
        <span className="text-[18px] font-bold leading-[24.3px]">Roulette</span>
        <div className="flex flex-col gap-6">
          <p className="max-w-[600px]">
            To see a break down of the previous game history of our roulette, please visit the Roulette History page.
          </p>
          <p className="max-w-[600px]">
            Each result for the roulette game is generated using a combination of a server seed, client seed and a
            nonce.
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
              {`const crypto = require("crypto");
const SERVER_SEED = "SERVER_SEED_FROM_HISTORY";
const CLIENT_SEED = "CLIENT_SEED_FROM_HISTORY";
const NONCE = "NONCE_FROM_HISTORY";
const gameHash = crypto
    .createHash("sha256")
    .update(SERVER_SEED + CLIENT_SEED + NONCE)
    .digest("hex");
const result = parseInt(gameHash.substr(0, 8), 16) % 15;
console.log(result);`}
            </code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default RouletteTab;
