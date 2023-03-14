import { artifacts, ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'
import { ZKVote } from "../typechain-types";
//import { ZKMapVote } from "../typechain-types";
import { generateCommitment, calculateMerkleRootAndZKProof, PromiseOrValue } from 'zk-merkle-tree';
import { BigNumberish } from "ethers";

const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;

describe("ZKMapVote test daje", ()=>{
    let zkvote : ZKVote;
    before(async () =>{
        let ZKMapVote = artifacts.require("ZKMapVote");
    });


    it("Add 2 votations", async () =>{
        const signers = await ethers.getSigners()
        const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        const mimcsponge = await MiMCSponge.deploy()
        const Verifier = await ethers.getContractFactory("Verifier");
        const verifier = await Verifier.deploy();
        const ZKVote = await ethers.getContractFactory("ZKVote");
        //zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address, 4);
        ZKMapVote.newVotation(TREE_LEVELS, mimcsponge.address, verifier.address, 4);
    });

});
