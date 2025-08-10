import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import { SDCArr, SDCLyric, SmuleMidiData, SmulePitchesData, SmuleUserSinging } from "smule.js"
import Lyrics from "../components/Lyrics"
import LoadingTemplate from "../components/LoadingTemplate"

export default function LyricsSyncSubPage() {
    const navigate = useNavigate()

    const [arr, setArr] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]
    const [loading, setLoading] = useState(true)
    const [lyrics, setLyrics] = useState({} as SmuleMidiData)
    const [speed, setSpeed] = useState(1)

    const [audioTime, setAudioTime] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audioUpdate = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(audioUpdate)
            }
        }
        requestAnimationFrame(audioUpdate)
    }, [loading])

    useEffect(() => {
        setLoading(true)
        setLyrics({
            isSyllable: false,
            pitches: {} as SmulePitchesData,
            type: "COMMUNITY",
            lyrics: arr.lyrics.lines.filter(lyric => lyric.text.length > 0).map((lyric, idx) => ({
                text: [{
                    text: lyric.text,
                    startTime: lyric.ts,
                    endTime: idx == arr.lyrics.lines.length - 1 ? arr.lyrics.duration : arr.lyrics.lines[idx + 1].ts
                }],
                startTime: lyric.ts,
                endTime: idx == arr.lyrics.lines.length - 1 ? arr.lyrics.duration : arr.lyrics.lines[idx + 1].ts,
                part: lyric.part == "part-1" ? SmuleUserSinging.PART_ONE : lyric.part == "part-2" ? SmuleUserSinging.PART_TWO : SmuleUserSinging.BOTH
            }))
        } as SmuleMidiData)
        setLoading(false)
    }, [arr])

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.playbackRate = speed
    }, [speed])

    const keydownCallback = (e: KeyboardEvent) => {
        let lyricIdx = -2
        for (let i = 0; i < arr.lyrics.lines.length; i++) {
            if (arr.lyrics.lines[i].ts <= audioRef.current.currentTime) 
                lyricIdx = i
        }
        if (lyricIdx == -2 && arr.lyrics.lines[0]?.ts == Infinity) lyricIdx = -1
        switch (e.key) {
            case " ":
                e.preventDefault()
                if (!audioRef.current) return
                audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
                break
            case "j":
                e.preventDefault()
                if (!audioRef.current) return
                if (lyricIdx != -1 && arr.lyrics.lines[lyricIdx] != null) {
                    let offset = 0
                    while (arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        arr.lyrics.lines[lyricIdx + offset].ts = Math.floor(audioRef.current.currentTime*100)/100
                        offset++
                    }
                    arr.lyrics.lines[lyricIdx + offset].ts = Math.floor(audioRef.current.currentTime*100)/100
                }
                setArr({...arr})
                break
            case "k":
                e.preventDefault()
                if (!audioRef.current) return
                if (lyricIdx != -2 && arr.lyrics.lines[lyricIdx + 1] != null) {
                    let offset = 1
                    while (arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        arr.lyrics.lines[lyricIdx + offset].ts = Math.floor(audioRef.current.currentTime*100)/100
                        offset++
                    }
                    arr.lyrics.lines[lyricIdx + offset].ts = Math.floor(audioRef.current.currentTime*100)/100
                }
                setArr({...arr})
                break
            case "d":
                e.preventDefault()
                if (!audioRef.current) return
                if (lyricIdx != -1 && arr.lyrics.lines[lyricIdx] != null) {
                    let offset = 0
                    while (arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        offset++
                    }
                    arr.lyrics.lines[lyricIdx + offset].part = "part-1"
                }
                setArr({...arr})
                break
            case "f":
                e.preventDefault()
                if (!audioRef.current) return
                if (lyricIdx != -1 && arr.lyrics.lines[lyricIdx] != null) {
                    let offset = 0
                    while (arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        offset++
                    }
                    arr.lyrics.lines[lyricIdx + offset].part = "part-2"
                }
                setArr({...arr})
                break
            case "g":
                e.preventDefault()
                if (!audioRef.current) return
                if (lyricIdx != -1 && arr.lyrics.lines[lyricIdx] != null) {
                    let offset = 0
                    while (arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        offset++
                    }
                    arr.lyrics.lines[lyricIdx + offset].part = "both"
                }
                setArr({...arr})
                break
            case "q":
                e.preventDefault()
                if (!audioRef.current) return
                for (let i = 0; i < arr.lyrics.lines.length; i++) {
                    arr.lyrics.lines[i].ts = Infinity
                }
                setArr({...arr})
                break
            case "w":
                e.preventDefault()
                if (!audioRef.current) return
                setSpeed(1)
                break
            case "ArrowDown":
                e.preventDefault()
                if (!audioRef.current) return
                {
                    let offset = 1
                    while (arr.lyrics.lines[lyricIdx + offset] != null && arr.lyrics.lines[lyricIdx + offset].text.trim().length == 0) {
                        offset++
                    }
                    if (arr.lyrics.lines[lyricIdx + offset].ts != Infinity) {
                        audioRef.current.currentTime = arr.lyrics.lines[lyricIdx + offset].ts + 0.05
                    }
                }
                break
            case "ArrowUp":
                e.preventDefault()
                if (!audioRef.current) return
                {
                    let offset = 1
                    while (arr.lyrics.lines[lyricIdx - offset] != null && arr.lyrics.lines[lyricIdx - offset].text.trim().length == 0) {
                        offset++
                    }
                    if (arr.lyrics.lines[lyricIdx - offset].ts != Infinity) {
                        audioRef.current.currentTime = arr.lyrics.lines[lyricIdx - offset].ts + 0.05
                    }
                }
                break
            case "ArrowLeft":
                e.preventDefault()
                if (!audioRef.current) return
                audioRef.current.currentTime -= 5
                break
            case "ArrowRight":
                e.preventDefault()
                if (!audioRef.current) return
                audioRef.current.currentTime += 5
                break
        }
    }
    const keylistenerRef = useRef<(e: KeyboardEvent) => void>()

    useEffect(() => {
        if (keylistenerRef.current) window.removeEventListener("keydown", keylistenerRef.current)
        keylistenerRef.current = keydownCallback
        window.addEventListener("keydown", keydownCallback)
        return () => {
            window.removeEventListener("keydown", keydownCallback)
        }
    }, [])

    return (
        <>
            {!loading ? <>
            <h1 className="text-left ml-auto mr-auto">Keybinds:<br/>space: play/pause<br/>k: sync next lyric to current time<br/>comma (,): first part<br/>dot (.): second part<br/>slash (/): both</h1>
            <div className="flex flex-row items-center justify-center gap-2">
                <audio controls src={arr.audioData.url} ref={audioRef} className="select-none" />
                <button onClick={() => setSpeed(speed - 0.01)}><ArrowLeft className="w-4 h-4"/></button>
                <input type="range" min={0} max={2} step={0.01} value={speed} onChange={(e) => {
                    setSpeed(parseFloat(e.currentTarget.value))
                }}/>
                <button onClick={() => setSpeed(speed + 0.01)}><ArrowLeft className="w-4 h-4 rotate-180"/></button>
            </div>
            <div className="flex flex-row justify-center w-full">
                <div className="flex flex-col h-128 w-fit overflow-y-scroll gap-2" style={{minWidth:"510px"}}>
                {arr.lyrics.lines.map((lyric, idx) => 
                    <div key={idx} className="flex flex-row items-center justify-center gap-4 bg-amber-950 rounded-2xl pl-16 pr-16">
                        <button className="w-4 h-4 flex items-center justify-center" onClick={() => {
                            const lines = [...arr.lyrics.lines.slice(0, idx), {group_parts: [], part: "", text: "", ts: 0} as SDCLyric, ...arr.lyrics.lines.slice(idx)]
                            arr.lyrics.lines = lines
                            setArr({...arr})
                        }}>+</button>
                        <button className="w-4 h-4 flex items-center justify-center" onClick={() => {
                            const lines = [...arr.lyrics.lines.slice(0, idx), ...arr.lyrics.lines.slice(idx + 1)]
                            arr.lyrics.lines = lines
                            setArr({...arr})
                        }}>x</button>
                        <input type="text" value={lyric.text} onChange={(e) => {
                            arr.lyrics.lines[idx].text = e.currentTarget.value
                            setArr({...arr})
                        }}/>
                        <select onChange={(e) => {arr.lyrics.lines[idx].part = e.currentTarget.value as ""|"part-1"|"part-2"|"both"; setArr({...arr})}}>
                            <option selected={lyric.part == "part-1"} value="part-1">Part 1</option>
                            <option selected={lyric.part == "part-2"} value="part-2">Part 2</option>
                            <option selected={lyric.part == "both"} value="both">Both</option>
                            <option selected={lyric.part == ""} value="both">None</option>
                        </select>
                        <input type="number" value={lyric.ts} step={0.01} onChange={(e) => {
                            arr.lyrics.lines[idx].ts = parseFloat(e.currentTarget.value); 
                            setArr({...arr})
                            // console.log("a")
                            audioRef.current.currentTime = parseFloat(e.currentTarget.value)
                            audioRef.current.play()
                        }} className="w-16"/>
                    </div>
                )}
                </div>
                <Lyrics lyrics={lyrics} audioTime={audioTime} avTmplSegments={[]} part={1} pause={() => {audioRef.current?.pause()}} resume={() => {audioRef.current?.play()}} setTime={(e) => {audioRef.current.currentTime = e}} preview={false} fill={true} dontScroll={true} />
            </div>

            <button onClick={async () => {
                arr.lyrics.duration = audioRef.current.duration
                console.log(arr)
                setArr({...arr})
                navigate("/create-arr/segments")
            }} className="flex flex-row gap-1 items-center justify-center" disabled={loading}>Next{loading ? <Loader2 className="animate-spin"/> : ""}</button>
            </> : <LoadingTemplate/>}
        </>
    )
}