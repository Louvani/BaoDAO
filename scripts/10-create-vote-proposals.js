import sdk from './1-initialize-sdk.js';
import { ethers } from 'ethers';
import dotenv from "dotenv";

dotenv.config();


// Goverment contrat
const vote = sdk.getVote('0x769163750bdC4A4b3088A2991cBC9f49DfA2D8e3');

// ERC20 contract
const token = sdk.getToken('0xaa01621FAd7A260423EE56Fb6bd305831B978F3A');

(async () => {
  // create proposal to mint 420,000 new token to the treasury.
  try {
    const amount = 420_000;
    const description = "Should the DAO mint an additional " + amount + "tokens into the treasury?";
    const executions = [
      {
        //Our token contract that actually execues the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
      }
    ];
    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens")
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  // Create proposal to transfer ourselves 6,900 tokens for being awesome.
  try {
    const amount = 2_000;
    const description = "Should the dao transfer " + amount + " tokens from the treasury to 0x752a217de26F65f5a7e21cD2c3b260c956152a03 for being awesome?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            '0x752a217de26F65f5a7e21cD2c3b260c956152a03',
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];
    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
