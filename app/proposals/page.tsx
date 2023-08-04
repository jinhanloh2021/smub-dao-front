'use client';
import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from '@/ethers-5.1.esm.min.js';
import { Button } from '@/components/ui/button';
import { govAbi, govContractAddress } from '@/constants';
import Link from 'next/link';

type Props = {};

export default function Proposals({}: Props) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [allProposals, setAllProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProposals = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const govContract = new ethers.Contract(
          govContractAddress,
          govAbi,
          signer
        );
        const allProposals = await govContract.queryFilter(
          'ProposalCreated',
          4024576
        ); // block before deployment
        console.log(`Raw: ${allProposals}`);
        console.log(`Raw string: ${JSON.stringify(allProposals)}`);
        console.log(`Raw first: ${allProposals[0]}`);
        console.log(`Raw first string: ${JSON.stringify(allProposals[0])}`);
        setAllProposals(allProposals);
        setLoading(false); // Data is fetched, set loading to false
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setLoading(false); // Set loading to false even in case of an error
      }
    };

    if (typeof window.ethereum !== 'undefined') {
      console.log(`Wallet connected: ${window.ethereum?.isConnected()}`);
      fetchAllProposals();
    } else {
      console.log('Metamask not installed');
    }
  }, []);

  let proposalId: BigNumber[] = [];
  if (Array.isArray(allProposals) && allProposals.length > 0)
    allProposals.map((item) => {
      proposalId.push(item.args[0]);
    });

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum?.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
    } else {
      console.log('Metamask not installed');
    }
  };

  const getProposalDetails = async (pid: BigNumber) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const govContract = new ethers.Contract(govContractAddress, govAbi, signer);
    const state: number = await govContract.state(pid);
    console.log(`State of ${pid.toString()} is ${state}`);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-EBGaramond'>
      <Link href={'/'} className='text-blue-400 underline'>
        Home
      </Link>
      <Button onClick={async () => await connect()}>Connect</Button>
      <div className='flex flex-col gap-4'>
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(allProposals) && allProposals.length > 0 ? (
          allProposals.map((item: any, index: number) => (
            <div key={index} className='break-words max-w-[60vw]'>
              <p>Block Number: {item.blockNumber}</p>
              <p>Event: {item.event}</p>
              <p>ProposalId: {item.args[0].toString()}</p>
              <p>Description: {item.args[item.args.length - 1]}</p>
            </div>
          ))
        ) : (
          <div>No proposals available</div>
        )}
        <p className='break-words max-w-[60vw]'>{proposalId.toString()}</p>
      </div>
      <Button onClick={async () => await getProposalDetails(proposalId[0])}>
        State
      </Button>
    </main>
  );
}
const e = {
  blockNumber: 4024599,
  blockHash:
    '0xa6e3ac9a227d18ee13d06b14fc9d85f94895588b4e8397bc48fded5d306252ec',
  transactionIndex: 22,
  removed: false,
  address: '0x4De1EDda4E86D52384d0342eC7F016fc67bA9440',
  data: '0x824d48d34db75150f8082305f4fc495e92069b74dbd909c94c38340a8e5406e9000000000000000000000000686b2d1dffe64d62d1c2d94bb3eb6cd5216bffc20000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000003d691800000000000000000000000000000000000000000000000000000000003d692200000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fa3edddde17b84be990fb209db659981c462bc28000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000842fa5897b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000074a696e2048616e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003a50726f706f73616c204465736372697074696f6e2e204920616d2073657474696e67204a696e2048616e20746f20626520707265736964656e74000000000000',
  topics: [
    '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0',
  ],
  transactionHash:
    '0x790c7c9fb619859ad4f4851a87c57de3aea436108fbfef42bdf23f8e1857f3ad',
  logIndex: 25,
  event: 'ProposalCreated',
  eventSignature:
    'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)',
  args: [
    {
      type: 'BigNumber',
      hex: '0x824d48d34db75150f8082305f4fc495e92069b74dbd909c94c38340a8e5406e9',
    },
    '0x686b2D1DFfE64d62D1C2D94bB3EB6CD5216bffC2',
    ['0xFa3edDdde17B84bE990fb209dB659981c462Bc28'],
    [{ type: 'BigNumber', hex: '0x00' }],
    [''],
    [
      '0x2fa5897b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000074a696e2048616e00000000000000000000000000000000000000000000000000',
    ],
    { type: 'BigNumber', hex: '0x3d6918' },
    { type: 'BigNumber', hex: '0x3d6922' },
    'Proposal Description. I am setting Jin Han to be president',
  ],
};
