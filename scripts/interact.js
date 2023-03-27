const API_URL = "https://eth-goerli.g.alchemy.com/v2/xvZdIjRq2kkwmpd7FKofKMbMKnCpZaz1"
const API_KEY = "xvZdIjRq2kkwmpd7FKofKMbMKnCpZaz1"
const PRIVATE_KEY = "2fb76d17350947ea1a658742b5b5113cdc34b897f89f53f47160da3bd8d4d88c"
const CONTRACT_ADDRESS= "0x480eb6b9c803C94ba12525B1fb99D450136eb1ae"

const contract = require("../artifacts/contracts/ZKMapVote.sol/ZKMapVote.json");



const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", API_KEY);

// Signer
//const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
//const zkVoteContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
/*
async function main() {
  await zkVoteContract.newVotation(20,"0x3034cD9FDE929139399743430dF5fe340E77308d", "0xE549DD626C1D1D50d9De5A9c2A452544aB978E4b", "Chi vince?", 3, ["Napoli","Milan","Roma","","","","","","",""]);
  const info=zkVoteContract.getInfoVotation(0);
  console.log("The message is: " + info);
}

//uint32 _levels, IHasher _hasher, IVerifier _verifier, string memory _title, uint _numOption, string[10] memory _options) 

main();*/