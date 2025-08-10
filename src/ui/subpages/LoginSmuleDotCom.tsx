import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"

// TODO: Keep the cookies saved. We can do this by adding a 
// TODO: callback into the generated ipc which automatically
// TODO: saves it for us
// TODO: ...but im lazy

export default function LoginSmuleDotComSubPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setLoading(true)
        smuleDotCom.resetCookies()
        smuleDotCom.fetchXsrfToken()
        setLoading(false)
    }, [])

    const login = useCallback(async () => {
        setLoading(true)
        await smuleDotCom.fetchXsrfToken()
        await smuleDotCom.checkEmailExists(email)
        let res = await smuleDotCom.login(email, password)
        console.log(res)
        if (res) {
            navigate("/create-arr/upload", {
                state: location.state
            })
        }
        else alert("login failed")
        setLoading(false)
    }, [email, password])

    return (
        <div className="flex flex-col gap-4 w-128 mr-auto ml-auto">
            <h1 className="text-2xl mt-2 -mb-2">Login to smule.com</h1>
            <p className="text-sm italic">This is required, because you must access the website in order to upload or edit arrangements. Note: These are the same credentials as for the smule app.</p>
            <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
            <Button disabled={loading} onClick={login}>
                {loading ? 
                <>
                    <Loader2 className="animate-spin"/>
                    Logging in...
                </>: "Log in"}
            </Button>
        </div>
    )
}