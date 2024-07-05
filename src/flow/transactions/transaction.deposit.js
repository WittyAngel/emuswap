import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"
import { toStr } from "../utils"

export const deposit = async (signer, amount) => {
    const transactionId = await fcl.mutate({
        cadence: `
    // create_new_pool.cd 
    //
    // This transaction withdraws lp tokens from users account and stakes them

    import FungibleToken from 0xFungibleToken
    import FungibleTokens from 0xFungibleTokens
    import EmuSwap from 0xEmuSwap
    import EmuToken from 0xEmuToken
    import StakingRewards from 0xStakingRewards

    // hardcoded to create Flow/FUSD pool
    import FlowToken from 0xFlowToken
    import FUSD from 0xFUSD


    transaction(amount: UFix64) {
        // LP Tokens Collection ref
        let lpTokensCollection: &EmuSwap.Collection

        // The TokenVault reference for withdrawing liquidity tokens
        let liquidityTokenRef: &FungibleTokens.TokenVault

        // The pool reference to withdraw liquidity from
        let pool: &EmuSwap.Pool

        // new pool to deposit to collection
        let lpTokenVault: @EmuSwap.TokenVault

        // the signers auth account to pass to execute block
        let signer: AuthAccount

        prepare(signer: AuthAccount) {

            
            // check if Collection is created if not then create
            if signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath) == nil {
            // Create a new Collection and put it in storage
            signer.save(<- EmuSwap.createEmptyCollection(), to: EmuSwap.LPTokensStoragePath)
            signer.link<&EmuSwap.Collection>(EmuSwap.LPTokensPublicReceiverPath, target: EmuSwap.LPTokensStoragePath)
            }

            if signer.borrow<&EmuToken.Vault>(from: EmuToken.EmuTokenStoragePath) == nil {
                signer.link<&EmuToken.Vault{FungibleToken.Receiver}>(
                EmuToken.EmuTokenReceiverPublicPath,
                target: EmuToken.EmuTokenStoragePath
                )
            }


            self.lpTokensCollection = signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath)
            ?? panic("Could not borrow reference to signers LP Tokens collection")

            self.liquidityTokenRef = self.lpTokensCollection.borrowVault(id: 0)

            self.pool = EmuSwap.borrowPool(id: 0) 
            ?? panic("Could not borrow pool")

            // Withdraw liquidity provider tokens from Pool
            self.lpTokenVault <- self.liquidityTokenRef.withdraw(amount: amount) as! @EmuSwap.TokenVault

            self.signer = signer
        }

        execute {
            // get reference to farm
            let farmRef = StakingRewards.borrowFarm(id: 0)!
            
            // get deposit capabilities for returning lp tokens and rewards 
            let lpTokensReceiverCap = self.signer.getCapability<&{FungibleTokens.CollectionPublic}>(EmuSwap.LPTokensPublicReceiverPath)
            let rewardsReceiverCap = self.signer.getCapability<&{FungibleToken.Receiver}>(EmuToken.EmuTokenReceiverPublicPath)

            // check if there is an existing stake controller
            if self.signer.borrow<&StakingRewards.StakeControllerCollection>(from: StakingRewards.CollectionStoragePath) == nil {
            self.signer.save(<-StakingRewards.createStakingControllerCollection() , to: StakingRewards.CollectionStoragePath)
            }

            // get stake controller collection ref 
            let stakeControllerCollection = self.signer.borrow<&StakingRewards.StakeControllerCollection>(from: StakingRewards.CollectionStoragePath)!

            // stake the tokens and optionally receive a controller if first time staking
            let stakingController <- farmRef.stake(lpTokens: <-self.lpTokenVault, lpTokensReceiverCap: lpTokensReceiverCap, rewardsReceiverCaps: [rewardsReceiverCap], nftReceiverCaps: [], nfts: <- [])
            
            if stakingController != nil {
            stakeControllerCollection.deposit(stakeController: <-stakingController!)
            } else {
            // it's nil!
            destroy stakingController
            }    
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
    console.log("Deposit", transaction)
}
