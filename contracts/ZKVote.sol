// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ZKTree.sol";

contract ZKVote is ZKTree {
    address public owner;
    mapping(address => bool) public validators;
    mapping(address => bool) public whitelist;
    mapping(uint256 => bool) uniqueHashes;
    mapping(uint => uint) voti;
    mapping(uint => string) optionsText;
    string title;
    uint numOptions;

    constructor(uint32 _levels, IHasher _hasher, IVerifier _verifier, string memory _title, uint _numOptions, string[10] memory opzioni) 
    ZKTree(_levels, _hasher, _verifier) {
        owner = msg.sender; //msg.sender = chi sta usando il contratto
        validators[owner]=true;
        title=_title;

        numOptions=_numOptions;
        for(uint i=0;i<=numOptions;i++)
            optionsText[i]=opzioni[i];
        for (uint i = 0; i <= numOptions; i++) voti[i] = 0;
    }
    
    
    function registerWhitelist(address _voter) external {
        require(validators[msg.sender], "Only validators can add to white list!");
        whitelist[_voter] = true;
    }
    function registerValidator(address _validator) external {
        require(msg.sender == owner, "Only owner can add validator!");
        validators[_validator] = true;
    }

    //registra il commitment (metodo '_commit')
    function registerCommitment(uint256 _hash,uint256 _commitment, address _voter) external {
        require(whitelist[_voter], "Non sei in whitelist fra");
        //controlla che chi sta committando sia un validatore
        require(validators[msg.sender], "Only validator can commit!"); 
        //controlla che questo hash NON sia già stato usato
        require(!uniqueHashes[_hash], "This unique hash is already used!");
        //effettua il commit, se non è stato già usato e se viene effettuata la transazione correttamente
        _commit(bytes32(_commitment));
        uniqueHashes[_hash] = true;
        whitelist[_voter]=false;
    }

    //registra il voto (metodo '_nullify')
    function vote(uint256 _nullifier, uint256 _root, uint _option, 
        uint[2] memory _proof_a, uint[2][2] memory _proof_b, uint[2] memory _proof_c
    ) external {
        //verifica opzione valida
        require(_option <= numOptions, "Invalid option!");
        
        //usa _nullify della libreria per verificare e utilizzare il nullifier
        _nullify(bytes32(_nullifier), bytes32(_root), _proof_a, _proof_b, _proof_c);
        voti[_option]++;
    }

    //get del numero di voti
    function getVoti() external view returns (uint[] memory) {
        uint[] memory tmp=new uint[](numOptions);
        for(uint i=0;i<numOptions;i++)
            tmp[i]=voti[i];
        return tmp;
    }

    function getOptions() 
    external view returns (string[] memory){
        string[] memory tmp=new string[](numOptions);
        for(uint i=0;i<numOptions;i++)
            tmp[i]=optionsText[i];
        return tmp;

    }
        
    function getTitle()
    external view returns (string memory){
        return title;
    }
}
