import React from 'react';

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddresses = (str) => {
  return str.substring(0,6) + "..." + str.substring(str.length - 4);
};

const MemberList = ({memberList}) => {
  return (
    <div>
      <h2>Member List</h2>
      <table className='card'>
        <thead>
          <tr>
            <th>Address</th>
            <th>Token Amount</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member) => {
            return (
              <tr key={member.address}>
                <td>{shortenAddresses(member.address)}</td>
                <td>{member.tokenAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MemberList
