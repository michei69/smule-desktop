import { Link, Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import { SmuleUtil, Util, ProfileResult, Smule } from "smule.js";
import { Crown, ExternalLink, Globe, MessageCircleMore, Mic, Mic2, Minus, Piano, Plus, Podcast, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import Settings from "@/lib/settings";

export default function Account() {
    const params = useParams() as unknown as {accountId: number}
    
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({} as ProfileResult)
    const [coverArt, setCoverArt] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [handle, setHandle] = useState("")
    const [followersCount, setFollowersCount] = useState("")
    const [followingCount, setFollowingCount] = useState("")
    const [bio, setBio] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [isSelf, setIsSelf] = useState(false)

    const [apps, setApps] = useState([] as string[])
    const [os, setOS] = useState([] as string[])

    useEffect(() => {
        let profile = Settings.getProfile()
        if (profile && profile.accountId == params.accountId) {
            setIsSelf(true)
        }
        smule.account.fetchOne(params.accountId).then((profile) => {
            setProfile(profile)
            if (profile.singProfile) {
                if (profile.singProfile.displayName) {
                    setDisplayName(profile.singProfile.displayName.trim())
                } else {
                    if (profile.profile.accountIcon.firstName && profile.profile.accountIcon.lastName) {
                        setDisplayName(profile.profile.accountIcon.firstName + " " + profile.profile.accountIcon.lastName)
                    } else {
                        setDisplayName(profile.profile.accountIcon.handle)
                    }    
                }
                if (profile.singProfile.coverUrl) {
                    setCoverArt(profile.singProfile.coverUrl)
                } else {
                    setCoverArt(profile.profile.accountIcon.picUrl)
                }
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
            setBio(profile.profile.accountIcon.blurb || "")

            if (Settings.get().developerMode) {
                console.log(profile)

                const apps = []
                const os = []
                for (let app of profile.profile.apps) {
                    // @ts-ignore SMULE_APP is a string
                    app = app.toUpperCase()
                    if (app == "AUTORAP_GOOG" || app == "AUTORAP_IOS")
                        if (!apps.includes("autorap"))
                            apps.push("autorap")
                    if (app == "MINIPIANO" || app == "MINIPIANO_ANDROID")
                        if (!apps.includes("minipiano"))
                            apps.push("minipiano")
                    if (app == "SING" || app == "SING_GOOGLE" || app == "SING_HUAWEI" || app == "SMULEDOTCOM") 
                        if (!apps.includes("sing"))
                            apps.push("sing")
                    if (app == "STUDIO_ANDROID" || app == "STUDIO_IOS")
                        if (!apps.includes("studio"))
                            apps.push("studio")
                    if (app.toLowerCase().includes("goog") || app.toLowerCase().includes("android"))
                        if (!os.includes("android"))
                            os.push("android")
                    if (app.toLowerCase().includes("ios") || app == "SING" || app == "MINIPIANO")
                        if (!os.includes("ios"))
                            os.push("ios")
                    if (app == "SING_HUAWEI")
                        if (!os.includes("huawei"))
                            os.push("huawei")
                    if (app == "SMULEDOTCOM") 
                        if (!os.includes("web"))
                            os.push("web")
                }
                apps.sort()
                os.sort()
                setApps(apps)
                setOS(os)
            }

            setLoading(false)
        })

        smule.social.isFollowingUser(params.accountId).then((res) => {
            setIsFollowing(res.following.includes(Number(params.accountId)))
        })
    }, [params])

    useEffect(() => {
        document.body.style.overflowY = "hidden"
        return () => {
            document.body.style.overflowY = "scroll"
        }
    }, [])

    return (
    <PaddedBody className="flex flex-row justify-start items-start h-full gap-4 overflow-y-hidden">
    {loading ? <LoadingTemplate/> :
    <>
        <div className="flex flex-col justify-center items-center left-side-account">
            <img src={coverArt} className="cover-art-account rounded-xl" />
            <img src={profilePic} className="w-16 rounded-full -mt-8" />
            <h1 className="font-bold text-xl mt-1">{displayName}</h1>
            <p className="flex flex-row gap-1">
            {Settings.get().developerMode ? (
            <>
            {apps.map((app, i) => {
                switch (app) {
                    case "autorap":
                        return <Mic className="w-4" key={i}/>
                    case "minipiano":
                        return <Piano className="w-4" key={i}/>
                    case "studio":
                        return <Podcast className="w-4" key={i}/>
                    case "sing":
                        return <Mic2 className="w-4" key={i}/>
                }
            })}
            </>
            ) : ""}    
            @{handle} {
                SmuleUtil.isVerified(profile.profile.accountIcon.verifiedType) ? <Verified className="w-4"/> : ""
            } {
                SmuleUtil.isVIP(profile.profile.accountIcon.subApps) ? <Crown className="w-4"/> : ""
            } {Settings.get().developerMode ? (
            <>
            {os.map((os, i) => {
                switch (os) {
                    case "android":
                        return <img src="/extra-icons/android.svg" className="h-6" key={i}/>
                    case "ios":
                        return <img src="/extra-icons/apple.svg" className="h-5" key={i}/>
                    case "huawei":
                        return <img src="/extra-icons/huawei.svg" className="h-5" key={i}/>
                    case "web":
                        return <Globe className="w-4" key={i}/>    
                }
            })}
            </>   
            ) : ""}
            </p>
            {profile.followerOfViewer ? (
                <p className="font-bold italic text-sm mt-1 accent-text brightness-125">(follows you)</p>
            ) : ""}
            <div className="flex flex-row justify-center items-center gap-1 mt-2 w-full">
                {isSelf ? "" :
                <>
                    <Button className="flex flex-row gap-1" onClick={async () => {
                        if (!isFollowing) {
                            await smule.social.followUser(params.accountId)
                        } else {
                            await smule.social.unfollowUser(params.accountId)
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
                </>
                }
                <Button className="flex flex-row gap-2" onClick={() => openExternalLink(profile.profile.webUrl)}>
                    <ExternalLink className="w-4"/>
                </Button>
            </div>
            <div className="flex flex-row gap-4 mt-2">
                <Link to={"/account/" + params.accountId + "/details"} className="flex flex-col brightness-125">
                    {followersCount}
                    <p className="text-white">Followers</p>
                </Link>
                <Link to={"/account/" + params.accountId + "/details"} className="flex flex-col brightness-125">
                    {followingCount}
                    <p className="text-white">Following</p>
                </Link>
            </div>
            <div className="flex flex-col justify-center items-center mt-4 text-wrap w-full">
                {bio.split("\n").map((line, idx) => <p key={idx} className="text-wrap w-full break-words">{line}</p>)}
            </div>
        </div>
        <div className="right-side-account flex flex-row justify-start items-start h-full gap-4">
            
            <Outlet/>
        </div>
    </>
    }
    </PaddedBody>
    )
}