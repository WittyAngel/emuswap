import { NextSeo } from "next-seo"
import FarmItem from "../../components/FarmItem"
import { FARMS } from "../../config"
import * as scripts from "../../flow/scripts"
import { getTotalStaked } from "../../flow/utils"
import { useState, useEffect } from "react"

export default function FarmPage() {
    const [farmsData, setFarmsData] = useState([])

    useEffect(() => {
        initializeFarmsData()
    }, [])

    const initializeFarmsData = async () => {
        let data = []
        for (let key = 0; key < FARMS.length; key++) {
            data.push({
                tokens: FARMS[key].tokens,
                APY: FARMS[key].APY,
                rewardTokens: FARMS[key].rewardTokens,
                totalStaked: getTotalStaked(await scripts.getFarmMetaData(key)),
                rewardsPerWeek: getTotalStaked(await scripts.getFarmMetaData(key)) * 0.23016,
            })
        }
        console.log('initializeFarmsData', data)
        setFarmsData(data)
    }

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
                <div className="container">
                    <div className="farm-content">
                        {farmsData?.map((item, key) => (
                            <FarmItem
                                key={key}
                                tokens={item.tokens}
                                totalStaked={item.totalStaked}
                                rewardTokens={item.rewardTokens}
                                rewardsPerWeek={item.rewardsPerWeek}
                                APY={item.APY} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}