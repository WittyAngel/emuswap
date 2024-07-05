import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../config"

export const getPoolMetaData = async (poolID) => {
  const info = await fcl.query({
    cadence: `
      import EmuSwap from 0xEmuSwap

      pub fun main(poolID: UInt64): EmuSwap.PoolMeta {
          let poolRef = EmuSwap.borrowPool(id: poolID)
          return poolRef!.getPoolMeta()
      }
      `,
    args: (arg) => [arg(poolID, t.UInt64)]
  })

  return info;
}
