import { Avatar, AvatarGroup } from "@mui/material";
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import useAppContext from "../../../../hooks/useAppContext"
import { FARMS, TOKENS } from "../../../../config";
import * as scripts from "../../../../flow/scripts"
import * as transactions from "../../../../flow/transactions"
import { getPoolID, getTotalStaked, getStakesInfoByAddress } from "../../../../flow/utils"
import * as fcl from "@onflow/fcl"

export default function DepositPage() {
    const router = useRouter()
    const [amount, setAmount] = useState(0)
    const [poolsMetaData, setPoolsMetaData] = useState([])
    const [poolID, setPoolID] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [stakesInfo, setStakesInfo] = useState(null)
    const pathSet = router.asPath.split('/')
    const { currentUser } = useAppContext()

    const handleAmount = (e) => {
        setAmount(e)
    }

    useEffect(() => {
        (async () => setPoolsMetaData(await scripts.getPoolsMetaData()))();
        setPoolID(getPoolID(poolsMetaData, pathSet[pathSet.length - 2], pathSet[pathSet.length - 1]));
        refresh();
    }, [])

    const refresh = async () => {
        setTotalStaked(getTotalStaked(await scripts.getFarmMetaData(poolID)))
        currentUser && setStakesInfo(getStakesInfoByAddress(await scripts.getStakesInfo(poolID), currentUser.addr))
    }

    const deposit = async  () => {
        await transactions.deposit(fcl.authz, amount)
        refresh()
    }
    const claimReward = async () => {
        await transactions.claimRewards(fcl.authz, poolID)
        refresh()
    }
    return (
        <main>
            <div className="deposit">
                <div className="deposit-box">
                    <div className="deposit-header">
                        <h2>
                            {FARMS[poolID].tokens.map((item, key) => (
                                <span key={key}>
                                    {TOKENS.find(x => x.tokenAddress === item.tokenAddress).tokenName}
                                    {key !== FARMS[poolID].tokens.length - 1 &&
                                        <>-</>
                                    }
                                </span>
                            ))}
                        </h2>
                        <div className="header-icons">
                            <AvatarGroup max={4}>
                                {FARMS[poolID].tokens.map((item, key) => (
                                    <Avatar alt="" src={TOKENS.find(x => x.tokenAddress === item.tokenAddress).icon} key={key} />
                                ))}
                            </AvatarGroup>
                        </div>
                    </div>
                    <div className="deposit-content">
                        <div className="reward-panel">
                            <div className="reward-item">
                                <h4>Total deposits</h4>
                                <p>{totalStaked}</p>
                            </div>
                            <div className="reward-item">
                                <h4>Pool rate</h4>
                                <p># FLOW / week</p>
                                <p># tUSDT / week</p>
                            </div>
                        </div>
                        <div className="user-info">
                            <h3>Your liquidity deposits</h3>
                            <h2>{stakesInfo?.balance}</h2>
                            <h3>Your unclaimed rewards</h3>
                            <h2>{stakesInfo?.pendingRewards}</h2>
                        </div>
                        <div className="deposit-input">
                            <label>Deposit amount</label>
                            <input
                                value={amount}
                                onChange={(e) => handleAmount(e.target.value)}
                            />
                        </div>
                        <button className="btn-farm-stake" onClick={deposit}>
                            Deposit
                        </button>
                        <button className="btn-farm-stake" onClick={claimReward}>
                            Claim Reward
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}