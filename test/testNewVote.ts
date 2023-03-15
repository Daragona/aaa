import { ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'
import { ZKVote } from "../typechain-types";
import { ZKTree } from "../typechain-types";
import { generateCommitment, calculateMerkleRootAndZKProof } from '../zk-merkle-tree/src/zktree';
import { BigNumberish } from "ethers";

const SEED = "mimcsponge";

// the default verifier is for 20 levels, for different number of levels, you need a new verifier circuit
const TREE_LEVELS = 20;



describe("ZKVote Smart contract test", () => {
    const fs = require('fs');

    let zkvote : ZKVote;
    before(async () => {
        const ZKVote = await ethers.getContractFactory("ZKVote");
        zkvote = await ZKVote.deploy();


    });

    it("Add 2 votations", async() =>{
        const signers = await ethers.getSigners()

        let MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        let mimcsponge = await MiMCSponge.deploy()
        let Verifier = await ethers.getContractFactory("Verifier");
        let verifier = await Verifier.deploy();
        zkvote.addVotation(TREE_LEVELS, mimcsponge.address, verifier.address,"Who will win Serie A 2022-2023?");

        MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
        mimcsponge = await MiMCSponge.deploy()
        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        zkvote.addVotation(TREE_LEVELS, mimcsponge.address, verifier.address,"Who's the Napoli Emperor");
    });


    it("Add 3 and 2 options each", async() =>{
        zkvote.addOption(0, "Napoli");
        zkvote.addOption(0, "Milan");
        zkvote.addOption(0, "Juve");
        zkvote.addOption(1, "Messi");
        zkvote.addOption(1, "Maradona");
    });

    it("Read all votations", async() =>{
        let num=await zkvote.getNumVotations();
        for(let i=0;i<num;i++){
            let title = await zkvote.getTitleVotation(i);
            let opzioni = await zkvote.getOptions(i);
            console.log(title+"\nOptions votation "+(i+1)+":" , opzioni);
        }
    });

    it("Add validators and whitelist", async() =>{
        const signers = await ethers.getSigners()
        zkvote.addValidator(0,signers[0].address);
        zkvote.addValidator(1,signers[1].address);

        zkvote.addWhitelist(0,signers[2].address);
        zkvote.addWhitelist(0,signers[3].address);
        zkvote.addWhitelist(0,signers[4].address);
        zkvote.addWhitelist(1,signers[5].address);
        zkvote.addWhitelist(1,signers[6].address);

    });

    it("Create and save in files commitment for each", async() =>{
        const signers = await ethers.getSigners()
        let commit,cd ,tofile;
        for(let i=0;i<3;i++){
            commit = await generateCommitment()
            await zkvote.registerCommitment(0,10,commit.commitment,signers[i+2].address);
//            cd = await calculateMerkleRootAndZKProof((await zkvote.getVotation()).address, signers[i+2], TREE_LEVELS, commit, "keys/Verifier.zkey")
            cd = await calculateMerkleRootAndZKProof(await zkvote.address, signers[i+2], TREE_LEVELS, commit, "keys/Verifier.zkey")

            tofile = JSON.stringify(cd, null, 1);
            fs.writeFileSync('prove/MerkleRoot'+i+'.json', tofile);
        }

    });

});