import { Button } from "@/components/ui/button";
import Settings from "@/lib/settings";
import { Crown, Globe, Mic, Mic2, Minus, Piano, Plus, Podcast, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AccountIcon, SmuleUtil } from "smule.js";

export default function SmallUser({ user, following = false }: { user: AccountIcon, following?: boolean }) {
    // is there any problem if i use navigate on a p instead of a Link?
    // prolly not, but im too lazy to style for now
    const navigate = useNavigate()
    const [apps, setApps] = useState([] as string[])
    const [os, setOS] = useState([] as string[])
    const [updatedFlw, setUpdatedFlw] = useState(following)
    const [canFlw, setCanFlw] = useState(true)
    
    useEffect(() => {
        let profile: AccountIcon = Settings.getProfile()
        if (profile && profile.accountId == user.accountId) {
            setCanFlw(false)
        }
        if (Settings.get().developerMode && (user as any).apps && (user as any).apps.length > 0) {
            const apps = []
            const os = []
            for (let app of (user as any).apps) {
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
    }, [user])

    return (
    <div className="flex flex-row items-center justify-start gap-4 cursor-pointer card rounded-2xl cute-border">
        <img loading="lazy" src={user.picUrl} className="rounded-full w-16" onClick={() => navigate(`/account/${user.accountId}`)}/>
        <div className="flex flex-col justify-start items-start gap-1" onClick={() => navigate(`/account/${user.accountId}`)}>
            <h1 className="font-bold text-lg flex flex-row gap-1 items-center">
                {user.firstName && user.lastName ? <>
                    {user.firstName} {user.lastName}
                    <span className="font-light"> ({user.handle})</span>
                </> : (
                    <>{user.handle}</>
                )}
                {SmuleUtil.isVerified(user.verifiedType) ? (
                    <Verified className="w-4 mt-0.5" style={{
                        color: user.verifiedType == "PARTNER_ARTIST" ? "yellow" : user.verifiedType == "STAFF" ? "purple" : "white"
                    }}/>
                ) : ""} {
                    SmuleUtil.isVIP(user.subApps) ? <Crown className="w-4"/> : ""
                }
                {Settings.get().developerMode ? (
                <>
                <div className="w-1" />
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
                <div className="w-1" />
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
            </h1>
            {user.blurb ? (
                <p className="text-ellipsis text-nowrap overflow-hidden w-90 font-normal">{user.blurb!.split("\\n")[0]!.trim()}</p>
            ) : ""}
        </div>
        {canFlw ? 
        <Button className="ml-auto float-right h-12 w-12 aspect-square" onClick={() => {
            if (updatedFlw) {
                smule.social.unfollowUser(user.accountId)
                setUpdatedFlw(false)
            } else {
                smule.social.followUser(user.accountId)
                setUpdatedFlw(true)
            }
        }}>
            {updatedFlw ? 
                <Minus className="aspect-square" style={{width:"32px", height:"32px"}}/> 
            : 
                <Plus className="aspect-square" style={{width:"32px", height:"32px"}}/>
            }
        </Button> : ""}
    </div>
    )
}