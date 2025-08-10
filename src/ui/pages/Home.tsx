import { Outlet, useLocation, useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import { Button } from "@/components/ui/button"

export default function Home() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <PaddedBody className="flex flex-col gap-4 max-w-7xl">
            <div className="flex flex-row justify-center items-center gap-8">
                <Button onClick={() => navigate("/")} className={`${location.pathname == "/" ? "selected" : ""}`}>Songbook</Button>
                <Button onClick={() => navigate("/explore")} className={`${location.pathname == "/explore" ? "selected" : ""}`}>Explore</Button>
                <Button onClick={() => navigate("/settings")} className={`${location.pathname == "/settings" ? "selected" : ""}`}>Settings</Button>
                <Button onClick={() => navigate("/chat")} className={`${location.pathname == "/chat" ? "selected" : ""}`}>Chat</Button>
                <Button onClick={() => navigate("/arr")} className={`${location.pathname == "/arr" ? "selected" : ""}`}>Arrangements</Button>
                {/* <Button onClick={() => navigate("/live")} className={`${location.pathname == "/live" ? "selected" : ""}`}>live</Button> */}
            </div>
            <Outlet/>
        </PaddedBody>
    )
}