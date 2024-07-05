import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"

export const getStakesInfo = async (poolID) => {
  const info = await fcl.query({
    cadence: `
      import StakingRewards from 0xStakingRewards

      pub fun main(id: UInt64): {Address: StakingRewards.StakeInfo} {
          return StakingRewards.borrowFarm(id: id)?.readStakes()!
      }
      `,
    args: (arg) => [arg(poolID, t.UInt64)]
  })

  return info;
}
