import {
    loadFixture, time,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AbstractWallet__factory } from "../typechain-types";
  
describe("AbstractWallet", function () {  
    async function setup() {
        // Contracts are deployed using the first signer/account by default
        const [main, otherAccount] = await ethers.getSigners();
      
        const AbstractWallet = await ethers.getContractFactory("AbstractWallet");
        const mainAbstractWallet = await AbstractWallet.deploy("Main wallet", "mainpassword", { value: ethers.parseEther("5") });
        const sideAbstractWallet = await AbstractWallet.deploy("Side wallet", "sidepassword", { value: ethers.parseEther("2") });
        
        const DegenToken = await ethers.getContractFactory("DegenToken");
        const degenToken = await DegenToken.deploy();

        return { mainAbstractWallet, sideAbstractWallet, degenToken, main, otherAccount };
    }
  
    it("Abstract Wallet End-to-End test", async function () {
        const { mainAbstractWallet, sideAbstractWallet, degenToken, main, otherAccount } = await loadFixture(setup);
        const mainAbstractAddress = await mainAbstractWallet.getAddress();
        const sideAbstractAddress = await sideAbstractWallet.getAddress();
        expect(await ethers.provider.getBalance(mainAbstractAddress)).to.equal(ethers.parseEther("5"));
        expect(await ethers.provider.getBalance(sideAbstractAddress)).to.equal(ethers.parseEther("2"));

        // AbstractWallet can send eth to normal wallet
        await mainAbstractWallet.transferEth("mainpassword", otherAccount, ethers.parseEther("1"))
        expect(await ethers.provider.getBalance(mainAbstractAddress)).to.equal(ethers.parseEther("4"));
        expect(await ethers.provider.getBalance(otherAccount)).to.equal(ethers.parseEther("10001"));

        // AbstractWallet can send eth to abstract wallet
        await mainAbstractWallet.transferEth("mainpassword", await sideAbstractWallet.getAddress(), ethers.parseEther("1"))
        expect(await ethers.provider.getBalance(mainAbstractAddress)).to.equal(ethers.parseEther("3"));
        expect(await ethers.provider.getBalance(sideAbstractAddress)).to.equal(ethers.parseEther("3"));

        // AbstractWallet can receive ERC20
        await degenToken.mint(mainAbstractAddress, 1000);
        expect(await degenToken.balanceOf(mainAbstractAddress)).to.equal(1000);
        expect(await degenToken.balanceOf(sideAbstractAddress)).to.equal(0);
        
        // AbstractWallet can send ERC20
        await mainAbstractWallet.transferERC20("mainpassword", await degenToken.getAddress(), sideAbstractAddress, 777)
        expect(await degenToken.balanceOf(mainAbstractAddress)).to.equal(223);
        expect(await degenToken.balanceOf(sideAbstractAddress)).to.equal(777);

        // AbstractWallet enforces password to be correct
        await expect(mainAbstractWallet.transferERC20("wrong", await degenToken.getAddress(), sideAbstractAddress, 1)).to.be.revertedWithCustomError(mainAbstractWallet, "IncorrectPassword");
    });
});
  