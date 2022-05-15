// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract DehiddenCollections is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    bytes32 public root;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 3000;

    constructor(bytes32 _root) ERC721("Dehidden Collections", "DHN") {
      root = _root;
    }

    function makeDehiddenNFT(bytes32[] memory proof) public {
        uint256 tokenId = _tokenIdCounter.current();
        require(isValid(proof, keccak256(abi.encodePacked(msg.sender))), "Not a part of Whitelist");
        require(tokenId <= MAX_SUPPLY, "Sorry! All NFts have been minted");
        require(balanceOf(msg.sender) == 0, "Each address may only own one NFT");
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafkreignppjwv56jciz72nozbudbejc6myeji742ldriut563pb6yd2pri"
        );
    }

    function isValid(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
      return MerkleProof.verify(proof, root, leaf);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
