// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../zk-merkle-tree/contracts/ZKTree.sol";

contract ZKVote is ZKTree {
    address public owner;
    mapping(address => bool) public validators;
    mapping(uint256 => bool) uniqueHashes;
    mapping(int => int) voti;
    
    int numOptions;

    constructor(uint32 _levels, IHasher _hasher, IVerifier _verifier, int _numOptions) 
    ZKTree(_levels, _hasher, _verifier) {
        owner = msg.sender; //msg.sender = chi sta usando il contratto
        numOptions = _numOptions; 
        for (int i = 0; i <= numOptions; i++) voti[i] = 0;
    }    
    
    
    function registerValidator(address _validator) external {
        require(msg.sender == owner, "Only owner can add validator!");
        validators[_validator] = true;
    }


    //registra il commitment (metodo '_commit')
    function registerCommitment(uint256 _hash,uint256 _commitment) external {
        //controlla che chi sta committando sia un validatore
        require(validators[msg.sender], "Only validator can commit!"); 
        //controlla che questo hash NON sia già stato usato
        require(!uniqueHashes[_hash], "This unique hash is already used!");
        //effettua il commit, se non è stato già usato e se viene effettuata la transazione correttamente
        _commit(bytes32(_commitment));
        uniqueHashes[_hash] = true;
    }

    //registra il voto (metodo '_nullify')
    function vote(uint256 _nullifier, uint256 _root, int _option, 
        uint[2] memory _proof_a, uint[2][2] memory _proof_b, uint[2] memory _proof_c
    ) external {
        //verifica opzione valida
        require(_option <= numOptions, "Invalid option!");
        
        //usa _nullify della libreria per verificare e utilizzare il nullifier
        _nullify(bytes32(_nullifier), bytes32(_root), _proof_a, _proof_b, _proof_c);
        voti[_option]++;
    }

    //get del numero di voti
    function getVoti(int _option) external view returns (int) {
        return voti[_option];
    }
        
}
