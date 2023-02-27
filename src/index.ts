import { ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'
import { ZKVote } from "../typechain-types";
//import { ZKTreeVote } from "../typechain-types";

import { generateCommitment, calculateMerkleRootAndZKProof } from 'zk-merkle-tree';

const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;


//describe("ZKVote Smart contract test", () => {
  
    let zkvote: ZKVote;

    before(async () => {
        const signers = await ethers.getSigners()
        const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        const mimcsponge = await MiMCSponge.deploy()
        const Verifier = await ethers.getContractFactory("Verifier");
        const verifier = await Verifier.deploy();
        const ZKVote = await ethers.getContractFactory("ZKVote");
        zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address, 4);
        console.log(mimcsponge.address,",",verifier.address)
        // 20, 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0x584483D20b2Ee1754C9F93e560B6746698E94DBF, 4
        // 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0xdD2FD4581271e230360230F9337D5c0430Bf44C0
    });
async function genera(){
    const commitment1 = await generateCommitment()

}