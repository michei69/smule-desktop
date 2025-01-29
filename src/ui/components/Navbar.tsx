import { AccountIcon, ProfileResult, SmuleSession } from "@/api/smule-types";
import { useEffect, useState } from "react";
import LoadingTemplate from "./LoadingTemplate";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { SmuleUtil } from "@/api/util";

export default function Navbar() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({} as AccountIcon)
    const [empty, setEmpty] = useState(false)
    const navigate = useNavigate()

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
                smule.fetchSelf().then((res: ProfileResult) => {
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
                    <img className="rounded-2xl aspect-square max-w-8" src={profile.picUrl}/>
                    <p className="mr-auto">@{profile.handle} {profile.firstName || profile.lastName ? "-" : ""} {profile.firstName} {profile.lastName}</p>
                    <Button onClick={() => navigate("/")}>
                        <Home/>
                    </Button>
                </>
            )}
        </div>
    )
}