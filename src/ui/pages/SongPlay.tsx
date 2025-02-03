import { useParams } from "react-router"
import { useEffect, useRef, useState } from "react"
import { Arr } from "@/api/smule-types"
import { SmuleMIDI } from "@/api/smule"
import Navbar from "../components/Navbar"
import Lyrics from "../components/Lyrics"
import PaddedBody from "../components/PaddedBody"
import LoadingTemplate from "../components/LoadingTemplate"
import { Util } from "@/api/util"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Mic, Pause, Play, RefreshCw } from "lucide-react"
import cat from "/cat-jam.gif"
import SyllableLyrics from "../components/SyllableLyrics"

export default function SongPlay() {
    const params = useParams() as unknown as {type: "SOLO"|"DUET"|"GROUP", part: number, songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as Arr)
    const [lyrics, setLyrics] = useState({} as SmuleMIDI.SmuleLyricsData)
    const [coverArt, setCoverArt] = useState("")
    const [singingText, setSingingText] = useState("")
    const [songTitle, setSongTitle] = useState("")
    const [songArtist, setSongArtist] = useState("")

    const [microphoneId, setMicrophoneId] = useState("default")
    const [microphones, setMicrophones] = useState([] as MediaDeviceInfo[])
    const [refreshMicrophones, setRefreshMicrophones] = useState(true)

    const [audioTime, setAudioTime] = useState(0)
    const [playing, setPlaying] = useState(false)
    
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressRef = useRef<HTMLInputElement | null>(null)
    const mediaRecRef = useRef<MediaRecorder | null>(null)
    const mediaChunksRef = useRef<{[key: number]: Blob[]}>([] as {[key: number]: Blob[]})
    const mediaShouldRecRef = useRef<boolean>(false)
    const mediaShouldAutoStartOnPlay = useRef<boolean>(true)

    useEffect(() => {
        smule.fetchSong(params.songId).then(async ({ arrVersion }) => {
            setSong(arrVersion.arr)

            if (params.type == "SOLO") {
                setSingingText("alone")
            } else if (params.type == "DUET") {
                setSingingText("in a duet")
            } else {
                setSingingText("in a group")
            }

            let trackUrl = ""
            let midiUrl = ""
            for (let resource of arrVersion.origResources) {
                if (resource.role == "bg") {
                    trackUrl = await storage.download(resource.url)
                } else if (resource.role == "cover") {
                    setCoverArt(resource.url)
                } else if (resource.role == "midi") {
                    midiUrl = await storage.download(resource.url)
                }
            }
            for (let resource of arrVersion.normResources) {
                if (resource.role == "bg" && !trackUrl) {
                    trackUrl = await storage.download(resource.url)
                } else if (resource.role == "midi" && !midiUrl) {
                    midiUrl = await storage.download(resource.url)
                }
            }
            let lyrics = await smule.fetchLyrics(midiUrl)
            setLyrics(lyrics)

            let aud = new Audio(trackUrl)
            audioRef.current = aud

            setSongTitle(
                arrVersion.arr.composition ? arrVersion.arr.composition.title :
                arrVersion.arr.name ?? arrVersion.arr.compTitle 
            )
            setSongArtist(
                arrVersion.arr.composition ? arrVersion.arr.composition.artist :
                arrVersion.arr.artist
            )

            setLoading(false)
        })
    }, [params])

    useEffect(() => {
        if (!audioRef.current) return
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
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setMicrophones(devices.filter((d) => d.kind == "audioinput"))
        })
    }, [refreshMicrophones])

    useEffect(() => {
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

    return (
        <>
            <Navbar runBeforeNavigation={() => {
                if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.src = ""
                }
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
                                if (lyrics.lyrics[i].startTime <= audioTime) currentLyric = i
                            }
                            if (currentLyric >= lyrics.lyrics.length - 1) return
                            audioRef.current.currentTime = lyrics.lyrics[currentLyric + 1].startTime - 0.5
                        }}>
                            <ArrowDown/>
                        </Button>
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
                </div>
                {
                    !lyrics.isSyllable ?
                    <Lyrics lyrics={lyrics.lyrics} audioTime={audioTime} part={params.part} pause={() => setPlaying(false)} resume={() => setPlaying(true)} setTime={(e) => {
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
                    }}/>
                    :
                    <SyllableLyrics lyrics={lyrics} audioTime={audioTime} part={params.part} pause={() => {}} resume={() => {}} setTime={() => {}} preview={false}/>
                }
                <div className="flex flex-col gap-8 right-side-player items-center justify-center">
                    <h1 className="font-bold">Singing {singingText}</h1>
                    <img src={cat} className="max-w-xs aspect-square" />
                </div>
            </>
            )}
            </PaddedBody>
        </>
    )
}