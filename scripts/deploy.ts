import * as fs from 'fs'
import { ethers } from "hardhat";
import { mimcSpongecontract } from 'circomlibjs'

const SEED = "mimcsponge";
const TREE_LEVELS = 20;

async function main() {

    const signers = await ethers.getSigners()

    const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signers[0])
    const mimcsponge = await MiMCSponge.deploy()
    console.log(`MiMC sponge hasher address: ${mimcsponge.address}`)

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    console.log(`Verifier address: ${verifier.address}`)

    const ZKMap = await ethers.getContractFactory("ZKMapVote");
    const zkmap = await ZKMap.deploy();
    console.log(`ZKMapVote address: ${zkmap.address}`)


    fs.writeFileSync("static/contracts.json", JSON.stringify({
        mimc: mimcsponge.address,
        verifier: verifier.address,
        zkmap: zkmap.address
    }))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});