import { config } from "@onflow/fcl";

/** config for testnet */
config({
    "accessNode.api": "https://access-testnet.onflow.org", // Mainnet: "https://access-mainnet-beta.onflow.org"
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "0xFlowToken": "0x7e60df042a9c0868",
    "0xFungibleToken": "0x9a0766d93b6608b7",
    "0xNonFungibleToken": "0x631e88ae7f1d7c20",
    "0xFungibleTokens": "0xfe21039774bddbbd",
    "0xMetadataViews": "0x631e88ae7f1d7c20",
    "0xEmuToken": "0xfe21039774bddbbd",
    "0xFUSD": "0xe223d8a629e49c68",
    "0xEmuSwap": "0xfe21039774bddbbd",
    "0xStakingRewards": "0xfe21039774bddbbd",
    "0xxEmuToken": "0xfe21039774bddbbd",
})

/** config for emulator */
// config({
//     "accessNode.api": "http://localhost:8080",
//     "discovery.wallet": "http://localhost:8701/fcl/authn",
//     "challenge.handshake": "http://localhost:8701/fcl/authn",
//     "0xFlowToken": "0x0ae53cb6e3f42a79",
//     "0xFungibleToken": "0xee82856bf20e2aa6",
//     "0xNonFungibleToken": "0xf8d6e0586b0a20c7",
//     "0xFungibleTokens": "0xf8d6e0586b0a20c7",
//     "0xMetadataViews": "0xf8d6e0586b0a20c7",
//     "0xEmuToken": "0x01cf0e2f2f715450",
//     "0xFUSD": "0xf8d6e0586b0a20c7",
//     "0xEmuSwap": "0x01cf0e2f2f715450",
//     "0xStakingRewards": "0x01cf0e2f2f715450",
//     "0xxEmuToken": "0x01cf0e2f2f715450",
// })