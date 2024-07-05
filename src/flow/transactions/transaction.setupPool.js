import * as fcl from "@onflow/fcl"
import "../config"

export const setupPool = async (signer) => {
    const transactionId = await fcl.mutate({
        cadence: `
    import FungibleToken from 0xFungibleToken
    import xEmuToken from 0xxEmuToken
    import EmuToken from 0xEmuToken

    transaction {
        prepare(signer: AuthAccount) {

            let existingVault = signer.borrow<&xEmuToken.Vault>(from: xEmuToken.EmuTokenStoragePath)

            // If the account is already set up that's not a problem, but we don't want to replace it
            if (existingVault != nil) {
                return
            }
            
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
    }
    `,
        args: (arg) => [],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("setupPool", transaction)
}
