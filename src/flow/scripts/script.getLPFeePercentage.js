import * as fcl from "@onflow/fcl"
import "../config"

export const getLPFeePercentage = async () => {
  const info = await fcl.query({
      cadence: `
      import EmuSwap from 0xEmuSwap

      pub fun main(): UFix64 {
          return EmuSwap.getLPFeePercentage()
      }
      `,
      args: (arg) => []
  })

  return info;
}
