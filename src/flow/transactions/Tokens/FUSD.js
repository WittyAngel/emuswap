import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const setupFUSD = async (signer, amount , recipientAddress) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD
        
        transaction {
            prepare(signer: AuthAccount) {
        
            let existingVault = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
        
            // If the account is already set up that's not a problem, but we don't want to replace it
            if (existingVault != nil) {
                return
            }
            
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
        }
        `,
        args: (arg, t) => [],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("setupFUSD",transaction)
}

export const transferFUSD = async (signer, amount , to) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD
        
        transaction(amount: UFix64, to: Address) {

            // The Vault resource that holds the tokens being transferred
            let sentVault: @FungibleToken.Vault
          
            prepare(signer: AuthAccount) {
              // Get a reference to the signer's stored vault
              let vaultRef = signer
                .borrow<&FUSD.Vault>(from: /storage/fusdVault)
                ?? panic("Could not borrow reference to the owner's Vault!")
          
              // Withdraw tokens from the signer's stored vault
              self.sentVault <- vaultRef.withdraw(amount: amount)
            }
          
            execute {
              // Get the recipient's public account object
              let recipient = getAccount(to)
          
              // Get a reference to the recipient's Receiver
              let receiverRef = recipient
                .getCapability(/public/fusdReceiver)!
                .borrow<&{FungibleToken.Receiver}>()
                ?? panic("Could not borrow receiver reference to the recipient's Vault")
          
              // Deposit the withdrawn tokens in the recipient's receiver
              receiverRef.deposit(from: <-self.sentVault)
            }
        }
        `,
        args: (arg, t) => [arg(amount, t.UFix64), arg(to, t.Address)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("setupFUSD",transaction)
}

export const mintFUSD = async (signer, amount , recipientAddress) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD

        transaction(amount: UFix64, recipientAddress: Address) {
            prepare(signer: AuthAccount) {
          
              let fusdTokenAdmin = signer.borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath) ?? panic("no flow token administrator found in storage")
          
              let minter <- fusdTokenAdmin.createNewMinter()
          
              let tokens <- minter.mintTokens(amount: amount)
            
              destroy minter
              
              let receiverRef = getAccount(recipientAddress)
                    .getCapability(/public/fusdReceiver)
                    .borrow<&{FungibleToken.Receiver}>()  
                    ?? panic("Cannot borrow account: 0x01cf0e2f2f715450 fusdTokenReceiver Cap")
          
             
              receiverRef.deposit(from: <- tokens)
            }
        }
        `,
        args: (arg, t) => [arg(amount, t.UFix64), arg(recipientAddress, t.Address)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("mintFUSDs",transaction)

}