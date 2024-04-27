import { hash, hashValidate } from "./helpers"
export interface Block {
    header: {
        nonce: number
        hashBlock: string
    }
    payload: {
        sequence: number
        timestamp: number
        data: any
        hashBefore: string
    }
}

export class Blockchain {
    #chain: Block[] = []
    private prefixProfOfWork = '0'

    constructor(private readonly difficulty: number) {
        this.#chain.push(this.createBlockGenesis())
    }

    get chain(): Block[] {
        return this.#chain
    }
    private createBlockGenesis(): Block {
        const payload: Block['payload'] = {
            sequence: 0,
            timestamp: +new Date(),
            data: 'Block Inicial',
            hashBefore: ''
        }
        return {
            header: {
                nonce: 0,
                hashBlock: hash(JSON.stringify(payload))
            },
            payload
        }
    }
    private get lastBlock(): Block {
        return this.#chain.at(-1) as Block
    }

    private hashLastBlock(): string {
        return this.lastBlock.header.hashBlock
    }

    createBlock(data: any): Block['payload'] {
        const newBlock = {
            sequence: this.lastBlock.payload.sequence + 1,
            timestamp: +new Date(),
            data,
            hashBefore: this.hashLastBlock()
        }

        console.log(`Block ${newBlock.sequence} created ${JSON.stringify(newBlock)}`)

        return newBlock
    }

    mineBlock(block: Block['payload']) {
        let nonce: number = 0
        let inicial: number = +new Date()


        while (true) {
            const hashBlock = hash(JSON.stringify(block))
            const hashProfOfWork = hash(hashBlock + nonce)


            if (hashValidate({ hash: hashProfOfWork, difficulty: this.difficulty, prefix: this.prefixProfOfWork })) {
                const final: number = +new Date()
                const hashFew = hashBlock.slice(0, 12)
                const timeMined: number = (final - inicial) / 1000

                console.log(`Black #${block.sequence} mined in ${timeMined}s. Hash ${hashFew} (${nonce} attempt ) }`)

                return {
                    blockMined: {
                        payload: { ...block },
                        header: {
                            nonce,
                            hashBlock
                        }
                    }
                }
            }
            nonce++
        }

    }

    verifyBlock(block: Block): boolean {
        if (block.payload.hashBefore !== this.hashLastBlock()) {
            console.error(`Block ${block.payload.sequence} invalid: The Before Hash is ${this.hashLastBlock().slice(0, 12)} and no ${block.payload.hashBefore.slice(0, 12)}`)
            return false
        }

        const hashTest = hash(JSON.stringify(block.payload)) + block.header.nonce
        if (!hashValidate({ hash: hashTest, difficulty: this.difficulty, prefix: this.prefixProfOfWork })) {
            console.error(`Block ${block.payload.sequence} invalid:  Nonce ${block.header.nonce} is  invalid and It cannot be verified`)
            return false
        }

        return true
    }

    sendBlock(block: Block): Block[] {
        if (this.verifyBlock(block)) {
            this.#chain.push(block)
            console.log(`Block #${block.payload.sequence} went add to blockchain: ${JSON.stringify(block, null, 2)}`)

        }

        return this.#chain

    }

}


