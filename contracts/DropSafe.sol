// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

/**
 * @title DropSafe
 * @author Jiya (jiya_0x)
 * @notice A simple contract for accepting ETH funding with a minimum USD value requirement.
 * @dev This contract uses Chainlink price feeds to determine the ETH/USD rate.
 * Funds can only be withdrawn by the owner.
 *
 * @custom:security-contact jiya_0xdao@outlook.com
 * @custom:github https://github.com/jiya-0x
 * @version 1.0.0
 */

import "./PriceConverter.sol";

contract DropSafe {
    using PriceConverter for uint256;

    uint256 public constant minUSD = 50 * 1e18; // 50 USD minimum in Wei
    AggregatorV3Interface public priceFeed;

    address[] public funder;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    error DropSafe_notOwner();
    error DropSafe_notEnoughFund();

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert DropSafe_notOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        uint256 usdAmount = msg.value.getConversionRate(priceFeed);
        if (usdAmount < minUSD) revert DropSafe_notEnoughFund();
        funder.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < funder.length; i++) {
            address funderAddress = funder[i];
            addressToAmountFunded[funderAddress] = 0;
        }
        funder = new address[](0);
        payable(msg.sender).transfer(address(this).balance);
    }
}
