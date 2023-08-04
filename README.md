<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">SMUB DAO</h3>

  <p align="center">
    SMU Blockchain DAO
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#code-rundown">Code Rundown</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### SMUB DAO Frontend

This website is for interacting with the Governance smart contracts deployed on the _Sepolia Network_. The DAO contract can be found at this [address](https://sepolia.etherscan.io/address/0x4De1EDda4E86D52384d0342eC7F016fc67bA9440).
The main functionalities of the DAO is creating proposals and voting, which can be done through the website. The proposal is currently hardcoded to `setExco`, with no form to change the description or other function arguments.

The remaining functions such as voting, queueing and executing are all hardcoded to test the functionality of the smart contract on the testnet.

A future improvement would be to make the functions more dynamic, allowing people to vote against, see the proposal status and discuss on proposals. This beta version is just a proof of concept.

Checkout the DAO contracts, deployment and testing scripts at this [repo](https://github.com/jinhanloh2021/dao-smub).

### Built With

- NextJs
- Ethers
- Tailwind
- Shadcn

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- metamask

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jinhanloh2021/dao-smub.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Ensure you have metamask and are connected to the Sepolia network

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Run the website

```sh
npm run dev
```

**On the website**

- Click on the buttons from top to bottom
- Have etherscan open to see the transactions going through
- Open the console to check for error logs
  - Common errors are the proposal already created. Then you should change the proposal description in the [constants.ts](/) file. This only works if you are running locally. If on a deployed site you have no way of changing this constant.
  - Timer errors. There are delays between each state, such as voting delay, or queue delay. If you click the buttons too quickly, they will error. Wait for each stage by waiting for the events to be emitted and logged in the console. The error messages are very helpful to debug which timer you are waiting for.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Code Rundown

The main functionality of interacting with smart contracts requires 3 entities

- Signer
- Contract ABI
- Provider
  The signer is used to sign transactions to the smart contract. It can be obtained by getting the user to connect their metamask wallet to the site. The contract ABI is obtained from the deployment files in the backend. It is used to define the functionality of the contract, so that ethers can interact call functions on it. The provider is metamask which provides a connection to the blockchain.

With these three dependencies, we can create the Contract object

```ts
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const govContract = new ethers.Contract(govContractAddress, govAbi, signer);
```

This then provides an interface to call contract functions and query events from the contract.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [✅] Basic proposal lifecycle
- [✅] Basic proposal list
- [ ] Error prevention for proposal functions
- [ ] New proposal form
- [ ] Detailed proposal page

See the [open issues](https://github.com/jinhanloh2021/dao-smub/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/jinhanloh2021/dao-smub](https://github.com/jinhanloh2021/dao-smub)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [SMU Blockchain Club](https://www.instagram.com/smublockchain/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
