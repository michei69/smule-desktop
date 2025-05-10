import { AccountIcon, ProfileResult, SmuleSession } from "@/api/smule-types";
import { useEffect, useState } from "react";
import LoadingTemplate from "./LoadingTemplate";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, LogOut } from "lucide-react";
import { SmuleUtil } from "@/api/util";
import SearchBar from "./SearchBar";
import Settings from "@/lib/settings";

export default function Navbar({ params = null }: { params?: any }) {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({} as AccountIcon)
    const [empty, setEmpty] = useState(false)
    const navigate = useNavigate()
    const backButtonEnabled = window.history?.state.idx > 0 || window.history?.length > 0
    const fwdButtonEnabled = window.history?.state.idx < window.history?.length - 1

    useEffect(() => {
        storage.get<SmuleSession>("session").then((session) => {
            if (!session || !SmuleUtil.checkLoggedIn(session)) {
                setEmpty(true)
                setLoading(false)
            }
            if (session.isGuest) {
                setProfile({
                    firstName: "Guest",
                    lastName: "User",
                    handle: "guest"
                } as AccountIcon)
                setLoading(false)
            } else {
                if (Settings.getProfile()) {
                    let profile = Settings.getProfile()
                    setProfile(profile)
                    setLoading(false)
                    return
                }
                smule.account.fetchSelf().then((res: ProfileResult) => {
                    setProfile(res.profile.accountIcon)
                    setLoading(false)
                })
            }
        })
    }, [])

    return (
        <div className="sticky top-0 z-50 flex flex-row gap-2 w-full items-center navbar backdrop-blur-sm p-2 h-12">
            {loading ? <LoadingTemplate/> : (
                empty ? "" :
                <>
                    <button onClick={() => {
                        extra.logout()
                        navigate("/")
                    }}>
                        <LogOut/>
                    </button>
                    <img className="rounded-2xl aspect-square max-w-8" src={profile.picUrl}/>
                    <p className="mr-auto cursor-pointer" onClick={() => navigate("/account/" + profile.accountId)}>@{profile.handle} {profile.firstName || profile.lastName ? "-" : ""} {profile.firstName} {profile.lastName}</p>
                    <Button onClick={() => {
                        if (!backButtonEnabled) return
                        navigate(-1)
                    }} disabled={!backButtonEnabled}>
                        <ArrowLeft/>
                    </Button>
                    <Button onClick={() => {
                        navigate("/")
                    }}>
                        <Home/>
                    </Button>
                    <Button onClick={() => {
                        if (!fwdButtonEnabled) return
                        navigate(1)
                    }} disabled={!fwdButtonEnabled}>
                        <ArrowRight/>
                    </Button>
                    <SearchBar params={params}/>
                </>
            )}
        </div>
    )
}