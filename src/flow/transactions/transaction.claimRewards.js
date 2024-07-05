import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"

export const claimRewards = async (signer, farmID) => {
    const transactionId = await fcl.mutate({
        cadence: `
    import FungibleToken from 0xFungibleToken
    import FungibleTokens from 0xFungibleTokens
    import EmuSwap from 0xEmuSwap
    import EmuToken from 0xEmuToken
    import StakingRewards from 0xStakingRewards

    // hardcoded to create Flow/FUSD pool
    import FlowToken from 0xFlowToken
    import FUSD from 0xFUSD

    transaction(farmID: UInt64) {
    
        let stakeControllerCollectionRef: &StakingRewards.StakeControllerCollection

        prepare(signer: AuthAccount) {
            // get stake controller collection ref 
            self.stakeControllerCollectionRef = signer.borrow<&StakingRewards.StakeControllerCollection>(from: StakingRewards.CollectionStoragePath)!
        }

        execute {
            // get reference to farm
            let farmRef = StakingRewards.borrowFarm(id: farmID)!
        
            // stake the tokens and optionally receive a controller if first time staking
            let stakingController = self.stakeControllerCollectionRef.borrow(id: farmID)! as &StakingRewards.StakeController

            // sends them to the receiver cap provided when staking.... j00lz maybe only store caps in the stake not in the controller too?
            farmRef.claimRewards(stakeControllerRef: stakingController)
        }
    }
    `,
        args: (arg) => [arg(farmID, t.UInt64)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("ClainRewards", transaction)
}
