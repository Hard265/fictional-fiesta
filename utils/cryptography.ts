import * as Crypto from "expo-crypto";
import Buffer from "buffer";

const wordlist: string[] = require("../assets/wordlist/english.json");

export function generateMnemonic(): string {
    const strength = 128;
    const initialEntropy: Uint8Array = Crypto.getRandomBytes(strength / 8);

    return entropyToMnemonic(initialEntropy);
}

function entropyToMnemonic(entropy: Uint8Array): string {
    const entropyBits: string = Array.from(entropy)
        .map((x: number) => x.toString(2).padStart(8, "0"))
        .join("");
    const checksumBits: Promise<string> = deriveChecksumBits(entropy);

    const bits: string = entropyBits + checksumBits;
    const chunks: RegExpMatchArray | null = bits.match(/(.{1,11})/g);

    if (chunks === null) {
        throw new Error("Invalid entropy");
    }

    const words: string[] = chunks.map((binary: string) => {
        const index: number = parseInt(binary, 2);
        return wordlist[index];
    });
    return words.join(" ");
}

async function deriveChecksumBits(entropyBuffer: Uint8Array): Promise<string> {
    const hash: string = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        entropyBuffer.toString()
    );
    const hashBits: string = BigInt("0x" + hash).toString(2);
    return hashBits.slice(0, entropyBuffer.length / 4);
}

/*
export function mnemonicToEntropy(mnemonic: string): string {
  const words = mnemonic.split(" ");

  const bits = words
    .map((word) => lpad(wordlist.indexOf(word).toString(2), "0", 11))
    .join("");

  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropy = bits.slice(0, dividerIndex);
  const checksum = bits.slice(dividerIndex);

  const entropyBytes: number[] = entropy
    .match(/.{1,8}/g)!
    .map((bin) => parseInt(bin, 2));
  const entropyBuffer = Buffer.Buffer.from(entropyBytes);

  return entropyBuffer.toString("hex");
}

function lpad(str: string, padString: string, length: number): string {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}
*/