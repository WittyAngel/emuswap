import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"

export const getFarmMetaData = async (poolID) => {
  const info = await fcl.query({
      cadence: `
      import StakingRewards from 0xStakingRewards

      pub fun main(id: UInt64): StakingRewards.FarmMeta? {
          return StakingRewards.getFarmMeta(id: id)
      }
      `,
      args: (arg) => [arg(poolID, t.UInt64)]
  })

  return info;
}
