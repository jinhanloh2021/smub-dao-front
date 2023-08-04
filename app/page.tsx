'use client';
import { createContext, useEffect, useState } from 'react';
import { BigNumber, ethers } from '@/ethers-5.1.esm.min.js';
import { Button } from '@/components/ui/button';
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  VOTE_REASON,
  WAY,
  govAbi,
  govContractAddress,
  SET_EXCO_ARGS,
  smubAbi,
  smubAddress,
  ZERO_VALUE,
} from '@/constants';
import Link from 'next/link';
const AppContext = createContext<any>(null);

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [proposalId, setProposalId] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    if (typeof window.ethereum !== null) {
      // setWalletConnected(window.ethereum?.isConnected() ?? false);
      console.log(`Wallet connected: ${window.ethereum?.isConnected()}`);
    } else {
      console.log('Metamask not installed');
    }
  }, []);

  const connect = async () => {
    if (typeof window.ethereum !== null) {
      await window.ethereum?.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
    } else {
      console.log('Metamask not installed');
    }
  };

  // Same proposal must change description
  // uint256 proposalId = hashProposal(targets, values, calldatas, keccak256(bytes(description)));
  const propose = async (
    address: string,
    value: BigNumber,
    funcSignature: string,
    args: any[],
    description: string
  ) => {
    if (typeof window.ethereum !== null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const govContract = new ethers.Contract(
        govContractAddress,
        govAbi,
        signer
      );
      govContract.on('ProposalCreated', (e: any) => {
        console.log(`Proposal Event caught\nProposalId: ${BigNumber.from(e)}`);
        setProposalId(BigNumber.from(e));
      });

      const smubInterface = new ethers.utils.Interface(smubAbi);
      const encodedSetExcoCall = smubInterface.encodeFunctionData(
        funcSignature,
        args
      );

      const txResponse = await govContract.propose(
        [address],
        [value],
        [encodedSetExcoCall],
        description
      );
      console.log(`TxResponse: ${JSON.stringify(txResponse)}`);
      const txReceipt = await txResponse.wait();
      console.log(`TxReceipt: ${JSON.stringify(txReceipt)}`);
      console.log(`Proposal events: ${txReceipt.events}`);
    }
  };
  const vote = async (id: BigNumber, way: number, reason: string) => {
    if (typeof window.ethereum !== null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const govContract = new ethers.Contract(
        govContractAddress,
        govAbi,
        signer
      );
      govContract.on('VoteCast', (e: any) => {
        console.log(`VoteCast event caught:`);
        console.log(JSON.stringify(e));
      });
      const txResponse = await govContract.castVoteWithReason(id, way, reason);
      console.log(`TxResponse: ${JSON.stringify(txResponse)}`);
    }
  };
  const queue = async (
    description: string,
    value: BigNumber,
    funcSignature: string,
    args: any[]
  ) => {
    if (typeof window.ethereum !== null) {
      const descriptionHash = ethers.utils.id(description);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const govContract = new ethers.Contract(
        govContractAddress,
        govAbi,
        signer
      );
      govContract.on('ProposalQueued', (e: any) => {
        console.log(`ProposalQueued event caught: ${JSON.stringify(e)}`);
      });
      const smubInterface = new ethers.utils.Interface(smubAbi);
      const encodedSetExcoCall = smubInterface.encodeFunctionData(
        funcSignature,
        args
      );
      const txResponse = await govContract.queue(
        [smubAddress],
        [value],
        [encodedSetExcoCall],
        descriptionHash
      );
      console.log(txResponse);
    }
  };
  const execute = async (
    description: string,
    value: BigNumber,
    funcSignature: string,
    args: any[]
  ) => {
    if (typeof window.ethereum !== null) {
      const descriptionHash = ethers.utils.id(description);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const govContract = new ethers.Contract(
        govContractAddress,
        govAbi,
        signer
      );
      govContract.on('ProposalExecuted', (e: any) => {
        console.log(`ProposalExecuted Event caught: ${JSON.stringify(e)}`);
      });
      const smubInterface = new ethers.utils.Interface(smubAbi);
      const encodedSetExcoCall = smubInterface.encodeFunctionData(
        funcSignature,
        args
      );
      const txResponse = await govContract.execute(
        [smubAddress],
        [value],
        [encodedSetExcoCall],
        descriptionHash
      );
      console.log(txResponse);
    }
  };
  return (
    <AppContext.Provider value={{ walletConnected }}>
      <main className='flex min-h-screen flex-col items-center justify-between p-24 font-EBGaramond'>
        <Link href={'/proposals'} className='text-blue-400 underline'>
          All proposals
        </Link>
        <Button
          onClick={async () => await connect()}
          disabled={walletConnected}
        >
          {walletConnected ? 'Connected' : 'Connect'}
        </Button>
        <Button
          onClick={() =>
            propose(
              smubAddress,
              ZERO_VALUE,
              FUNC,
              SET_EXCO_ARGS,
              PROPOSAL_DESCRIPTION
            )
          }
          disabled={!walletConnected}
        >
          Propose
        </Button>
        <h3>{`Proposal ID: ${proposalId}`}</h3>
        <Button onClick={async () => await vote(proposalId, WAY, VOTE_REASON)}>
          Vote
        </Button>
        <Button
          onClick={() =>
            queue(PROPOSAL_DESCRIPTION, ZERO_VALUE, FUNC, SET_EXCO_ARGS)
          }
        >
          Queue
        </Button>
        <Button
          onClick={async () =>
            await execute(PROPOSAL_DESCRIPTION, ZERO_VALUE, FUNC, SET_EXCO_ARGS)
          }
        >
          Execute
        </Button>
      </main>
    </AppContext.Provider>
  );
}
