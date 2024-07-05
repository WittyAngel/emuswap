import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"
import {toStr} from "../utils"

export const swap = async (signer, amountIn, token1Name, token2Name) => {    
    let script;
    if(token1Name === 'FLOW' && token2Name === 'FUSD') {
        script = `
            import FungibleToken from 0xFungibleToken
            import FungibleTokens from 0xFungibleTokens
            import FUSD from 0xFUSD
            import FlowToken from 0xFlowToken
            import EmuSwap from 0xEmuSwap

            // swap_flow_for_fusd

            transaction(amountIn: UFix64) {
                // The Vault references that holds the tokens that are being transferred
                let flowTokenVaultRef: &FlowToken.Vault
                let fusdVaultRef: &FUSD.Vault

                prepare(signer: AuthAccount) {
                    self.flowTokenVaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                    ?? panic("Could not borrow a reference to FLOW Vault")

                    if signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
                    // Create a new FUSD Vault and put it in storage
                    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

                    // Create a public capability to the Vault that only exposes
                    // the deposit function through the Receiver interface
                    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
                        /public/fusdReceiver,
                        target: /storage/fusdVault
                    )

                    // Create a public capability to the Vault that only exposes
                    // the balance field through the Balance interface
                    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
                        /public/fusdBalance,
                        target: /storage/fusdVault
                    )
                    }

                    self.fusdVaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                    ?? panic("Could not borrow a reference to FUSD Vault")
                }

                execute {    
                    let token2Vault <- self.fusdVaultRef.withdraw(amount: amountIn) as! @FUSD.Vault

                    let token1Vault <- EmuSwap.borrowPool(id: 0)?.swapToken2ForToken1!(from: <-token2Vault)

                    self.flowTokenVaultRef.deposit(from: <- token1Vault)
                }
            }
            `;
    } else {
        script = `
            import FungibleToken from 0xFungibleToken
            import FungibleTokens from 0xFungibleTokens
            import FUSD from 0xFUSD
            import FlowToken from 0xFlowToken
            import EmuSwap from 0xEmuSwap

            // swap_flow_for_fusd

            transaction(amountIn: UFix64) {
                // The Vault references that holds the tokens that are being transferred
                let flowTokenVaultRef: &FlowToken.Vault
                let fusdVaultRef: &FUSD.Vault

                prepare(signer: AuthAccount) {
                    self.flowTokenVaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                    ?? panic("Could not borrow a reference to FLOW Vault")

                    if signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
                    // Create a new FUSD Vault and put it in storage
                    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

                    // Create a public capability to the Vault that only exposes
                    // the deposit function through the Receiver interface
                    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
                        /public/fusdReceiver,
                        target: /storage/fusdVault
                    )

                    // Create a public capability to the Vault that only exposes
                    // the balance field through the Balance interface
                    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
                        /public/fusdBalance,
                        target: /storage/fusdVault
                    )
                    }

                    self.fusdVaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                    ?? panic("Could not borrow a reference to FUSD Vault")
                }

                execute {    
                    let token2Vault <- self.fusdVaultRef.withdraw(amount: amountIn) as! @FUSD.Vault

                    let token1Vault <- EmuSwap.borrowPool(id: 0)?.swapToken2ForToken1!(from: <-token2Vault)

                    self.flowTokenVaultRef.deposit(from: <- token1Vault)
                }
            }
            `;
    }
    const transactionId = await fcl.mutate({
        cadence: script,
        args: (arg) => [arg(toStr(amountIn), t.UFix64)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("Swap", transaction)
}
