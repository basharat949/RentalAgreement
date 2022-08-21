
const hre = require("hardhat");
const ethers = hre.ethers;
const upgrades = hre.upgrades;
const chai = require("chai");
const fs = require("fs");
const path = require("path");
const { solidity } = require("ethereum-waffle");
const { expect } = chai;
const { BigNumber, logger, Contract } = require("ethers");
const network = hre.hardhatArguments.network;

chai.use(solidity);

describe("RentalAgreement", function () {
    let owner,
        renterOne,
        renterTwo,
        deployedRentalAgreement,
        accounts = [];

    beforeEach(async () => {
        accounts = await hre.ethers.getSigners();
        owner = accounts[0];
        renterOne = accounts[1];
        renterTwo = accounts[2]
        provider = ethers.provider;

        /**deploy the  RentalAgreement Smart contract*/

        const rentalAgreement = await ethers.getContractFactory("RentalAgreement");
        deployedRentalAgreement = await rentalAgreement.deploy();
        await deployedRentalAgreement.connect(owner).deployed();


    });


    describe("RentalAgreement Contract Working", function () {
        let currentTime = Math.round(new Date().getTime() / 1000);
        const deadLine = currentTime * 2;

        it("It Should run confirmAgrement", async function () {
            await deployedRentalAgreement.connect(renterOne).confirmAgreement();

            console.log("Balance of the Owner---->",await provider.getBalance(owner.address));

            // blockNumBefore = await ethers.provider.getBlockNumber();
            // blockBefore = await ethers.provider.getBlock(blockNumBefore);
            // timestampBefore = blockBefore.timestamp;
            // console.log(timestampBefore)

            PassedDay = 2628288;

            await ethers.provider.send('evm_increaseTime', [PassedDay]);
            await ethers.provider.send('evm_mine');

            // blockNumAfter = await ethers.provider.getBlockNumber();
            // blockAfter = await ethers.provider.getBlock(blockNumAfter);
            // timestampAfter = blockAfter.timestamp;
            // console.log(timestampAfter)

            await deployedRentalAgreement.connect(renterOne).payRent({value: ethers.utils.parseEther("0.2", 18)})

            console.log("Balance of the Owner---->",await provider.getBalance(owner.address));

            PassedDay = 2628288;
     

            await ethers.provider.send('evm_increaseTime', [PassedDay]);
            await ethers.provider.send('evm_mine');


            await deployedRentalAgreement.connect(renterOne).payRent({value: ethers.utils.parseEther("0.2", 18)})

            console.log("Balance of the Owner---->",await provider.getBalance(owner.address));

            await deployedRentalAgreement.connect(owner).updateRent(ethers.utils.parseEther("1", 18))

            // await deployedRentalAgreement.connect(owner).terminateAgreement([renterOne.address])

            PassedDay = 2628288;
     

            await ethers.provider.send('evm_increaseTime', [PassedDay]);
            await ethers.provider.send('evm_mine');

            await deployedRentalAgreement.connect(renterOne).payRent({value: ethers.utils.parseEther("1", 18)})

            console.log("Balance of the Owner---->",await provider.getBalance(owner.address));

        });
    });
});