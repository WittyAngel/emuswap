import * as fcl from "@onflow/fcl"
import { TOKENS } from "../../config"

export const getPoolsMetaData = async () => {
  const info = await fcl.query({
      cadence: `
      import EmuSwap from 0xEmuSwap
       
      pub fun main():[EmuSwap.PoolMeta] {
        let meta: [EmuSwap.PoolMeta] = []
        for ID in EmuSwap.getPoolIDs() {
            let poolRef = EmuSwap.borrowPool(id: ID)
            meta.append(
                poolRef!.getPoolMeta()
            )
        }
        return meta
    }
    `,
  })

  info.map(item => {
    item.token1Index = 0;
    item.token2Index = 1;
    TOKENS.map((token, index) => {
      if(token.tokenAddress === '0x'+ item.token1Identifier.split(".")[1]){
        item.token1Index = index;
      } else if (token.tokenAddress === '0x' + item.token2Identifier.split(".")[1]) {
        item.token2Index = index;
      }
    })
  })

  return info;
}
