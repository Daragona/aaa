// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ZKVote.sol";

contract ZKMapVote{ 

    mapping (uint => ZKVote) votazioni;
    mapping (uint => string) titoli;
    uint numVotazioni;

    constructor(){
        numVotazioni=0;
    }

    function newVotation(uint32 _levels, IHasher _hasher, IVerifier _verifier, string memory _title, uint _numOption, string[10] memory _options) 
    external {
        votazioni[numVotazioni]=new ZKVote(_levels, _hasher, _verifier,_title, _numOption, _options);
        titoli[numVotazioni]=_title;
        numVotazioni++;
    }

    function getVotation(uint _idVoto)
    view external returns(address){
        return address(votazioni[_idVoto]);
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

    function getOneVoti(uint _idVoto)
    external view returns (uint[] memory){    
        
        require(_idVoto<numVotazioni, "Votation ID not exists");
        return votazioni[_idVoto].getVoti();
    }

    function getOneOptions(uint _idVoto)
    external view returns (string[] memory){
        return votazioni[_idVoto].getOptions();
    }

    function getOneTitle(uint _idVoto)
    external view returns (string memory){
        return votazioni[_idVoto].getTitle();
    }

    function getNumVotazioni()
    external view returns(uint){
        return numVotazioni;

    }

}