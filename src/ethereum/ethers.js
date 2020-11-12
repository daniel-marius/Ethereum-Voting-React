import { ethers, Contract } from 'ethers';

import Election from './abis/Election.json';

const initEthers = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        // await window.ethereum.enable();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const accounts = await window.ethereum.send('eth_requestAccounts');
        // console.log(accounts);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const electionContract = new Contract(
          Election.networks[window.ethereum.networkVersion].address,
          Election.abi,
          signer
        );

        resolve({ signerAddress, electionContract });
      } // } else {
      //   const url = "http://localhost:8545";
      //   const provider = new ethers.providers.JsonRpcProvider(url);
      //   resolve({ provider });
      // }
      resolve({ signerAddress: undefined, electionContract: undefined });
    });
  });
}

export default initEthers;
