// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../zk-merkle-tree/contracts/ZKTree.sol";

contract ZKVote {
    event Commit(
        bytes32 indexed commitment,
        uint32 leafIndex,
        uint256 timestamp
    );
    mapping (uint => ZKTree) votazioni;
    mapping (uint => address) owners;
    mapping(uint => mapping(address =>bool))  whitelist;
    mapping(uint => mapping(address =>bool))  validators;
    mapping (uint => string) titles;
    mapping (uint => uint) numOpzioni;
    mapping (uint => mapping (uint => string)) opzioni;
    mapping (uint => mapping (uint => uint)) votes;
    mapping (uint => mapping(uint256 => bool)) uniqueHashes;
    
    uint numVotazioni;
    //uint32 _levels,        IHasher _hasher,        IVerifier _verifier
    constructor(){
        numVotazioni=0;
    }
    function getVotation() 
    external view returns (ZKTree){
        return votazioni[0];
    }

    function addVotation(uint32 _levels, IHasher _hasher, IVerifier _verifier, string memory _title)
    external {
        votazioni[numVotazioni]=new ZKTree(_levels, _hasher, _verifier);
        owners[numVotazioni]=msg.sender;
        titles[numVotazioni]=_title;
        numVotazioni++;
    }
    
    function addOption(uint _idVoto, string memory _option) 
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");

        opzioni[_idVoto][numOpzioni[_idVoto]]=_option;
        numOpzioni[_idVoto]++;
    }

    function addWhitelist(uint _idVoto,address _voter)
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        require(validators[_idVoto][msg.sender], "Only validators can add to white list!");

        whitelist[_idVoto][_voter]=true;
    }

    function addValidator(uint _idVoto, address _validator)
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        require(owners[_idVoto]==msg.sender, "Only owner can add a validator!");

        validators[_idVoto][_validator]=true;
    }

    function registerCommitment(uint _idVoto, uint256 _hash,uint256 _commitment, address _voter)
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        require(whitelist[_idVoto][_voter], "Non sei in whitelist fra");
        require(validators[_idVoto][msg.sender], "Only validator can commit!"); 
        require(!uniqueHashes[_idVoto][_hash], "This unique hash is already used!");

        votazioni[_idVoto]._commit(bytes32(_commitment));
        uniqueHashes[_idVoto][_hash]=true;

    }

    function addvote(uint _idVoto, uint256 _nullifier, uint256 _root, uint _option, 
        uint[2] memory _proof_a, uint[2][2] memory _proof_b, uint[2] memory _proof_c) 
    external{
        require(_idVoto<numVotazioni, "Votation ID not exists");
        //check opzione
        require(_option <= numOpzioni[_idVoto], "Invalid Option");
        //usa _nullify
        votazioni[_idVoto]._nullify(bytes32(_nullifier), bytes32(_root), _proof_a, _proof_b, _proof_c);
        votes[_idVoto][_option]++;
    }

    function getNumVotations() 
    external view returns (uint){
        return numVotazioni;
    }

    function getOptions(uint _idVoto)
    external view returns (string[] memory){  
        string [] memory temp=new string[](numOpzioni[_idVoto]);
        require(_idVoto<numVotazioni, "Votation ID not exists");
        for(uint i=0;i<numOpzioni[_idVoto];i++){
            temp[i]=opzioni[_idVoto][i];
        }
        return temp;
    }

    function getVoti(uint _idVoto)
    external view returns (uint[] memory){    
        uint [] memory temp;
        require(_idVoto<numVotazioni, "Votation ID not exists");
        for(uint i=0;i<numOpzioni[_idVoto];i++){
            temp[i]=votes[_idVoto][i];
        }
        return temp;
    }

    function setTitleVotation(uint _idVoto, string memory _title) 
    external{
        titles[_idVoto]=_title;
    }

    function getTitleVotation(uint _idVoto)
    external view returns (string memory){
        return titles[_idVoto];
    }
}