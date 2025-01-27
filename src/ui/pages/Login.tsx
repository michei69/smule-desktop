import { useState } from "react"
import { useNavigate } from "react-router"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-2">
            <h1>login</h1>
            <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={async() => {
                let res = await smule.login(email, password)
                if (res) navigate("/")
                else alert("login failed")
            }}>login</button>
        </div>
    )
}