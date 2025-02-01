import { useParams } from "react-router"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import { useEffect, useRef, useState } from "react"
import { ArrExtended, ArrResult, PerformanceIcon } from "@/api/smule-types"
import LoadingTemplate from "../components/LoadingTemplate"
import Lyrics from "../components/Lyrics"
import { SmuleMIDI } from "@/api/smule"
import { ArrowDown, ArrowUp, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Util } from "@/api/util"
import cat from "/cat-jam.gif"

// TODO: better playback
export default function PerformancePlay() {
    const params = useParams() as unknown as {performanceId: string}
    const [loading, setLoading] = useState(true)
    const [performance, setPerformance] = useState({} as PerformanceIcon)
    const [arr, setArr] = useState({} as ArrExtended)
    const [origTrackUrl, setOrigTrackUrl] = useState("")
    const [songUrl, setSongUrl] = useState("")
    const [shortTermUrl, setShortTermUrl] = useState("")
    const [lyrics, setLyrics] = useState([] as SmuleMIDI.SmuleLyrics[])
    const [coverArt, setCoverArt] = useState("")
    const [singingText, setSingingText] = useState("")
    
    const [audioTime, setAudioTime] = useState(0)
    const [playing, setPlaying] = useState(false)
    // const [songSource, setSongSource] = useState(new Audio())
    // const [origTrackSource, setOrigTrackSource] = useState(new Audio())
    // const [audioLength, setAudioLength] = useState(0)
    // const [visibleAudioTime, setVisibleAudioTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressRef = useRef<HTMLInputElement | null>(null)


    useEffect(() => {
        smule.fetchPerformance(params.performanceId).then(async ({ performance }) => {
            setPerformance(performance)

            if (performance.ensembleType == "SOLO") {
                setSingingText("alone")
            } else if (performance.ensembleType == "DUET") {
                setSingingText("together with " + performance.accountIcon.handle)
            } else {
                let text = "together with "
                for (let {accountIcon} of performance.recentTracks) {
                    text += accountIcon.handle + ", "
                }
                setSingingText(text)
            }

            let origTrackUrl = await storage.download(performance.origTrackUrl)
            let songUrl = ""
            setOrigTrackUrl(origTrackUrl)
            setArr(performance.arrVersion)
            setCoverArt(performance.coverUrl)
            setShortTermUrl(await storage.download(performance.shortTermRenderedUrl))

            for (let resource of performance.arrVersion.origResources) {
                if (resource.role == "bg") {
                    songUrl = await storage.download(resource.url)
                } else if (resource.role == "midi") {
                    let midiFile = await storage.download(resource.url)
                    setLyrics(await smule.fetchLyrics(midiFile))
                } else if (resource.role == "cover" && !coverArt) {
                    setCoverArt(resource.url)
                }
            }
            for (let resource of performance.arrVersion.normResources) {
                if (resource.role == "background" && !songUrl) {
                    songUrl = await storage.download(resource.url)
                } else if (resource.role == "main" && !lyrics) {
                    let midiFile = await storage.download(resource.url)
                    setLyrics(await smule.fetchLyrics(midiFile))
                } else if (resource.role == "cover_art" && !coverArt) {
                    setCoverArt(resource.url)
                }
            }
            // i will have to eventually sync bg and origtrack, but for now ill
            // use the rendered song
            songUrl = await storage.download(performance.shortTermRenderedUrl)
            setSongUrl(songUrl)
            let aud = new Audio(songUrl)
            audioRef.current = aud

            //? May be needed under certain cases where electron wont play
            //? m4a's for some random ass reason
            // setOrigTrackUrl(await storage.convert(origTrackUrl, "mp3"))

            // let a1 = new Audio(songUrl)
            // let a2 = new Audio(origTrackUrl)
            // let s1 = audioCtx.createMediaElementSource(a1)
            // let s2 = audioCtx.createMediaElementSource(a2)
            // s1.connect(audioCtx.destination)
            // s2.connect(audioCtx.destination)
            // setSongSource(a1)
            // setOrigTrackSource(a2)

            // setAudioLength(a1.duration)

            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!audioRef.current) return
        if (playing) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [playing])

    useEffect(() => {
        const audioUpdate = () => {
            if (audioRef.current) {
                // if (playing) {
                setAudioTime(audioRef.current.currentTime)
                // }
                requestAnimationFrame(audioUpdate)
            }
        }
        requestAnimationFrame(audioUpdate)
    }, [loading])

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
                        <h1 className="text-3xl">{performance.title}</h1>
                        <p className="text-md">{performance.artist}</p>
                    </div>
                    <div className="flex flex-row gap-2 justify-center">
                        <p>{Util.formatTime(audioTime * 1000)}</p>
                        <input ref={progressRef} type="range" value={audioTime} onChange={(e) => {
                            // @ts-ignore
                            audioRef.current.currentTime = e.target.value
                            //@ts-ignore
                            setAudioTime(e.target.value)
                            // setPlaying(true)
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
                            for (let i = 0; i < lyrics.length; i++) {
                                if (lyrics[i].startTime <= audioTime) currentLyric = i
                            }
                            if (currentLyric < 1) return
                            audioRef.current.currentTime = lyrics[currentLyric - 1].startTime - 0.5
                        }}>
                            <ArrowUp/>
                        </Button>
                        <Button onClick={() => setPlaying(!playing)}>
                            {playing ? <Pause/> : <Play/>}
                        </Button>
                        <Button onClick={() => {
                            if (!audioRef.current) return
                            let currentLyric = -1
                            for (let i = 0; i < lyrics.length; i++) {
                                if (lyrics[i].startTime <= audioTime) currentLyric = i
                            }
                            if (currentLyric >= lyrics.length - 1) return
                            audioRef.current.currentTime = lyrics[currentLyric + 1].startTime - 0.5
                        }}>
                            <ArrowDown/>
                        </Button>
                    </div>
                </div>
                <Lyrics lyrics={lyrics} audioTime={audioTime} part={performance.origTrackPartId == 1 ? 2 : !performance.origTrackPartId ? 3 : 1} pause={() => setPlaying(false)} resume={() => setPlaying(true)} setTime={(e) => audioRef.current.currentTime = e}/>
                <div className="flex flex-col gap-8">
                    <h1 className="font-bold">Singing {singingText}</h1>
                    <img src={cat} />
                </div>
            </>
            )}
            </PaddedBody>
        </>
    )
}
