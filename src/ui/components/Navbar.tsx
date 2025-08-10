import { AccountIcon, SmuleSession, SmuleUtil } from "smule.js";
import { useEffect, useState } from "react";
import LoadingTemplate from "./LoadingTemplate";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import Settings from "@/lib/settings";
import useLocalStorageAccount from "@/lib/accountPolling";

export default function Navbar({ params = null }: { params?: any }) {
    const [loading, setLoading] = useState(true)
    const [empty, setEmpty] = useState(false)
    
    const profile = useLocalStorageAccount()
    const location = useLocation()
    const navigate = useNavigate()
    
    var [backButtonEnabled, setBackButtonEnabled] = useState(false)
    var [fwdButtonEnabled, setFwdButtonEnabled] = useState(false)
    useEffect(() => {
        setBackButtonEnabled(window.history?.state.idx > 0 || window.history?.length > 0)
        setFwdButtonEnabled(window.history?.state.idx < window.history?.length - 1)

        storage.get<SmuleSession>("session").then((session) => {
            if (!session || !SmuleUtil.checkLoggedIn(session)) {
                Settings.setProfile(null)
                setEmpty(true)
                setLoading(false)
            }
            if (session.isGuest) {
                Settings.setProfile({
                    firstName: "Guest",
                    lastName: "User",
                    handle: "guest"
                } as AccountIcon)
                setLoading(false)
            } else {
                smule.account.fetchSelf().then((res) => {
                    Settings.setProfile(res.profile.accountIcon)
                    setLoading(false)
                })
            }
        })
    }, [location])

    return (
        <div className="sticky top-0 z-50 flex flex-row gap-2 w-full items-center navbar backdrop-blur-sm p-2 h-12">
            {loading ? <LoadingTemplate/> : (
                empty ? "" :
                <>
                    <button onClick={() => {
                        extra.logout()
                        Settings.setProfile(null)
                        navigate("/login")
                    }}>
                        <LogOut/>
                    </button>
                    <div className="flex flex-row gap-1 items-center cursor-pointer mr-auto" onClick={() => navigate("/account/" + profile.accountId)}>
                        <img className="rounded-2xl aspect-square max-w-8" src={profile.picUrl}/>
                        <p>@{profile.handle} {profile.firstName || profile.lastName ? "-" : ""} {profile.firstName} {profile.lastName}</p>
                    </div>
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