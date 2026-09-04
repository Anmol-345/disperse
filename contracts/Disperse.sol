//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Disperse {
    function disperseToken(
        IERC20 tokenAddress,
        address payable[] calldata recipients,
        uint256[] calldata values
    ) external {
        IERC20 token = IERC20(tokenAddress);
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) total += values[i];

        require(token.transferFrom(msg.sender, address(this), total));

        for (uint256 i = 0; i < recipients.length; i++) {
            token.transfer(recipients[i], values[i]);
        }
    }

    function disperseEther(address[] memory recipients, uint256[] memory values)
        external
        payable
    {
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = payable(recipients[i]).call{value: values[i]}("");
            require(success, "Transfer failed.");
        }
        uint256 balance = address(this).balance;
        // Refund remaining amount to msg.sender
        if (balance > 0) {
            (bool success, ) = payable(msg.sender).call{value: balance}("");
            require(success, "Refund failed.");
        }
    }
}
