//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyBase.sol";

interface IMailbox {
    function quoteDispatch(
        uint32 destination,
        bytes32 recipient,
        bytes memory body
    ) external returns (uint256 fee);
    function dispatch(
        uint32 destination,
        bytes32 recipient,
        bytes memory body
    ) external payable; // will revert if msg.value < quoted fee
}

contract CrossMessenger is KittyBase {


    IMailbox public hyperlaneMailBox;
    mapping(uint256 => uint32) public hyperlaneChainDomain;

    modifier onlyMailbox() {
        require(
            msg.sender == address(hyperlaneMailBox),
            "MailboxClient: sender not mailbox"
        );
        _;
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    function setHyperlaneMailBox(IMailbox _mailBox) public  onlyCEO{
        hyperlaneMailBox = _mailBox;
    }

    // Setter function for updating values in hyperlaneChainDomain mapping
    function setHyperlaneChainDomain(uint256 _chainId, uint32 _chainDomain) public onlyCEO{
        hyperlaneChainDomain[_chainId] = _chainDomain;
    }

    function sendCrossMessage(uint256 _destChainId, address _receipeintAddrss, bytes memory _payload, string memory routeName) internal {
        bytes memory body = abi.encode(routeName, _payload);
        uint32 destDomain = hyperlaneChainDomain[_destChainId];
        bytes32 recipient = addressToBytes32(_receipeintAddrss);
        uint256 quote = hyperlaneMailBox.quoteDispatch(destDomain, recipient, body);
        require(address(this).balance >= quote, "Insufficient funds to send message");
        hyperlaneMailBox.dispatch{value: quote}(destDomain, recipient, body);
    }
}