import Image from "next/image"
import { NextSeo } from "next-seo"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import { TOKENS } from "../config"
import * as scripts from "../flow/scripts"

export default function PoolPage() {
    const router = useRouter();
    const [poolsMetaData, setPoolsMetaData] = useState([])
    const [lpFeePercentage, setLPFeePercentage] = useState(0)

    useEffect(() => {
        (async () => setLPFeePercentage(await scripts.getLPFeePercentage()))();
        (async () => setPoolsMetaData(await scripts.getPoolsMetaData()))();
    }, [])

    useEffect(() => {
        console.log(poolsMetaData);
    }, [poolsMetaData])


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
                <div className="page-box">
                    <div className="pool-title">
                        <h2>Your liquidity</h2>
                        <button className="btn-add" onClick={() => router.push("/add")}>
                            <AddRoundedIcon />
                            <span>Add</span>
                        </button>
                    </div>
                    {poolsMetaData.length === 0 && <div className="pool-alert-box">
                        <h3>No liquidity found</h3>
                        <p>&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>}
                    <div className="table-container">
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Pair</th>
                                    <th>Fee</th>
                                    <th>TVL</th>
                                    <th>Pool</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poolsMetaData.map((item, key) => (
                                    <tr key={key}>
                                        <td align="center">{key+1}</td>
                                        <td align="center">
                                            <div className="pair-item">
                                                <div className="pair-token-icon">
                                                    <Image
                                                        src={TOKENS[item.token1Index].icon}
                                                        width={28}
                                                        height={28}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="pair-token-icon">
                                                    <Image
                                                        src={TOKENS[item.token2Index].icon}
                                                        width={28}
                                                        height={28}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="pair-token-names">
                                                    {TOKENS[item.token1Index].tokenName}
                                                    -
                                                    {TOKENS[item.token2Index].tokenName}
                                                </div>
                                            </div>
                                        </td>
                                        <td align="center">
                                            {parseFloat(lpFeePercentage).toFixed(4)} %
                                        </td>
                                        <td align="center">
                                            <span>{parseFloat(item.token1Amount).toFixed(2)}/{parseFloat(item.token2Amount).toFixed(2)}</span>
                                        </td>
                                        <td align="center">
                                            1
                                        </td>
                                    </tr>
                                ))}                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}