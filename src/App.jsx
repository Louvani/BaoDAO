import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork, useDisconnect } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';

import Landing from './landing';
import AsideMenu from './asideMenu';
import MintNft from './mint-nft';
import MemberList from './memberList';
import ActiveProposals from './activeProposals';


const App = () => {
  // hooks provieded for thirdweb
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  const disconnectMetamask = useDisconnect();
  console.log("👋 Address: ", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop("0xa188cc148573D4ad8e3A9240B18a896a14aB61f2");
  // Initialize our token and vote contract
  const token = useToken("0xaa01621FAd7A260423EE56Fb6bd305831B978F3A");
  // Initialize our vote contract
  const vote = useVote('0x769163750bdC4A4b3088A2991cBC9f49DfA2D8e3')


  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  // Holds the amount of token each member has in satate.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);
  // for votes
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log(proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    }
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
     if (!proposals.length) {
       return;
     }

     const checkIfUserHasVoted = async () =>  {
       try {
         const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
         setHasVoted(hasVoted);
         if (hasVoted) {
          console.log("🥵 User has already voted");
         }
       } catch (error) {
        console.error("Failed to check if wallet has voted", error);
       }
     };
     checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote])

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab the users who hold our NFT with tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // We're checking if we are finding the address in the memberTokenAmounts array.
      // If we are, we'll return the amount of token the user has.
      // Otherwise, return 0.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts])

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const openSeaLink = `https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`.toString();

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <Landing connectWithMetamask={connectWithMetamask} />
    );
  }

  if (network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <AsideMenu address={address} openSeaLink={openSeaLink} disconnectMetamask={disconnectMetamask} />
        <div className='main-content'>
          <h1>Bao DAO Dashboard</h1>
          <div className='dashboard'>
            <MemberList memberList={memberList} />
            <ActiveProposals setIsVoting={setIsVoting}  proposals={proposals} setHasVoted={setHasVoted} isVoting={isVoting} hasVoted={hasVoted} token={token} vote={vote} address={address} AddressZero={AddressZero}  />
          </div>
        </div>
      </div>
    )
  }

  // Render mint nft screen.
  if (!hasClaimedNFT){
    return (
      <MintNft isClaiming={isClaiming} mintNft={mintNft} />
    );
  }
};

export default App;
