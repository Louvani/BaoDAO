import React from 'react';

const MintNft = ({isClaiming, mintNft}) => {
  return (
    <div className="mint-nft">
      <h1>Mint your free Bao DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
}

export default MintNft
