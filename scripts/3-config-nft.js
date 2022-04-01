import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0xa188cc148573D4ad8e3A9240B18a896a14aB61f2");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Super Bao",
                description: "This NFT will give you access to BaoDAO",
                image: readFileSync("scripts/assets/BaoNFT.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})();
