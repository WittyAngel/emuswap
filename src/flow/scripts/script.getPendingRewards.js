import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"

export const getPendingRewards = async (poolID, address) => {
  const info = await fcl.query({
    cadence: `
      import StakingRewards from 0xStakingRewards

      pub fun main(id: UInt64, address: Address):  {UInt64: Fix64}? {
          return StakingRewards.borrowFarm(id: id)?.getPendingRewards(address: address)!
      }
      `,
    args: (arg) => [arg(poolID, t.UInt64), arg(address, t.Address)]
  })
  if (Object.keys(info).length === 0)
    return 0;
  return info[0];
}
