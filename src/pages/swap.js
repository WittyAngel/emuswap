import { NextSeo } from "next-seo"
import { useState, useEffect, useCallback } from "react"
import TokenInput from "../components/TokenInput"
import { TOKENS } from "../config"
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import useAppContext from "../hooks/useAppContext"
import * as scripts from "../flow/scripts"
import * as transactions from "../flow/transactions"
import { getPoolID } from "../flow/utils"
import * as fcl from "@onflow/fcl"

export default function SwapPage() {
    const [firstToken, setFirstToken] = useState(TOKENS[0])
    const [firstTokenBalance, setFirstTokenBalance] = useState(0)
    const [firstTokenAmount, setFirstTokenAmount] = useState(0)
    const [secondToken, setSecondToken] = useState(TOKENS[1])
    const [secondTokenBalance, setSecondTokenBalance] = useState(0)
    const [secondTokenAmount, setSecondTokenAmount] = useState(0)
    const [poolsMetaData, setPoolsMetaData] = useState([]);
    const [poolID, setPoolID] = useState(0)
    const { currentUser } = useAppContext()

    const handleReplace = () => {
        setFirstToken(secondToken)
        setSecondToken(firstToken)
    }

    const getTokensBalance = useCallback(async () => {
        currentUser && setFirstTokenBalance(await scripts.getTokenBalance(currentUser.addr, firstToken.tokenName))
        currentUser && setSecondTokenBalance(await scripts.getTokenBalance(currentUser.addr, secondToken.tokenName))
    }, []);

    const swap = async () => {
        await transactions.swap(fcl.authz, firstTokenAmount, firstToken.tokenName, secondToken.tokenName)
        setFirstTokenAmount(0)
        setSecondTokenAmount(0)
        getTokensBalance()
    }

    useEffect(() => {
        getTokensBalance();
        (async () => setPoolsMetaData(await scripts.getPoolsMetaData()))();
        setPoolID(getPoolID(poolsMetaData, firstToken.tokenAddress, secondToken.tokenAddress));
    }, [])

    useEffect(() => {
        setFirstTokenAmount(0);

        if (currentUser)
            (async () => setFirstTokenBalance(await scripts.getTokenBalance(currentUser.addr, firstToken.tokenName)))();

        setPoolID(getPoolID(poolsMetaData, firstToken.tokenAddress, secondToken.tokenAddress));
    }, [firstToken])

    useEffect(() => {
        setSecondTokenAmount(0);

        if (currentUser)
            (async () => setSecondTokenBalance(await scripts.getTokenBalance(currentUser.addr, secondToken.tokenName)))();

        setPoolID(getPoolID(poolsMetaData, firstToken.tokenAddress, secondToken.tokenAddress));
    }, [secondToken])

    return (
        <>
            <NextSeo
                title="emuswap | Flow token swap, pool, farm, stake"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                openGraph={{
                    url: 'https://emuswap.herokuapp.com/',
                    title: 'emuswap | Flow token swap, pool, farm, stake',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    images: [
                        {
                            url: 'https://emuswap.herokuapp.com/img/seo/flow-emuswap.png',
                            width: 335.44,
                            height: 100,
                            alt: 'Moduluc',
                            type: 'image/png',
                        }
                    ],
                    site_name: 'emuswap',
                }}
            />
            <main>
                <div className="swap-box">
                    <div className="swap-main">
                        <TokenInput
                            tokenImage={firstToken.icon}
                            title={firstToken.tokenName}
                            onChange={async (e) => {
                                setFirstToken(e)
                            }}
                            inputTitle="From"
                            onAmountChange={async (value) => {
                                setFirstTokenAmount(value)
                                setSecondTokenAmount(await scripts.getSwapExactAToB(poolID, value))
                            }}
                            amount={firstTokenAmount}
                            balance={firstTokenBalance}
                        />
                        <div className="display-center">
                            <button className="btn-replace" onClick={() => handleReplace()}>
                                <ArrowDownwardRoundedIcon />
                            </button>
                        </div>
                        <TokenInput
                            tokenImage={secondToken.icon}
                            title={secondToken.tokenName}
                            onChange={async (e) => {
                                setSecondToken(e)
                            }}
                            inputTitle="To"
                            onAmountChange={async (value) => {
                                setSecondTokenAmount(value)
                                setFirstTokenAmount(await scripts.getSwapAToExactB(poolID, value))
                            }}
                            amount={secondTokenAmount}
                            balance={secondTokenBalance} />
                    </div>
                    <button className="btn-add-amount" style={{ marginTop: 10 }} onClick={swap}>
                        Enter an amount
                    </button>
                </div>
            </main>
        </>
    )
}