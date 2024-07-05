import * as fcl from "@onflow/fcl"
import "../config"

export const getTokenBalance = async (address, tokenName) => {    
  let info
  if (tokenName === "FLOW") {
    info = await fcl.query({
        cadence: `
        import FungibleToken from 0xFungibleToken
        import FlowToken from 0xFlowToken

        pub fun main(account: Address): UFix64 {

            let vaultRef = getAccount(account)
                .getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
                ?? panic("Could not borrow Balance reference to the Vault")

            return vaultRef.balance
        }
        `,
          args: (arg, t) => [arg(address, t.Address)]
      })
  } else {
    info = await fcl.query({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD

        pub fun main(account: Address): UFix64 {

            let vaultRef = getAccount(account)
                .getCapability(/public/fusdBalance)
                .borrow<&FUSD.Vault{FungibleToken.Balance}>()
                ?? panic("Could not borrow Balance reference to the Vault")

            return vaultRef.balance
        }
        `,
      args: (arg, t) => [arg(address, t.Address)]
    })
  }

  return info
}
