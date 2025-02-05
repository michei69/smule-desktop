import { SmuleMIDI } from "@/api/smule-midi"
import { Arr, ArrExtended, avTmplSegment } from "@/api/smule-types"
import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"
import PaddedBody from "./PaddedBody"
import LoadingTemplate from "./LoadingTemplate"
import { Util } from "@/api/util"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Loader2, Mic, Pause, Play, RefreshCw } from "lucide-react"
import Lyrics from "./Lyrics"
import cat from "/cat-jam.gif"
import { useNavigate } from "react-router"
import PitchesPlayer from "./PitchesPlayer"

export default function PlayPageComponent({ audioLink, arr, singingText, songTitle, songArtist, part }: { audioLink: string, arr: ArrExtended, singingText: React.ReactNode, songTitle: string, songArtist: string, part: number }) {
    const navigate = useNavigate()
    
    const [loading, setLoading] = useState(true)
    const [lyrics, setLyrics] = useState({} as SmuleMIDI.SmuleMidiData)
    const [avTmplSegments, setAvTmplSegments] = useState([] as avTmplSegment[])
    const [coverArt, setCoverArt] = useState("")

    const [microphoneId, setMicrophoneId] = useState("default")
    const [microphones, setMicrophones] = useState([] as MediaDeviceInfo[])
    const [refreshMicrophones, setRefreshMicrophones] = useState(true)

    const [audioTime, setAudioTime] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    
    const [finishing, setFinishing] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressRef = useRef<HTMLInputElement | null>(null)
    const mediaRecRef = useRef<MediaRecorder | null>(null)
    const mediaChunksRef = useRef<{[key: number]: Blob[]}>({} as {[key: number]: Blob[]})
    const mediaShouldRecRef = useRef<boolean>(false)
    const mediaShouldAutoStartOnPlay = useRef<boolean>(true)
    const keybindListenerRef = useRef<any>(null)

    const keydownCallback = (e: KeyboardEvent) => {
        if (e.key == " ") {
            e.preventDefault()
            if (!audioRef.current) return
            setPlaying(audioRef.current.paused)
        }
        if (e.key == "ArrowRight") {
            e.preventDefault()
            if (!audioRef.current) return
            audioRef.current.currentTime += 5
        }
        if (e.key == "ArrowLeft") {
            e.preventDefault()
            if (!audioRef.current) return
            audioRef.current.currentTime -= 5
        }
        if (e.key == "ArrowUp") {
            e.preventDefault()
            if (!audioRef.current) return
            let currentLyric = -1
            for (let i = 0; i < lyrics.lyrics.length; i++) {
                if (lyrics.lyrics[i].startTime <= audioRef.current.currentTime + 0.25) currentLyric = i
            }
            if (currentLyric < 1) return
            audioRef.current.currentTime = lyrics.lyrics[currentLyric - 1].startTime
        }
        if (e.key == "ArrowDown") {
            e.preventDefault()
            if (!audioRef.current) return
            let currentLyric = -1
            for (let i = 0; i < lyrics.lyrics.length; i++) {
                if (lyrics.lyrics[i].startTime <= audioRef.current.currentTime + 0.25) currentLyric = i
            }
            if (currentLyric >= lyrics.lyrics.length - 1) return
            audioRef.current.currentTime = lyrics.lyrics[currentLyric + 1].startTime
        }
    }

    useEffect(() => {
        if (keybindListenerRef.current) {
            window.removeEventListener("keydown", keybindListenerRef.current)
        }
        keybindListenerRef.current = keydownCallback
        window.addEventListener("keydown", keybindListenerRef.current)
    }, [audioLink])

    useEffect(() => {
        setAvTmplSegments(arr.avTmplSegments);

        (async () => {
            let midiUrl = ""
            let coverArt = ""
            // Download norm first, because that's the one which usually has
            // the correct midi file
            for (let resource of arr.normResources) {
                if (resource.role == "main") {
                    midiUrl = await storage.download(resource.url)
                } else if (resource.role.includes("cover_art")) {
                    coverArt = resource.url
                }
            }
            // For some reason, original resources' midi file is missing pitches?
            // It's a weird decision, but smule is smule ig
            for (let resource of arr.origResources) {
                if (resource.role.includes("cover") && !coverArt) {
                    coverArt = resource.url
                } else if (resource.role == "midi" && !midiUrl) {
                    midiUrl = await storage.download(resource.url)
                }
            }
            setCoverArt(coverArt)

            let lyrics = await smule.fetchLyrics(midiUrl)
            setLyrics(lyrics)
    
            let aud = new Audio(audioLink)
            audioRef.current = aud

            setLoading(false)
            setFinishing(false)
        })()
    }, [audioLink, arr])

    useEffect(() => {
        if (!audioRef.current) return
        if (finishing) return audioRef.current.pause()
        if (playing) {
            audioRef.current.play()
            if (mediaRecRef.current && mediaShouldAutoStartOnPlay.current) {
                try {
                    mediaRecRef.current.start(250)
                } catch {}
            }
        } else {
            audioRef.current.pause()
            if (mediaRecRef.current) {
                try {
                    mediaRecRef.current.stop()
                } catch {}
            }
        }

    }, [playing])

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
        if (finishing) return
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setMicrophones(devices.filter((d) => d.kind == "audioinput"))
        })
    }, [refreshMicrophones])

    useEffect(() => {
        if (finishing) return
        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: microphoneId
            }
        }).then((stream) => {
            if (mediaRecRef.current) mediaRecRef.current.stop()
            let temp = new MediaRecorder(stream)
            temp.ondataavailable = (e) => {
                if (!mediaShouldRecRef.current || !audioRef.current) return
                let id = audioRef.current.currentTime.toFixed(2)
                if (!mediaChunksRef.current[id]) mediaChunksRef.current[id] = []
                mediaChunksRef.current[id].push(e.data)
            }
            temp.onstop = () => {
                mediaShouldRecRef.current = false
                console.log(mediaChunksRef.current)
            }
            temp.onstart = () => {
                mediaShouldRecRef.current = true
            }
            mediaRecRef.current = temp
        })
    }, [microphoneId])

    useEffect(() => {
        if (finishing) return
        if (!audioRef.current) return
        audioRef.current.volume = volume
    }, [volume])

    return (
        <>
            <Navbar runBeforeNavigation={() => {
                if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.src = ""
                }
                if (mediaRecRef.current) mediaRecRef.current.stop()
                if (keybindListenerRef.current) window.removeEventListener("keydown", keybindListenerRef.current)
            }}/>
            <PaddedBody className="flex flex-row justify-center items-center h-full min-h-fit">
            {loading ? <LoadingTemplate/> :(
            <>
                <div className="flex flex-col gap-4 items-center left-side-player">
                    <img src={coverArt} className="rounded-md max-w-xs aspect-square"/>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl">{songTitle}</h1>
                        <p className="text-md">{songArtist}</p>
                    </div>
                    <div className="flex flex-row gap-2 justify-center">
                        <p>{Util.formatTime(audioTime * 1000)}</p>
                        <input ref={progressRef} type="range" value={audioTime} onChange={(e) => {
                            // @ts-ignore
                            audioRef.current.currentTime = e.target.value
                            //@ts-ignore
                            setAudioTime(e.target.value)
                        }} onMouseDown={() => setPlaying(false)} onMouseUp={(e) => {
                            //@ts-ignore
                            audioRef.current.currentTime = e.target.value
                            //@ts-ignore
                            setAudioTime(e.target.value)
                            
                            let newChunker = {}
                            for (let idx of Object.keys(mediaChunksRef.current)) {
                                //@ts-ignore
                                if (idx < e.target.value) {
                                    newChunker[idx] = mediaChunksRef.current[idx]
                                }
                            }

                            setPlaying(true)
                        }} max={audioRef.current.duration} />
                        <p>{Util.formatTime(audioRef.current.duration * 1000)}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                    <Button onClick={() => {
                            if (!audioRef.current) return
                            let currentLyric = -1
                            for (let i = 0; i < lyrics.lyrics.length; i++) {
                                if (lyrics.lyrics[i].startTime <= audioTime) currentLyric = i
                            }
                            if (currentLyric < 1) return
                            audioRef.current.currentTime = lyrics.lyrics[currentLyric - 1].startTime - 0.5
                        }}>
                            <ArrowUp/>
                        </Button>
                        <Button onClick={() => setPlaying(!playing)}>
                            {playing ? <Pause/> : <Play/>}
                        </Button>
                        <Button onClick={() => {
                            if (!audioRef.current) return
                            let currentLyric = -1
                            for (let i = 0; i < lyrics.lyrics.length; i++) {
                                if (lyrics.lyrics[i].startTime <= audioTime + 0.55) currentLyric = i
                            }
                            if (currentLyric >= lyrics.lyrics.length - 1) return
                            audioRef.current.currentTime = lyrics.lyrics[currentLyric + 1].startTime - 0.5
                        }}>
                            <ArrowDown/>
                        </Button>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <input type="range" value={volume * 100} onChange={(e) => setVolume(Number(e.target.value) / 100)} min="0" max="100" className="w-full"/>
                        <p>{Math.ceil(volume * 100)}%</p>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <Button onClick={() => setRefreshMicrophones(!refreshMicrophones)}>
                            <RefreshCw className="w-8 aspect-square"/>
                        </Button>
                        <select onChange={(e) => setMicrophoneId(e.target.value)} className="w-full">
                        {
                            microphones.map((mic, idx) => <option key={idx} value={mic.deviceId}>{mic.label}</option>)
                        }
                        </select>
                        <Mic className="w-8 aspect-square"/>
                    </div>
                    <Button onClick={async () => {
                        setFinishing(true)
                        if (mediaRecRef.current) mediaRecRef.current.stop()
                        if (audioRef.current) audioRef.current.pause()

                        let arrBuf = []
                        for (let blobArr of Object.values(mediaChunksRef.current)) {
                            for (let blob of blobArr) {
                                arrBuf.push(await blob.arrayBuffer())
                            }
                        }
                        let temp = new Uint8Array()
                        arrBuf.forEach(buffer => {
                            const tempBuffer = new Uint8Array(buffer);
                            const combined = new Uint8Array(temp.length + tempBuffer.length);
                            combined.set(temp);
                            combined.set(tempBuffer, temp.length);
                            temp = combined;
                        });

                        let fileName = arr.arr.songId + "-rec.wav"
                        await storage.save(fileName, temp)

                        await navigate("/finish-rec/" + arr.arr.key + "/" + part + "/" + fileName + "/" + audioLink)
                    }} disabled={finishing}>
                    {finishing ? 
                    <>
                        <Loader2 className="animate-spin"/> 
                        Finishing...
                    </> : "Finish"
                    }
                    </Button>
                </div>
                <Lyrics lyrics={lyrics} audioTime={audioTime} part={part} pause={() => setPlaying(false)} resume={() => setPlaying(true)} setTime={(e) => {
                    if (!audioRef.current || !mediaChunksRef.current) return
                    mediaShouldAutoStartOnPlay.current = false
                    audioRef.current.currentTime = e - 0.250
                    let newChunker = {}
                    for (let idx of Object.keys(mediaChunksRef.current)) {
                        if (idx < e) {
                            newChunker[idx] = mediaChunksRef.current[idx]
                        }
                    }
                    mediaChunksRef.current = newChunker
                    setTimeout(() => {
                        mediaShouldAutoStartOnPlay.current = true
                        if (mediaRecRef.current) {
                            try {
                                mediaRecRef.current.start(250)
                            } catch {}
                        }
                    }, 250)
                }} avTmplSegments={avTmplSegments}/>
                <div className="flex flex-col gap-8 right-side-player items-center justify-center">
                    <h1 className="font-bold flex flex-row gap-1">{singingText}</h1>
                    <img src={cat} className="max-w-xs aspect-square" />
                    {
                        arr.pitchTrack ?
                        <PitchesPlayer pitches={lyrics.pitches} audioTime={audioTime} length={arr.length} part={part} /> : ""
                    }
                </div>
            </>
            )}
            </PaddedBody>
        </>
    )
}