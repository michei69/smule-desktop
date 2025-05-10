// import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Loader2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PaddedBody from "../components/PaddedBody"
import Navbar from "../components/Navbar"
import SettingsInst from "../../lib/settings"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingGuest, setLoadingGuest] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-col gap-2 mr-auto ml-auto max-w-128">
                <h1 className="text-2xl">Login</h1>
                <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button disabled={loading || loadingGuest} onClick={async() => {
                    setLoading(true)
                    let res = await smule.account.login(email, password)
                    if (res) {
                        // cache for the navbar
                        let selfProfile = await smule.account.fetchSelf()
                        SettingsInst.setProfile(selfProfile.profile.accountIcon)
                        navigate("/")
                    }
                    else alert("login failed")
                    setLoading(false)
                }}>
                    {loading ? 
                    <>
                        <Loader2 className="animate-spin"/>
                        Logging in...
                    </>: "Log in"}
                </Button>
                <button disabled={loading || loadingGuest} onClick={async() => {
                    setLoadingGuest(true)
                    let res = await smule.account.loginAsGuest()
                    if (res) navigate("/")
                    else alert("login failed")
                    SettingsInst.setProfile(null)
                    setLoadingGuest(false)
                }}>
                    {loadingGuest ? 
                    <>
                        <Loader2 className="animate-spin"/>
                        Logging in as guest...
                    </>: "Log in as a guest"}
                </button>
            </PaddedBody>
        </>
    )
}