import React from 'react';

const ActiveProposals = (data) => {
  return (
    <div>
            <h2>Active Proposals</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              // before we do async things, we want to disable the button to prevent double clicks
              data.setIsVoting(true);

              // lets get the votes from the form for the values
              const votes = data.proposals.map((proposal) => {
                const voteResult = {
                  proposalId: proposal.proposalId,
                  //abstain by default
                  vote: 2,
                };
                proposal.votes.forEach((vote) => {
                  const elem = document.getElementById(proposal.proposalId + "-" + vote.type);
                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });

              // first we need to make sure the user delegates their token to vote
              try {
                //we'll check if the wallet still needs to delegate their tokens before they can vote
                const delegation = await data.token.getDelegationOf(data.address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                if (delegation === data.AddressZero) {
                  //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                  await data.token.delegateTo(data.address);
                }
                // then we need to vote on the proposals
                try {
                  await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) =>{
                      // before voting we first need to check whether the proposal is open for voting
                      // we first need to get the latest state of the proposal
                      const proposal = await data.vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return data.vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                    })
                  );
                  try {
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                    await Promise.all(
                      votes.map(async ({ proposalId }) => {
                        // we'll first get the latest state of the proposal again, since we may have just voted before
                        const proposal = await data.vote.get(proposalId);

                        //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                        if (proposal.state === 4) {
                          return data.vote.execute(proposalId);
                        }
                      })
                    );
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                    data.setHasVoted(true);
                    // and log out a success message
                    console.log("successfully voted");
                  } catch (error) {
                    console.error("failed to execute votes", error);
                  }
                } catch (error) {
                  console.error("failed to vote", error);
                }
              } catch (error) {
                console.error("failed to delegate tokens");
              } finally {
                // in *either* case we need to set the isVoting state to false to enable the button again
                data.setIsVoting(false);
              }
            }}
            >
              {data.proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                        type="radio"
                        id={proposal.proposalId + "-" + type}
                        name={proposal.proposalId}
                        value={type}
                        //default the "abstain" vote to checked
                        defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={data.isVoting || data.hasVoted} type="submit">
                {data.isVoting ? "Voting..." : data.hasVoted ? "You Already Voted" : "Submit Votes"}
              </button>
              {!data.hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
  )
}

export default ActiveProposals
