import { mnemonicToEntropy } from "../../utils/cryptography"

describe('mnemonic', ()=>{
    it('should return a seed', ()=>{
        expect(mnemonicToEntropy('')).toBe(String)
    })
})