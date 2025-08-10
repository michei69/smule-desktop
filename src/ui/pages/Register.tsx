// import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PaddedBody from "../components/PaddedBody"
import Navbar from "../components/Navbar"
import SettingsInst from "../../lib/settings"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    return (
        <PaddedBody className="flex flex-col gap-2 mr-auto ml-auto max-w-128">
            <h1 className="text-2xl">Register</h1>
            <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button disabled={loading} onClick={async() => {
                setLoading(true)
                let res = await smule.account.createWithEmail(email, password)
                if (res) {
                    // cache for the navbar
                    let selfProfile = await smule.account.fetchSelf()
                    SettingsInst.setProfile(selfProfile.profile.accountIcon)
                    extra.saveSession()
                    navigate("/")
                }
                else alert("Register failed")
                setLoading(false)
            }}>
                {loading ? 
                <>
                    <Loader2 className="animate-spin"/>
                    Registering...
                </>: "Register"}
            </Button>
            <button onClick={() => navigate("/login")}>Use an already existing account</button>
        </PaddedBody>
    )
}