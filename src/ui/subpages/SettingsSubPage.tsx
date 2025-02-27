import { useEffect, useRef, useState } from "react";
import { SwitchComponent } from "../components/SwitchComponent";
import Settings from "../../lib/settings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function SettingsSubPage() {
    const navigate = useNavigate()
    const [version, setVersion] = useState("0.0.0")

    const [devMode, setDevMode] = useState(false)

    useEffect(() => {
        smule.getVersion().then(version => setVersion(version))

        let settings = Settings.get()
        setDevMode(settings.developerMode)
    }, [])

    useEffect(() => {
        let settings = Settings.get()
        
        settings.developerMode = devMode

        settings.save()
    }, [devMode])

    const userIdRef = useRef<HTMLInputElement>(null)
    const songIdRef = useRef<HTMLInputElement>(null)
    const perfIdRef = useRef<HTMLInputElement>(null)

    return (
        <div className="flex flex-col gap-4 w-full h-full rounded-2xl card">
            <section className="flex flex-col gap-2 p-4 items-start justify-center">
                <h1 className="text-2xl">General</h1>
                <hr className="w-full rounded-2xl"/>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <SwitchComponent checked={devMode} onCheckedChange={setDevMode}/>
                    <label>Developer Mode</label>
                </div>
            </section>
            <section className="flex flex-col gap-2 p-4 items-start justify-center">
                <h1 className="text-2xl">Playground</h1>
                <hr className="w-full rounded-2xl"/>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <input ref={userIdRef} placeholder="user id"/>
                    <Button onClick={() => {
                        navigate("/account/" + userIdRef.current!.value)
                    }} className="outlined">go</Button>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <input ref={songIdRef} placeholder="song id"/>
                    <Button onClick={() => {
                        navigate("/song/" + songIdRef.current!.value)
                    }} className="outlined">go</Button>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <input ref={perfIdRef} placeholder="performance id"/>
                    <Button onClick={() => {
                        navigate("/performance/" + perfIdRef.current!.value)
                    }} className="outlined">go</Button>
                </div>
                <Button onClick={() => {
                    Settings.get().reset().save()
                }} className="outlined">reset settings</Button>
                <p className="mt-4 text-center w-full">Running v{version}</p>
            </section>
        </div>
    )
}