//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyBase.sol";

library StandardHookMetadata {
    uint8 private constant VARIANT_OFFSET = 0;
    uint8 private constant MSG_VALUE_OFFSET = 2;
    uint8 private constant GAS_LIMIT_OFFSET = 34;
    uint8 private constant REFUND_ADDRESS_OFFSET = 66;
    uint256 private constant MIN_METADATA_LENGTH = 86;

    uint16 public constant VARIANT = 1;

    /**
     * @notice Returns the variant of the metadata.
     * @param _metadata ABI encoded global hook metadata.
     * @return variant of the metadata as uint8.
     */
    function variant(bytes calldata _metadata) internal pure returns (uint16) {
        if (_metadata.length < VARIANT_OFFSET + 2) return 0;
        return uint16(bytes2(_metadata[VARIANT_OFFSET:VARIANT_OFFSET + 2]));
    }

    /**
     * @notice Returns the specified value for the message.
     * @param _metadata ABI encoded global hook metadata.
     * @param _default Default fallback value.
     * @return Value for the message as uint256.
     */
    function msgValue(
        bytes calldata _metadata,
        uint256 _default
    ) internal pure returns (uint256) {
        if (_metadata.length < MSG_VALUE_OFFSET + 32) return _default;
        return
            uint256(bytes32(_metadata[MSG_VALUE_OFFSET:MSG_VALUE_OFFSET + 32]));
    }

    /**
     * @notice Returns the specified gas limit for the message.
     * @param _metadata ABI encoded global hook metadata.
     * @param _default Default fallback gas limit.
     * @return Gas limit for the message as uint256.
     */
    function gasLimit(
        bytes calldata _metadata,
        uint256 _default
    ) internal pure returns (uint256) {
        if (_metadata.length < GAS_LIMIT_OFFSET + 32) return _default;
        return
            uint256(bytes32(_metadata[GAS_LIMIT_OFFSET:GAS_LIMIT_OFFSET + 32]));
    }

    /**
     * @notice Returns the specified refund address for the message.
     * @param _metadata ABI encoded global hook metadata.
     * @param _default Default fallback refund address.
     * @return Refund address for the message as address.
     */
    function refundAddress(
        bytes calldata _metadata,
        address _default
    ) internal pure returns (address) {
        if (_metadata.length < REFUND_ADDRESS_OFFSET + 20) return _default;
        return
            address(
                bytes20(
                    _metadata[REFUND_ADDRESS_OFFSET:REFUND_ADDRESS_OFFSET + 20]
                )
            );
    }

    /**
     * @notice Returns the specified refund address for the message.
     * @param _metadata ABI encoded global hook metadata.
     * @return Refund address for the message as address.
     */
    function getCustomMetadata(
        bytes calldata _metadata
    ) internal pure returns (bytes calldata) {
        if (_metadata.length < MIN_METADATA_LENGTH) return _metadata[0:0];
        return _metadata[MIN_METADATA_LENGTH:];
    }

    /**
     * @notice Formats the specified gas limit and refund address into global hook metadata.
     * @param _msgValue msg.value for the message.
     * @param _gasLimit Gas limit for the message.
     * @param _refundAddress Refund address for the message.
     * @param _customMetadata Additional metadata to include in the global hook metadata.
     * @return ABI encoded global hook metadata.
     */
    function formatMetadata(
        uint256 _msgValue,
        uint256 _gasLimit,
        address _refundAddress,
        bytes memory _customMetadata
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                VARIANT,
                _msgValue,
                _gasLimit,
                _refundAddress,
                _customMetadata
            );
    }

    /**
     * @notice Formats the specified gas limit and refund address into global hook metadata.
     * @param _msgValue msg.value for the message.
     * @return ABI encoded global hook metadata.
     */
    function formatMetadata(
        uint256 _msgValue
    ) internal view returns (bytes memory) {
        return formatMetadata(_msgValue, uint256(0), msg.sender, "");
    }

    /**
     * @notice Formats the specified gas limit and refund address into global hook metadata.
     * @param _gasLimit Gas limit for the message.
     * @param _refundAddress Refund address for the message.
     * @return ABI encoded global hook metadata.
     */
    function formatMetadata(
        uint256 _gasLimit,
        address _refundAddress
    ) internal pure returns (bytes memory) {
        return formatMetadata(uint256(0), _gasLimit, _refundAddress, "");
    }
}

interface IMailbox {
    function quoteDispatch(
        uint32 destination,
        bytes32 recipient,
        bytes memory body,
        bytes calldata defaultHookMetadata
    ) external returns (uint256 fee);
    function dispatch(
        uint32 destination,
        bytes32 recipient,
        bytes memory body,
        bytes calldata defaultHookMetadata
    ) external payable; // will revert if msg.value < quoted fee
}

contract CrossMessenger is KittyBase {


    IMailbox public hyperlaneMailBox;
    mapping(uint256 => uint32) public hyperlaneChainDomain;
    uint256 public handleGasLimit = 700000;

    function updateHyperlaneGasLimit(uint256 _handleGasLimit) public onlyCEO {
        handleGasLimit = _handleGasLimit;
    }

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
        address refundAddress = address(this);
        uint256 quote = hyperlaneMailBox.quoteDispatch(destDomain, recipient, body, StandardHookMetadata.formatMetadata(handleGasLimit, refundAddress));
        require(address(this).balance >= quote, "Insufficient funds to send message");
        hyperlaneMailBox.dispatch{value: quote}(destDomain, recipient, body, StandardHookMetadata.formatMetadata(handleGasLimit, refundAddress));
    }
}