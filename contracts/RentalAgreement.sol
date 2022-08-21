// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RentalAgreement {
    /* This declares a new complex type which will hold the paid rents*/
    struct PaidRent {
    uint id; /* The paid rent id*/
    uint value; /* The amount of rent that is paid*/
    uint paymentTime; /* Payment time*/
    address renterAddress; /* Address of the renter*/
    }

    uint public counter;
    uint public rent = 0.2 ether;
    uint public createdTimestamp;

    address payable public landlord;

    mapping(uint => address) public renter;
    mapping(address => bool) public renterStatus;
    mapping(address => bool) public paymentStatus;
    mapping(address => uint) public rentTime;

    PaidRent[] public paidrents;

    constructor() {
        landlord = payable(msg.sender);
        createdTimestamp = block.timestamp;
    }
    
    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only LandLord");
        _;
    }
    modifier onlyRenter() {
        require(renterStatus[msg.sender]== true, "Only Renter");
        _;
    }

    /* We also have some getters so that we can read the values
    from the blockchain at any time */

    function getPaidRents() internal view returns (PaidRent[] memory) {
        return paidrents;
    }

    function getLandlord() public view returns (address) {
        return landlord;
    }

    function getRenter(uint _id) public view returns (address) {
        return renter[_id];
    }

    function getRent()  public view returns (uint) {
        return rent;
    }

    function getContractCreated() public view returns (uint) {
        return createdTimestamp;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }
    /* setter */
    function updateRent(uint _newRent) public onlyLandlord{
        rent = _newRent;
    }
    
    function rentPaymentStatus(address[] calldata paymentStatusAddress) public onlyLandlord{
        for(uint256 i = 0; i < paymentStatusAddress.length; i++) {
            address statusAddress = paymentStatusAddress[i];
            require(statusAddress != address(0), "Cannot update the zero address");
            paymentStatus[statusAddress] = true;
        }
    }
    /* Events */
    event agreementConfirmed();

    event paidRent();

    event contractTerminated();

    /* Confirm the rent agreement as renter*/
    function confirmAgreement() public  {
        require(msg.sender != landlord, "You are the owner");
        require(msg.sender != address(0x0), "zero address not Allowed");
        require(renterStatus[msg.sender]== false, "Address already exist");
        emit agreementConfirmed();
        renter[counter] = msg.sender;
        rentTime[msg.sender] = block.timestamp;
        counter++;
        renterStatus[msg.sender] = true;
    }

    function payRent() public payable  onlyRenter{
        uint paytime = rentTime[msg.sender];
        uint monthTime = paytime + 30 days;
        require(msg.sender != landlord, "You are the owner");
        require(renterStatus[msg.sender]== true, "You are not renter");
        require(block.timestamp >= monthTime, "Few days remaining");
        require(msg.value == rent, "value not correct");
        emit paidRent();

        landlord.transfer(msg.value);
        paidrents.push(PaidRent({
        id : paidrents.length + 1,
        value : msg.value,
        paymentTime : block.timestamp, 
        renterAddress : msg.sender
        }));        

        rentTime[msg.sender] = monthTime;

    }

    /* Terminate the contract so the renter can’t pay rent anymore */
    function terminateAgreement(address[] calldata entries) public onlyLandlord {
        for(uint256 i = 0; i < entries.length; i++) {
            address entry = entries[i];
            require(entry != address(0), "Cannot remove zero address");
            
            renterStatus[entry] = false;
        }
        landlord.transfer(address(this).balance);
        /* If there is any value on the
               contract send it to the landlord*/
        emit contractTerminated();
    }
}