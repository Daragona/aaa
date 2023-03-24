import { ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'
import { ZKVote } from "../typechain-types";
//import { ZKTreeVote } from "../typechain-types";

import { generateCommitment, calculateMerkleRootAndZKProof, PromiseOrValue } from 'zk-merkle-tree';
import { BigNumberish } from "ethers";

const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;



describe("ZKVote Smart contract test", () => {
    const fs = require('fs');

    let zkvote: ZKVote;

    before(async () => {
        const signers = await ethers.getSigners()
        const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        const mimcsponge = await MiMCSponge.deploy()
        const Verifier = await ethers.getContractFactory("Verifier");
        const verifier = await Verifier.deploy();
        const ZKVote = await ethers.getContractFactory("ZKVote");
        zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address,"daje", 4, "Daje");

        console.log(mimcsponge.address,",",verifier.address)
        await zkvote.registerValidator(signers[1].getAddress())


        //0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
        // 20, 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0x584483D20b2Ee1754C9F93e560B6746698E94DBF, 4
        // 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0xdD2FD4581271e230360230F9337D5c0430Bf44C0
    });

    it("Test the full process", async () => {
        const signers = await ethers.getSigners()
        await zkvote.registerValidator(signers[1].address)

        await zkvote.connect(signers[1]).registerWhitelist(signers[2].address)
        await zkvote.connect(signers[1]).registerWhitelist(signers[3].address)
        await zkvote.connect(signers[1]).registerWhitelist(signers[4].address)

        // register 3 voters
        const commitment1 = await generateCommitment()
        console.log(commitment1);
        await zkvote.connect(signers[1]).registerCommitment(commitment1.nullifier, commitment1.commitment,signers[2].address)
        const commitment2 = await generateCommitment()
        await zkvote.connect(signers[1]).registerCommitment(commitment2.nullifier, commitment2.commitment,signers[3].address)
        const commitment3 = await generateCommitment()
        await zkvote.connect(signers[1]).registerCommitment(commitment3.nullifier, commitment3.commitment,signers[4].address)

        // votes
        const cd1 = await calculateMerkleRootAndZKProof(zkvote.address, signers[2], TREE_LEVELS, commitment1, "keys/Verifier.zkey")
        const cd2 = await calculateMerkleRootAndZKProof(zkvote.address, signers[3], TREE_LEVELS, commitment2, "keys/Verifier.zkey")
        const cd3 = await calculateMerkleRootAndZKProof(zkvote.address, signers[4], TREE_LEVELS, commitment3, "keys/Verifier.zkey")

        await zkvote.connect(signers[4]).vote(cd3.nullifierHash, cd3.root, 3, cd3.proof_a, cd3.proof_b, cd3.proof_c)
        await zkvote.connect(signers[2]).vote(cd1.nullifierHash, cd1.root, 2, cd1.proof_a, cd1.proof_b, cd1.proof_c)
        await zkvote.connect(signers[3]).vote(cd2.nullifierHash, cd2.root, 2, cd2.proof_a, cd2.proof_b, cd2.proof_c)

            // results
    });

    it("Save proof", async () => {
        const signers = await ethers.getSigners()
        const commitment1 = await generateCommitment()
        const commitment2 = await generateCommitment()
        const commitment3 = await generateCommitment()
        await zkvote.connect(signers[1]).registerWhitelist(signers[4].address)
        await zkvote.connect(signers[1]).registerWhitelist(signers[5].address)
        await zkvote.connect(signers[1]).registerWhitelist(signers[6].address)
        
        await zkvote.connect(signers[1]).registerCommitment(4, commitment1.commitment, signers[4].address)
        await zkvote.connect(signers[1]).registerCommitment(5, commitment2.commitment, signers[5].address)
        await zkvote.connect(signers[1]).registerCommitment(6, commitment3.commitment, signers[6].address)

        let cd1 = await calculateMerkleRootAndZKProof(zkvote.address, signers[4], TREE_LEVELS, commitment1, "keys/Verifier.zkey")
        let cd2 = await calculateMerkleRootAndZKProof(zkvote.address, signers[5], TREE_LEVELS, commitment2, "keys/Verifier.zkey")
        let cd3 = await calculateMerkleRootAndZKProof(zkvote.address, signers[6], TREE_LEVELS, commitment3, "keys/Verifier.zkey")
        let tofile = JSON.stringify(cd1, null, 1);
        fs.writeFileSync('prove/MerkleRoot1.json', tofile);
        tofile = JSON.stringify(cd2, null, 1);
        fs.writeFileSync('prove/MerkleRoot2.json', tofile);
        tofile = JSON.stringify(cd3, null, 1);
        fs.writeFileSync('prove/MerkleRoot3.json', tofile);
    });

    it("Push proof", async () => {
        
        const signers = await ethers.getSigners()

        const rawcd1 = fs.readFileSync('prove/MerkleRoot1.json');
        const cd1 = JSON.parse(rawcd1);
        const rawcd2 = fs.readFileSync('prove/MerkleRoot2.json');
        const cd2 = JSON.parse(rawcd2);
        const rawcd3 = fs.readFileSync('prove/MerkleRoot3.json');
        const cd3 = JSON.parse(rawcd3);
        
        await zkvote.connect(signers[4]).vote(cd1.nullifierHash, cd1.root, 4, cd1.proof_a, cd1.proof_b, cd1.proof_c)
        await zkvote.connect(signers[5]).vote(cd2.nullifierHash, cd2.root, 4, cd2.proof_a, cd2.proof_b, cd2.proof_c)
        await zkvote.connect(signers[6]).vote(cd3.nullifierHash, cd3.root, 4, cd3.proof_a, cd3.proof_b, cd3.proof_c)

        console.log(await zkvote.getVoti(1))
        console.log(await zkvote.getVoti(2))
        console.log(await zkvote.getVoti(3))
        console.log(await zkvote.getVoti(4),"+3")

    });
/*
    it("User not in whitelist", async() =>{
        const signers = await ethers.getSigners()
        const commitment = await generateCommitment()
        await zkvote.connect(signers[1]).registerCommitment(commitment.nullifier, commitment.commitment,signers[10].address)
        const cd = await calculateMerkleRootAndZKProof(zkvote.address, signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        await zkvote.connect(signers[4]).vote(cd.nullifierHash, cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c)
    });

    it("User votes 2 times", async() =>{
        const signers = await ethers.getSigners()
        await zkvote.connect(signers[1]).registerWhitelist(signers[11].address)

        const commitment = await generateCommitment()
        const commitment1 = await generateCommitment()

        await zkvote.connect(signers[1]).registerCommitment(commitment.nullifier, commitment.commitment,signers[11].address)        
        await zkvote.connect(signers[1]).registerCommitment(commitment1.nullifier, commitment1.commitment,signers[11].address)
        const cd = await calculateMerkleRootAndZKProof(zkvote.address, signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")
        const cd1 = await calculateMerkleRootAndZKProof(zkvote.address, signers[2], TREE_LEVELS, commitment, "keys/Verifier.zkey")

        await zkvote.connect(signers[1]).vote(cd.nullifierHash, cd.root, 1, cd.proof_a, cd.proof_b, cd.proof_c)
        await zkvote.connect(signers[1]).vote(cd1.nullifierHash, cd1.root, 1, cd1.proof_a, cd1.proof_b, cd1.proof_c)




    });*/
});
