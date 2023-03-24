import { ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'
import { ZKMapVote, ZKVote } from "../typechain-types";
//import { ZKTreeVote } from "../typechain-types";

import { generateCommitment, calculateMerkleRootAndZKProof, PromiseOrValue } from 'zk-merkle-tree';
import { BigNumberish } from "ethers";

const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;



describe("ZKVote Smart contract test", () => {
    const fs = require('fs');

let zkmap :ZKMapVote;
    before(async () => {

        const signers = await ethers.getSigners()
        const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        const mimcsponge = await MiMCSponge.deploy()
        const Verifier = await ethers.getContractFactory("Verifier");
        const verifier = await Verifier.deploy();

        const ZKMAP = await ethers.getContractFactory("ZKMapVote");
        zkmap = await ZKMAP.deploy();
        let opz1: string[] = ['Napoli', 'Inter', 'BariVecchia','','','','','','',''];
        let opz2: string[] = ['Maradona', 'Messi','','','','','','','',''];

        //zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address,"daje",3);
        await zkmap.newVotation(TREE_LEVELS, mimcsponge.address, verifier.address, "Vincitore campionato 2022/2023",3,opz1);
        await zkmap.newVotation(TREE_LEVELS, mimcsponge.address, verifier.address, "Idolo Napoli",2,opz2);

    });


    it("add validator and whilitest", async () =>{
        const signers = await ethers.getSigners();

        //await zkmap.connect(signers[1]).registerOneWhitelist(0, signers[2].address)
        await zkmap.registerOneWhitelist(0, signers[1].address)
        await zkmap.registerOneWhitelist(0, signers[2].address)
        await zkmap.registerOneWhitelist(0, signers[3].address)
        await zkmap.registerOneWhitelist(0, signers[4].address)
        await zkmap.registerOneWhitelist(0, signers[5].address)

        await zkmap.registerOneWhitelist(1, signers[1].address)
        await zkmap.registerOneWhitelist(1, signers[5].address)
        await zkmap.registerOneWhitelist(1, signers[6].address)
    
    });
/*
    it("Prova una prova su un altro albero", async () =>{
        const signers = await ethers.getSigners()
        let commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,111,commitment.commitment, signers[1].address);
        let cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[1], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c);

    });
*/
    
    it("signer 1 vota entrambe, OK", async ()=>{
        const signers = await ethers.getSigners()
       
        //signer 1 vota entrmbe
        let commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,111,commitment.commitment, signers[1].address);
        let cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[1], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(0,cd.nullifierHash,cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c);

        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(1,222,commitment.commitment, signers[1].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(1), signers[1], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c);

    });
/*
    it("signer 2 vota entrambe e 2 volte la stessa, NO OK", async ()=>{
        const signers = await ethers.getSigners()
       
        //signer 1 vota entrmbe
        let commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,666,commitment.commitment, signers[2].address);
        let cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(0,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);

        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(1,666,commitment.commitment, signers[2].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(1), signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);
       
        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(1,662,commitment.commitment, signers[2].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(1), signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);

    });
/*
    it("signer 3 usa prova di A su B, NO OK", async ()=>{
        const signers = await ethers.getSigners()
       
        let commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,661,commitment.commitment, signers[3].address);
        let cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[3], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);

    });
*/
    it("voti daje roma daje", async ()=>{
        const signers = await ethers.getSigners()
       
        let commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,1234,commitment.commitment, signers[2].address);
        let cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(0,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);
       
        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,6453,commitment.commitment, signers[3].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[3], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(0,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);
       

        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(0,23722,commitment.commitment, signers[5].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(0), signers[5], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(0,cd.nullifierHash,cd.root, 2, cd.proof_a, cd.proof_b, cd.proof_c);

        

/*
        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(1,2383,commitment.commitment, signers[5].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(1), signers[5], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 0, cd.proof_a, cd.proof_b, cd.proof_c);

        commitment = await generateCommitment()
        await zkmap.registerOneCommitment(1,23383,commitment.commitment, signers[6].address);
        cd = await calculateMerkleRootAndZKProof(zkmap.getVotation(1), signers[6], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkmap.voteOne(1,cd.nullifierHash,cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c);
*/

    });

    it("Risultati", async ()=>{
        console.log(await zkmap.getOneTitle(0),"\n", await zkmap.getOneOptions(0),"\n", await zkmap.getOneVoti(0));
        console.log(await zkmap.getOneTitle(1),"\n", await zkmap.getOneOptions(1),"\n", await zkmap.getOneVoti(1));
    });
    /*
    it("Get voti", async() =>{
        console.log(await zkmap.getVotiOne(0,0));
        console.log(await zkmap.getVotiOne(0,1));
        console.log(await zkmap.getVotiOne(0,2));
    });

*/
});