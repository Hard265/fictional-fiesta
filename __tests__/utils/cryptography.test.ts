import { generateMnemonic } from "../../utils/cryptography";


describe('seed phrase', ()=>{
    it('should return 12 words', ()=>{
        const mnemonic = generateMnemonic().split(' ')
        expect(mnemonic.length).toBe(12)
    })
})