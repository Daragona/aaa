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

    const ZKVote = await ethers.getContractFactory("ZKVote");
    const zkvote = await ZKVote.deploy(TREE_LEVELS, mimcsponge.address, verifier.address, 4);
    console.log(`ZKVote address: ${zkvote.address}`)

    // add the 2nd hardhat account as a validator
    await zkvote.registerValidator(signers[1].address)

    fs.writeFileSync("static/contracts.json", JSON.stringify({
        mimc: mimcsponge.address,
        verifier: verifier.address,
        zkvote: zkvote.address
    }))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});