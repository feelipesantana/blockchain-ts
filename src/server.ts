import { Blockchain } from "./blockchain";

const difficulty = Number(process.argv[2]) || 4
const blockchain = new Blockchain(difficulty);

const blockNumbers = Number(process.argv[3]) || 10
let chain = blockchain.chain

for (let i = 1; i <= blockNumbers; i++) {
    const block = blockchain.createBlock(`Block ${i}`)
    const mineInfo = blockchain.mineBlock(block)

    chain = blockchain.sendBlock(mineInfo.blockMined)
}

console.log('---Blockchain---')
console.log(chain)