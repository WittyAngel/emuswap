import { config } from "@onflow/fcl";

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


// config({
//     "accessNode.api": "http://127.0.0.1:3569", // Mainnet: "https://access-mainnet-beta.onflow.org"
//     "discovery.wallet": "http://localhost:8701/fcl/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
//     "0xFlowToken": "0x0ae53cb6e3f42a79",
//     "0xFungibleToken": "0xee82856bf20e2aa6"
// })