import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"
import { toStr } from "../utils"

export const exitPool = async (signer, amount) => {
    const transactionId = await fcl.mutate({
        cadence: `
    import FungibleToken from 0xFungibleToken
    import xEmuToken from 0xxEmuToken
    import EmuToken from 0xEmuToken

    // User deposits xEmuTokens and receives EmuTokens in return

    transaction(amount: UFix64) {

    // The Vault resource that holds the tokens being transferred
    let emuVault: @FungibleToken.Vault
    let emuVaultRef: &FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // Get a reference to the signer's stored EmuToken vault
        let vaultRef = signer
        .borrow<&xEmuToken.Vault>(from: xEmuToken.EmuTokenStoragePath)
        ?? panic("Could not borrow reference to the owner's Vault!")
            
        self.emuVaultRef = signer.borrow<&EmuToken.Vault>(from: EmuToken.EmuTokenStoragePath)!
        
        // Withdraw tokens from the signer's stored vault
        self.emuVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        self.emuVaultRef.deposit(from: <- xEmuToken.leavePool(xEmuTokens: <-self.emuVault) )
    }
    }
    `,
        args: (arg) => [arg(toStr(amount), t.UFix64)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("exitPool", transaction)
}
