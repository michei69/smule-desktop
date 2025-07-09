import { AccountIcon, ProfileResult } from "smule.js"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import SmallUser from "../components/SmallUser"
import Settings from "@/lib/settings"

export default function FollowersFollowingSubPage() {
    const params = useParams() as unknown as {accountId: number}

    const [loading, setLoading] = useState(true)
    const [followers, setFollowers] = useState([] as AccountIcon[])
    const [followings, setFollowings] = useState([] as AccountIcon[])
    const [isFollowingData, setIsFollowingData] = useState([] as number[])

    useEffect(() => {
        setLoading(true)
        let followees: {[key: number]: AccountIcon} = {}
        let followers: {[key: number]: AccountIcon} = {}
        let ids: number[] = []
        smule.social.fetchFollowings(params.accountId).then((data) => {
            // creating apps for the apps stuff for dev stuff
            followees = {}
            for (let flw of data.followees) followees[flw.accountId] = flw
            for (let flw of data.accountApps) followees[flw.accountId] = {...followees[flw.accountId], apps: flw.apps} as any
            setFollowings(Object.values(followees))
            if (Settings.get().developerMode) console.log(data)
        }).then(() => smule.social.fetchFollowers(params.accountId).then((data) => {
            // creating apps for the apps stuff for dev stuff
            followers = {}
            for (let flw of data.followers) followers[flw.accountId] = flw
            for (let flw of data.accountApps) followers[flw.accountId] = {...followers[flw.accountId], apps: flw.apps} as any
            setFollowers(Object.values(followers))
            if (Settings.get().developerMode) console.log(data)
        })).then(() => {
            ids = Object.keys(followers).map((id) => parseInt(id)).concat(Object.keys(followees).map((id) => parseInt(id)))
        }).then(() => smule.social.isFollowingUsers(ids)).then((data) => {
            setIsFollowingData(data.following)
            setLoading(false)
        })
    }, [params])
    
    return (
    <>
    {loading ? <LoadingTemplate/> : <>
    <div className="flex flex-col h-full gap-4 text-left" style={{minWidth: "35vw", overflow: "scroll", height: "90vh"}}>
        <h1 className="font-bold">Followers</h1>
        {followers.map((follower, idx) => {
            return <SmallUser user={follower} following={isFollowingData.includes(follower.accountId)} key={idx}/>
        })}
    </div>
    <div className="flex flex-col h-full gap-4 text-left" style={{minWidth: "35vw", overflow: "scroll", height: "90vh"}}>
        <h1 className="font-bold">Following</h1>
        
        {followings.map((followee, idx) => {
            return <SmallUser user={followee} following={isFollowingData.includes(followee.accountId)} key={idx}/>
        })}
    </div>
    </>}
    </>
    )
}