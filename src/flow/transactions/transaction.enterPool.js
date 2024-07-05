import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"
import { toStr } from "../utils"

export const enterPool = async (signer, amount) => {
    const transactionId = await fcl.mutate({
        cadence: `
    import FungibleToken from 0xFungibleToken
    import xEmuToken from 0xxEmuToken
    import EmuToken from 0xEmuToken

    transaction(amount: UFix64) {

    // The Vault resource that holds the tokens being transferred
    let emuVault: @FungibleToken.Vault
    let xEmuVaultRef: &FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // Get a reference to the signer's stored EmuToken vault
        let vaultRef = signer
        .borrow<&EmuToken.Vault>(from: EmuToken.EmuTokenStoragePath)
        ?? panic("Could not borrow reference to the owner's Vault!")

        let xEmuVault = signer.borrow<&xEmuToken.Vault>(from: xEmuToken.EmuTokenStoragePath)
        if xEmuVault == nil {
            // Create a new xEmu Vault and put it in storage
            signer.save(<-xEmuToken.createEmptyVault(), to: xEmuToken.EmuTokenStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&xEmuToken.Vault{FungibleToken.Receiver}>(
                xEmuToken.xEmuTokenReceiverPublicPath,
                target: xEmuToken.EmuTokenStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&xEmuToken.Vault{FungibleToken.Balance}>(
                xEmuToken.xEmuTokenBalancePublicPath,
                target: xEmuToken.EmuTokenStoragePath
            )
        }        
        
        self.xEmuVaultRef = xEmuVault!
        // Withdraw tokens from the signer's stored vault
        self.emuVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        self.xEmuVaultRef.deposit(from: <- xEmuToken.enterPool(emuTokens: <-self.emuVault) )
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
    console.log("enterPool", transaction)
}
