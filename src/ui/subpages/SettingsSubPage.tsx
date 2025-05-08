import { useEffect, useRef, useState } from "react";
import { SwitchComponent } from "../components/SwitchComponent";
import Settings from "../../lib/settings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import ToggleEntry from "../components/settings/ToggleEntry";
import SettingsSection from "../components/settings/SettingsSection";
import LoadingTemplate from "../components/LoadingTemplate";
import MiniUser from "../components/MiniUser";
import { AccountIcon, ArrExtended, PerformanceIcon } from "@/api/smule-types";
import SmallUser from "../components/SmallUser";
import PerformanceComponent from "../components/Performance";
import ArrComponent from "../components/Arr";

export default function SettingsSubPage() {
    const navigate = useNavigate()
    const [version, setVersion] = useState("0.0.0")

    const [devMode, setDevMode] = useState(false)
    const [markSongPlay, setMarkSongPlay] = useState(false)
    const [markPerformancePlay, setMarkPerformancePlay] = useState(false)
    const [markPerformanceListen, setMarkPerformanceListen] = useState(false)
    const [shouldShowSyllableLyricProgress, setShouldShowSyllableLyricProgress] = useState(false)
    const [loadTestStuff, setLoadTestStuff] = useState(false)

    useEffect(() => {
        extra.getVersion().then(version => setVersion(version))

        let settings = Settings.get()
        setDevMode(settings.developerMode)
        setMarkSongPlay(settings.markSongPlay)
        setMarkPerformancePlay(settings.markPerformancePlay)
        setMarkPerformanceListen(settings.markPerformanceListen)
        setShouldShowSyllableLyricProgress(settings.showSyllableLyricProgress)
    }, [])

    useEffect(() => {
        let settings = Settings.get()
        
        settings.developerMode = devMode
        settings.markSongPlay = markSongPlay
        settings.markPerformancePlay = markPerformancePlay
        settings.markPerformanceListen = markPerformanceListen
        settings.showSyllableLyricProgress = shouldShowSyllableLyricProgress

        settings.save()
    }, [devMode, markSongPlay, markPerformancePlay, markPerformanceListen, shouldShowSyllableLyricProgress])

    const userIdRef = useRef<HTMLInputElement>(null)
    const songIdRef = useRef<HTMLInputElement>(null)
    const perfIdRef = useRef<HTMLInputElement>(null)

    const [temp, setTemp] = useState(false)
    const [tempAccount, setTempAccount] = useState(null as AccountIcon)
    const [tempPerformance, setTempPerformance] = useState(null as PerformanceIcon)
    useEffect(() => {
        if (!loadTestStuff) return
        smule.account.fetchOne(230727169).then((data) => setTempAccount({...data.profile.accountIcon, subApps:["SING_GOOGLE", "AUTORAP_IOS", "SMULEDOTCOM", "MINIPIANO", "STUDIO_ANDROID"]}))
        smule.performances.fetchOne("2188495088_4590245360").then((data) => setTempPerformance(data.performance))
    }, [loadTestStuff])

    return (
        <div className="flex flex-col gap-4 w-full h-full rounded-2xl card">
            <SettingsSection text="General">
                <ToggleEntry checked={devMode} onCheckedChange={setDevMode}>Developer Mode</ToggleEntry>
                <ToggleEntry checked={markSongPlay} onCheckedChange={setMarkSongPlay}>Mark Songs As Played (recommendation algorithm)</ToggleEntry>
                <ToggleEntry checked={markPerformanceListen} onCheckedChange={setMarkPerformanceListen}>Mark Performances As Listened (recommendation algorithm)</ToggleEntry>
                <ToggleEntry checked={markPerformancePlay} onCheckedChange={setMarkPerformancePlay}>Mark Performances As Played (recommendation algorithm)</ToggleEntry>
                <ToggleEntry checked={shouldShowSyllableLyricProgress} onCheckedChange={setShouldShowSyllableLyricProgress}>Show Syllable Lyric Progress Inside Lyrics View (experimental)</ToggleEntry>
                <ToggleEntry checked={loadTestStuff} onCheckedChange={setLoadTestStuff}>Load Test Data For Playground (NOT SAVED)</ToggleEntry>
            </SettingsSection>
            <SettingsSection text="Playground">
                <div className="flex flex-row gap-2">
                    <Button>button</Button>
                    <Button className="outlined">outlined button</Button>
                </div>
                <ToggleEntry checked={temp} onCheckedChange={setTemp}>toggle</ToggleEntry>
                <LoadingTemplate/>
                <div className="select-none flex flex-row gap-2">
                    <div className="flex flex-col">
                        <p className="brightness-50">bright 50</p>
                        <p className="brightness-75">bright 75</p>
                        <p className="brightness-90">bright 90</p>
                        <p className="brightness-95">bright 95</p>
                        <p className="brightness-100">bright 100</p>
                        <p className="brightness-105">bright 105</p>
                        <p className="brightness-110">bright 110</p>
                        <p className="brightness-125">bright 125</p>
                        <p className="brightness-150">bright 150</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="brightness-50 accent-text">bright 50</p>
                        <p className="brightness-75 accent-text">bright 75</p>
                        <p className="brightness-90 accent-text">bright 90</p>
                        <p className="brightness-95 accent-text">bright 95</p>
                        <p className="brightness-100 accent-text">bright 100</p>
                        <p className="brightness-105 accent-text">bright 105</p>
                        <p className="brightness-110 accent-text">bright 110</p>
                        <p className="brightness-125 accent-text">bright 125</p>
                        <p className="brightness-150 accent-text">bright 150</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="brightness-50 lighter-accent">bright 50</p>
                        <p className="brightness-75 lighter-accent">bright 75</p>
                        <p className="brightness-90 lighter-accent">bright 90</p>
                        <p className="brightness-95 lighter-accent">bright 95</p>
                        <p className="brightness-100 lighter-accent">bright 100</p>
                        <p className="brightness-105 lighter-accent">bright 105</p>
                        <p className="brightness-110 lighter-accent">bright 110</p>
                        <p className="brightness-125 lighter-accent">bright 125</p>
                        <p className="brightness-150 lighter-accent">bright 150</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="brightness-50 darker-accent">bright 50</p>
                        <p className="brightness-75 darker-accent">bright 75</p>
                        <p className="brightness-90 darker-accent">bright 90</p>
                        <p className="brightness-95 darker-accent">bright 95</p>
                        <p className="brightness-100 darker-accent">bright 100</p>
                        <p className="brightness-105 darker-accent">bright 105</p>
                        <p className="brightness-110 darker-accent">bright 110</p>
                        <p className="brightness-125 darker-accent">bright 125</p>
                        <p className="brightness-150 darker-accent">bright 150</p>
                    </div>
                    <div className="flex flex-col">
                        <p>no class</p>
                        <p className="text-xs">lorem</p>
                        <p className="text-sm">lorem</p>
                        <p className="text-md">lorem</p>
                        <p className="text-lg">lorem</p>
                        <p className="text-xl">lorem</p>
                        <p className="text-2xl">lorem</p>
                        <p className="text-3xl">lorem</p>
                        <p className="text-4xl">lorem</p>
                        <p className="text-5xl">lorem</p>
                        <p className="text-6xl">lorem</p>
                        <p className="text-7xl">lorem</p>
                        <p className="text-8xl">lorem</p>
                        <p className="text-9xl">lorem</p>
                    </div>
                    <div className="flex flex-col">
                        <p>no class</p>
                        <p className="font-thin">thin</p>
                        <p className="font-extralight">extra light</p>
                        <p className="font-light">light</p>
                        <p className="font-normal">normal</p>
                        <p className="font-medium">medium</p>
                        <p className="font-semibold">semibold</p>
                        <p className="font-bold">bold</p>
                        <p className="font-extrabold">extra bold</p>
                    </div>
                </div>
                {!tempAccount ? "" : <>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <MiniUser account={tempAccount} />
                    </div>
                    <SmallUser user={tempAccount} />
                </>}
                {!tempPerformance ? "" : <>
                    <PerformanceComponent performance={tempPerformance} />
                    <ArrComponent arr={{...tempPerformance.arrVersion.arr, coverUrl: tempPerformance.coverUrl, perfCount: 69, arrCreatedAt: new Date().getTime()/1000}} />
                </>}
                
                <br/>
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
            </SettingsSection>
        </div>
    )
}