// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ZKVote.sol";

contract ZKMapVote{ 

    mapping (uint => ZKVote) votazioni;
    uint numVotazioni;

    constructor(){

    }

    function newVotation(uint32 _levels, IHasher _hasher, IVerifier _verifier, uint _numOptions) 
    external {
        votazioni[numVotazioni]=new ZKVote(_levels, _hasher, _verifier, _numOptions);
        numVotazioni++;
    }

    function registerOneWhitelist(uint _idVoto,address _voter)
    external{

        require(_idVoto<numVotazioni, "Votation ID not exists");
        votazioni[_idVoto].registerWhitelist(_voter);
    }

    function registerOneValidator(uint _idVoto, address _validator)
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        votazioni[_idVoto].registerValidator(_validator);
    }

    function registerOneCommitment(uint _idVoto, uint256 _hash,uint256 _commitment, address _voter)
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        votazioni[_idVoto].registerCommitment(_hash,_commitment, _voter);
    }

    function voteOne(uint _idVoto, uint256 _nullifier, uint256 _root, uint _option, 
        uint[2] memory _proof_a, uint[2][2] memory _proof_b, uint[2] memory _proof_c) 
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        votazioni[_idVoto].vote(_nullifier, _root, _option, _proof_a, _proof_b, _proof_c);
    }

    function getVotiOne(uint _idVoto, uint _option)
    external view returns (uint){    
        
        require(_idVoto<numVotazioni, "Votation ID not exists");
        return votazioni[_idVoto].getVoti(_option);
    }
}