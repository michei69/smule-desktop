import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import { PerformanceIcon, PerformancesFillStatus, PerformanceSortMethod, ProfileResult } from "@/api/smule-types";
import { SmuleUtil, Util } from "@/api/util";
import { Loader2, MessageCircleMore, Minus, Plus, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import PerformanceComponent from "../components/Performance";

export default function Account() {
    const params = useParams() as unknown as {accountId: number}
    
    const [loading, setLoading] = useState(true)
    const [loadingPerformances, setLoadingPerformances] = useState(true)

    const [hasSingProfile, setHasSingProfile] = useState(true)
    const [profile, setProfile] = useState({} as ProfileResult)
    const [coverArt, setCoverArt] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [handle, setHandle] = useState("")
    const [followersCount, setFollowersCount] = useState("")
    const [followingCount, setFollowingCount] = useState("")
    const [bio, setBio] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    
    const [loadingPerformancesManually, setLoadingPerformancesManually] = useState(false)
    const [recOffset, setRecOffset] = useState(0)
    const [hasMoreRecs, setHasMoreRecs] = useState(true)
    const [recs, setRecs] = useState([] as PerformanceIcon[])

    const [performanceOffset, setPerformanceOffset] = useState(0)
    const [hasMorePerformances, setHasMorePerformances] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])

    useEffect(() => {
        smule.fetchAccount(params.accountId).then((profile) => {
            setProfile(profile)
            setHasSingProfile(!!profile.singProfile)
            if (profile.singProfile) {
                setDisplayName(profile.singProfile.displayName.trim())
                setCoverArt(profile.singProfile.coverUrl)
            } else {
                if (profile.profile.accountIcon.firstName && profile.profile.accountIcon.lastName) {
                    setDisplayName(profile.profile.accountIcon.firstName + " " + profile.profile.accountIcon.lastName)
                } else {
                    setDisplayName(profile.profile.accountIcon.handle)
                }
                setCoverArt(profile.profile.accountIcon.picUrl)
            }
            setProfilePic(profile.profile.accountIcon.picUrl)
            setHandle(profile.profile.accountIcon.handle)

            setFollowersCount(Util.formatValue(profile.profile.social.numFollowers))
            setFollowingCount(Util.formatValue(profile.profile.social.numFollowees))
            setBio(profile.profile.accountIcon.blurb)

            setLoading(false)
        })

        smule.fetchPerformancesFromAccount(params.accountId).then((performances) => {
            setRecs(performances.participationIcons.map(performance => performance.performanceIcon))

            setHasMoreRecs(performances.next != -1)
            setLoadingPerformances(false)
        })
        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.ACTIVESEED, PerformanceSortMethod.NEWEST_FIRST, 20, 0).then((perf) => {
            setPerformances(perf.participationIcons.map(performance => performance.performanceIcon))

            setHasMorePerformances(perf.next != -1)
            setLoadingPerformancesManually(false)
        })

        smule.isFollowing(params.accountId).then((res) => {
            setIsFollowing(res.following.includes(Number(params.accountId)))
        })
    }, [params])

    useEffect(() => {
        if (recOffset == 0) return
        setLoadingPerformancesManually(true)

        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.FILLED, PerformanceSortMethod.NEWEST_FIRST, 20, recOffset).then((perf) => {
            setRecs(recs.concat(
                perf.participationIcons.map(performance => performance.performanceIcon)
            ))

            setHasMoreRecs(perf.next != -1)
            setLoadingPerformancesManually(false)
        })
    }, [recOffset])

    useEffect(() => {
        if (performanceOffset == 0) return
        setLoadingPerformancesManually(true)

        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.ACTIVESEED, PerformanceSortMethod.NEWEST_FIRST, 20, performanceOffset).then((perf) => {
            setPerformances(performances.concat(
                perf.participationIcons.map(performance => performance.performanceIcon)
            ))

            setHasMorePerformances(perf.next != -1)
            setLoadingPerformancesManually(false)
        })
    }, [performanceOffset])

    return (
    <>
        <Navbar/>
        <PaddedBody className="flex flex-row justify-start items-start h-full gap-4">
        {loading ? <LoadingTemplate/> :
        <>
            <div className="flex flex-col justify-center items-center left-side-account">
                <img src={coverArt} className="cover-art-account" />
                <img src={profilePic} className="w-16 rounded-full -mt-8" />
                <h1 className="font-bold text-xl mt-1">{displayName}</h1>
                <p className="flex flex-row gap-1">@{handle} {
                    SmuleUtil.isVerified(profile.profile.accountIcon.verifiedType) ? <Verified className="w-4"/> : ""
                }</p>
                <div className="flex flex-row justify-center items-center gap-1 mt-2 w-full">
                    <Button className="flex flex-row gap-1" onClick={async () => {
                        if (!isFollowing) {
                            await smule.follow(params.accountId)
                        } else {
                            await smule.unfollow(params.accountId)
                        }
                        setIsFollowing(!isFollowing)
                    }}>
                    {isFollowing ? <>
                        <Minus className="w-4"/>
                        Unfollow
                    </> : <>
                        <Plus className="w-4"/>
                        Follow
                    </>}
                    </Button>
                    <Button className="flex flex-row gap-2">
                        <MessageCircleMore className="w-4"/>
                    </Button>
                </div>
                <div className="flex flex-row gap-4 mt-2">
                    <Link to={"/account/followers/"} className="flex flex-col">
                        {followersCount}
                        <p className="text-white">Followers</p>
                    </Link>
                    <Link to={"/account/following/"} className="flex flex-col">
                        {followingCount}
                        <p className="text-white">Following</p>
                    </Link>
                </div>
                <div className="flex flex-col justify-center items-center mt-4">
                    {bio.split("\n").map((line, idx) => <p key={idx}>{line}</p>)}
                </div>
            </div>
            <div className="right-side-account flex flex-row justify-start items-start h-full gap-4">
                {
                hasSingProfile ?
                <div className="flex flex-col justify-center items-center h-full gap-4 min-w-fit" style={{width: "45%"}}>
                    <h1 className="font-bold">Pinned recordings</h1>
                    <div className="flex flex-col gap-4">
                        {profile.singProfile.pinPerformanceIcons.map((performance, idx) => {
                            return (
                                <PerformanceComponent performance={performance} key={idx}/>
                            )
                        })}
                    </div>
                </div>
                : ""
                }
                <div className="flex flex-col h-full gap-4 min-w-fit" style={{width: "45%", overflow: "scroll", height: "90vh"}}>
                    <h1 className="font-bold">Recordings</h1>
                    <div className="flex flex-col gap-4">
                    {loadingPerformances ? <LoadingTemplate/> : <>
                        {recs.map((performance, idx) => {
                            return (
                                <PerformanceComponent performance={performance} key={idx}/>
                            )
                        })}
                    </>}
                    {
                        hasMoreRecs ?
                        <Button onClick={() => {
                            setRecOffset(recs.length)
                        }} disabled={loadingPerformancesManually}>
                            {loadingPerformancesManually ? <Loader2 className="animate-spin"/> : ""}
                            Load more
                        </Button>
                        : "No more"
                    }
                    </div>
                </div>
                <div className="flex flex-col h-full gap-4 min-w-fit" style={{width: "45%", overflow: "scroll", height: "90vh"}}>
                    <h1 className="font-bold">Performances</h1>
                    <div className="flex flex-col gap-4">
                    {loadingPerformances ? <LoadingTemplate/> : <>
                        {performances.map((performance, idx) => {
                            return (
                                <PerformanceComponent performance={performance} key={idx}/>
                            )
                        })}
                    </>}
                    {
                        hasMorePerformances ?
                        <Button onClick={() => {
                            setPerformanceOffset(performances.length)
                        }} disabled={loadingPerformancesManually}>
                            {loadingPerformancesManually ? <Loader2 className="animate-spin"/> : ""}
                            Load more
                        </Button>
                        : "No more"
                    }
                    </div>
                </div>
            </div>
        </>
        }
        </PaddedBody>
    </>
    )
}