import BccWasm = require('rust-lib')
import { expect } from 'chai'
import 'mocha';
import { mnemonicToEntropy } from 'bip39';

function harden(num: number): number {
  return 0x80000000 + num;
}

// Purpose derivation (See BIP43)
enum Purpose {
  CIP1852=1852, // see CIP 1852
}

// Bcc coin type (SLIP 44)
enum CoinTypes {
  BCC=1815,
}

enum ChainDerivation {
  EXTERNAL=0, // from BIP44
  INTERNAL=1, // from BIP44
  CHIMERIC=2, // from CIP1852
}

function getCip1852Account(): BccWasm.Bip32PrivateKey {
  const entropy = mnemonicToEntropy(
    [ "test", "walk", "nut", "penalty", "hip", "pave", "soap", "entry", "language", "right", "filter", "choice" ].join(' ')
  )
  const rootKey = BccWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(''),
  );
  return rootKey
    .derive(harden(Purpose.CIP1852))
    .derive(harden(CoinTypes.BCC))
    .derive(harden(0)); // account #0
}

describe('Addresses', () => {
  it('derive base address', () => {
    // from address test vectors

    const cip1852Account = getCip1852Account();

    const utxoPubKey = cip1852Account
      .derive(ChainDerivation.EXTERNAL)
      .derive(0)
      .to_public();
    const stakeKey = cip1852Account
      .derive(ChainDerivation.CHIMERIC)
      .derive(0)
      .to_public();

    const baseAddr = BccWasm.BaseAddress.new(
      0,
      BccWasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
      BccWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
    );

    expect(baseAddr.to_address().to_bech32()).to.eq('addr1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwqcyl47r');
  })
});

describe('Transactions', () => {
  it('create transaction', () => {
    const txBuilder = BccWasm.TransactionBuilder.new(
      // all of these are taken from the mainnet genesis settings
      BccWasm.LinearFee.new(BccWasm.BigNum.from_str('44'), BccWasm.BigNum.from_str('155381')),
      BccWasm.BigNum.from_str('1000000'),
      BccWasm.BigNum.from_str('500000000'),
      BccWasm.BigNum.from_str('2000000')
    );

    const address = BccWasm.ColeAddress.from_base58("Ae2tdPwUPEZLs4HtbuNey7tK4hTKrwNwYtGqp7bDfCy2WdR3P6735W5Yfpe");
    txBuilder.add_bootstrap_input(
      address,
      BccWasm.TransactionInput.new(
        BccWasm.TransactionHash.from_bytes(
          Buffer.from("488afed67b342d41ec08561258e210352fba2ac030c98a8199bc22ec7a27ccf1", "hex"),
        ),
        0, // index
      ),
      BccWasm.BigNum.from_str('3000000')
    );

    txBuilder.add_output(
      BccWasm.TransactionOutput.new(
        address.to_address(),
        // we can construct BigNum (Coin) from both a js BigInt (here) or from a string (below in fee)
        BccWasm.BigNum.from_str("1000000"),
      ),
    );

    txBuilder.set_ttl(410021);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(BccWasm.ColeAddress.from_base58("Ae2tdPwUPEYxiWbAt3hUCJsZ9knze88qNhuTQ1MGCKqsVFo5ddNyoTDBymr").to_address())

    const txBody = txBuilder.build();
    const txHash = BccWasm.hash_transaction(txBody);
    const witnesses = BccWasm.TransactionWitnessSet.new();
    const bootstrapWitnesses = BccWasm.BootstrapWitnesses.new();
    const bootstrapWitness = BccWasm.make_icarus_bootstrap_witness(txHash,address,getCip1852Account());
    bootstrapWitnesses.add(bootstrapWitness);
    witnesses.set_bootstraps(bootstrapWitnesses);
    const transaction = BccWasm.Transaction.new(
      txBody,
      witnesses,
      undefined, // transaction metadata
    );

    const txHex = Buffer.from(transaction.to_bytes()).toString("hex");
    console.log(txHex);
  })
});
