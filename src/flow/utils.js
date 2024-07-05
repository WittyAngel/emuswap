export const toStr = (amount) => {
    if (Number.isInteger(parseFloat(amount))) {
        amount = parseInt(amount).toString() + '.0'
    }
    return amount
}
export const getPoolID = (poolsMeta, token1Address, token2Address) => {
    console.log('getPoolID', poolsMeta)
    return 0
}
export const getTotalStaked = (farmMeta) => {
    console.log('getTotalStaked', farmMeta)
    return eval(farmMeta.totalStaked)
}
export const getStakesInfoByAddress = (stakesInfo, address) => {
    console.log('getStakesInfoByAddress', stakesInfo, address)
    let pendingRewards = 0.0
    stakesInfo[address]?.pendingRewards && Object.keys(stakesInfo[address]?.pendingRewards).map(key => pendingRewards += 
        eval(stakesInfo[address]?.pendingRewards[key]))
    return {
        balance: eval(stakesInfo[address]?.balance),
        pendingRewards: pendingRewards
    }
}