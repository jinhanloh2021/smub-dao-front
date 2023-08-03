'use client';
import { createContext, useEffect, useState } from 'react';
import { ethers } from '@/ethers-5.1.esm.min.js';
import { Button } from '@/components/ui/button';
import { govAbi, govContractAddress, smubAbi, smubAddress } from '@/constants';
const AppContext = createContext<any>(null);

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== null) {
      setWalletConnected(window.ethereum?.isConnected() ?? false);
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

  const propose = async () => {
    if (typeof window.ethereum !== null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const govContract = new ethers.Contract(
        govContractAddress,
        govAbi,
        signer
      );
      govContract.on('ProposalCreated', (e: any) => {
        console.log(`ProposalCreated:`);
        console.log(JSON.stringify(e));
      });

      const smubInterface = new ethers.utils.Interface(smubAbi);
      const encodedSetExcoCall = smubInterface.encodeFunctionData('setExco', [
        0,
        'Jin Han',
      ]);

      const txResponse = await govContract.propose(
        [smubAddress],
        [0],
        [encodedSetExcoCall],
        'Proposal Description. I am setting Jin Han to be president'
      );
      // const txResponse = await govContract.votingDelay();
      console.log(`TxReceipt: ${JSON.stringify(txResponse)}`);
    }
  };
  const vote = async () => {};
  const queue = async () => {};
  const execute = async () => {};

  return (
    <AppContext.Provider value={{ walletConnected }}>
      <main className='flex min-h-screen flex-col items-center justify-between p-24 font-EBGaramond'>
        Hello World
        <Button onClick={() => connect()} disabled={walletConnected}>
          {walletConnected ? 'Connected' : 'Connect'}
        </Button>
        <Button onClick={() => propose()} disabled={!walletConnected}>
          Propose
        </Button>
      </main>
    </AppContext.Provider>
  );
}

const resEg = {
  TxReceipt: {
    hash: '0x986d2a4fcf0373f136aca807abefe4fba143e5fa033cab11bd7f4ca6258b7a61',
    type: 2,
    accessList: null,
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    confirmations: 0,
    from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    gasPrice: { type: 'BigNumber', hex: '0x6fc23ac0' },
    gasLimit: { type: 'BigNumber', hex: '0x6085' },
    to: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    value: { type: 'BigNumber', hex: '0x00' },
    nonce: 0,
    data: '0x7d5e81e2000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a513e6e4b8f2a923d98304ec87f64353c4d5c853000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000842fa5897b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000074a696e2048616e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003a50726f706f73616c204465736372697074696f6e2e204920616d2073657474696e67204a696e2048616e20746f20626520707265736964656e74000000000000',
    r: '0x62effa482c2e7f7643397c477a02333dc3eaa9a3606beff69efabd3f8381d665',
    s: '0x7d8bbccf263d26d41078dd4de91235a8635cd25e52ebe7d945464b8665a97e82',
    v: 1,
    creates: null,
    chainId: 0,
  },
};
