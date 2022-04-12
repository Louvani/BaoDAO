import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";

dotenv.config();

// Governance token / vote address
const vote = sdk.getVote("0x769163750bdC4A4b3088A2991cBC9f49DfA2D8e3");

// This is ERC-20 contract
const token = sdk.getToken("0xaa01621FAd7A260423EE56Fb6bd305831B978F3A");

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 60% of the supply that we hold
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent60 = Number(ownedAmount) / 100 * 60;

    // Transfer 60% of the supply to our voting contract
    await token.transfer(
      vote.getAddress(),
      percent60
    );

    console.log("✅ Successfully transferred " + percent60 + " tokens to vote contract")
  } catch (error) {
    console.error("failed to transfer tokens to vote contract", error);
  }
})();
