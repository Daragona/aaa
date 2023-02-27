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
        zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address, 4);

        console.log(mimcsponge.address,",",verifier.address)
        await zkvote.registerValidator(signers[1].getAddress())


        //0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
        // 20, 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0x584483D20b2Ee1754C9F93e560B6746698E94DBF, 4
        // 0x5FbDB2315678afecb367f032d93F642f64180aa3 , 0xdD2FD4581271e230360230F9337D5c0430Bf44C0
    });
/*
    it("Test the full process", async () => {
        const signers = await ethers.getSigners()
        await zkvote.registerValidator(signers[1].address)

        // register 3 voters
        const commitment1 = await generateCommitment()
        console.log(commitment1);
        /* await zkvote.connect(signers[1]).registerCommitment(commitment1.nullifier, commitment1.commitment)
        const commitment2 = await generateCommitment()
        await zkvote.connect(signers[1]).registerCommitment(commitment2.nullifier, commitment2.commitment)
        const commitment3 = await generateCommitment()
        await zkvote.connect(signers[1]).registerCommitment(commitment3.nullifier, commitment3.commitment)*/
        
        /*
        let commitment: { nullifier: any; commitment: any; secret?: string; nullifierHash?: any; }
        let cd: { nullifierHash: any; root: any; proof_a: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]; proof_b: [[PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>], [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]]; proof_c: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]; }
        let tofile={list:[]}
        for(let i=0;i<1;i++){
            commitment= await generateCommitment();
            await zkvote.connect(signers[1]).registerCommitment(commitment.nullifier, commitment.commitment)
            cd = await calculateMerkleRootAndZKProof(zkvote.address, signers[i+2],TREE_LEVELS, commitment, "keys/Verifier.zkey")
            //const tofile = JSON.stringify(cd,null,1)
            tofile.list.push(cd);
        }
        let json = JSON.stringify(cd,null,1);

        fs.writeFileSync('Prove.json', json)
        */


      //  var dataArray = JSON.parse(fs.readFileSync('Prove.json'))
        //console.log(dataArray[)

        // votes
       /* let cd1 = await calculateMerkleRootAndZKProof(zkvote.address, signers[2], TREE_LEVELS, commitment1, "keys/Verifier.zkey")
        const tofile = JSON.stringify(cd1, null, 1);
        fs.writeFileSync('MerkleRoot.json', tofile);

        cd1=null;
        let rawcd1 = fs.readFileSync('MerkleRoot.json');
        cd1 = JSON.parse(rawcd1);

        const cd2 = await calculateMerkleRootAndZKProof(zkvote.address, signers[3], TREE_LEVELS, commitment2, "keys/Verifier.zkey")
        const cd3 = await calculateMerkleRootAndZKProof(zkvote.address, signers[4], TREE_LEVELS, commitment3, "keys/Verifier.zkey")
        

        await zkvote.connect(signers[4]).vote(cd3.nullifierHash, cd3.root, 3, cd3.proof_a, cd3.proof_b, cd3.proof_c)
        await zkvote.connect(signers[2]).vote(cd1.nullifierHash, cd1.root, 2, cd1.proof_a, cd1.proof_b, cd1.proof_c)
        await zkvote.connect(signers[3]).vote(cd2.nullifierHash, cd2.root, 2, cd2.proof_a, cd2.proof_b, cd2.proof_c)
*/




/*
        let nullifierHash="19848102858197523418676573418626205666730009294342783947692725265854859633137"
        let root="10161390285682738923531366844052284948247834301738371567168993736282589622959"
        let proof_a=[]
        proof_a[0]="13743911003748331633701431869004876511744717888153090372514249907569845401899"
        proof_a[1]="14575366145874617731681475840200911891951880161431936480343064558681894838142"

*/

            // results
  //          });

    it("Save proof", async () => {
        const signers = await ethers.getSigners()
        const commitment1 = await generateCommitment()
        const commitment2 = await generateCommitment()
        const commitment3 = await generateCommitment()
        let asd=signers[4].getAddress();
        await zkvote.connect(signers[1]).registerWhitelist(signers[4].getAddress())
        await zkvote.connect(signers[1]).registerWhitelist(signers[5].getAddress())
        await zkvote.connect(signers[1]).registerWhitelist(signers[6].getAddress())
        
        await zkvote.connect(signers[1]).registerCommitment(4, commitment1.commitment, signers[4].getAddress())
        await zkvote.connect(signers[1]).registerCommitment(5, commitment2.commitment, signers[5].getAddress())
        await zkvote.connect(signers[1]).registerCommitment(6, commitment3.commitment, signers[6].getAddress())

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

});
