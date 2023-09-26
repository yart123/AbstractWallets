import { ExternalProvider } from "@ethersproject/providers";
import { Dispatch, SetStateAction } from "react";
import { getWalletAddresses } from "./cookie_helper";
import { Eip1193Provider, ethers } from "ethers";
import { AbstractWallet } from "../../typechain-types/contracts/AbstractWallet";
import { AbstractWallet__factory } from "../../typechain-types/factories/contracts/AbstractWallet__factory";
import { DegenToken__factory } from "../../typechain-types";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

const DEGEN_TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEGEN_TOKEN_CONTRACT_ADDRESS

export function getWallet() { 
    return window.ethereum
}

export async function getAccount(): Promise<string|undefined> {
    if (window.ethereum) {
      const accounts = await window.ethereum.request!!({method: "eth_accounts"});
      return accounts[0]
    } else {
        return undefined
    }
}

export async function connectAccount(): Promise<string|undefined> {
    if (!window.ethereum) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await window.ethereum.request!!({ method: 'eth_requestAccounts' });
    console.log(accounts)
    return accounts[0]
}

export async function deployWallet(walletName: string, password: string, preloadEth: number, preloadDgn: number): Promise<AbstractWallet|undefined> {
    if (!window.ethereum) {
        alert('MetaMask wallet is required to deploy');
        return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum!! as Eip1193Provider);
    const signer = await browserProvider.getSigner();

    let factory = new AbstractWallet__factory(signer)
    let contract = await factory.deploy(walletName, password, { value: ethers.parseEther(preloadEth.toString()) })

    console.log(`Preloading ${preloadDgn} DGN`)
    const degenToken = DegenToken__factory.connect(DEGEN_TOKEN_CONTRACT_ADDRESS!!, signer);
    await degenToken.mint(await contract.getAddress(), preloadDgn  )

    return contract
}

export async function sendEthFromAbstract(walletAddress: string, to: string, password: string, amount: number): Promise<void> {
    if (!window.ethereum) {
        alert('MetaMask wallet is required to deploy');
        return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum!! as Eip1193Provider);
    const signer = await browserProvider.getSigner();

    const contract = AbstractWallet__factory.connect(walletAddress, signer);
    await contract.transferEth(password, to, ethers.parseEther(amount.toString()))
}

export async function sendDgnFromAbstract(walletAddress: string, to: string, password: string, amount: number): Promise<void> {
    if (!window.ethereum) {
        alert('MetaMask wallet is required to deploy');
        return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum!! as Eip1193Provider);
    const signer = await browserProvider.getSigner();

    const contract = AbstractWallet__factory.connect(walletAddress, signer);
    await contract.transferERC20(password, DEGEN_TOKEN_CONTRACT_ADDRESS!!, to, amount)
}

export async function loadWalletInfo(setWallets: Dispatch<SetStateAction<Wallet[]>>) {
    const readonlyProvider = new ethers.JsonRpcProvider();

    console.log("Loading wallets addresses")
    let addresses = getWalletAddresses()

    let wallets: Wallet[] = []
    for await (let address of addresses) {
        const walletContract = await AbstractWallet__factory.connect(address, readonlyProvider);
        let walletName = await walletContract.walletName()
        const ethBalance = await readonlyProvider.getBalance(address);

        const degenContract = await DegenToken__factory.connect(DEGEN_TOKEN_CONTRACT_ADDRESS!!, readonlyProvider);
        const dgnBalance = await degenContract.balanceOf(address);

        wallets.push({
            name: walletName,
            address: address,
            ethBalance: parseFloat(ethers.formatEther(ethBalance)),
            degenBalance: parseFloat(dgnBalance.toString()), 
        } as Wallet)
    }
    setWallets(wallets);
}