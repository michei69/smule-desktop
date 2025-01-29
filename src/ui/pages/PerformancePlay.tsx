import { useParams } from "react-router"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import { useEffect, useRef, useState } from "react"
import { ArrExtended, ArrResult, PerformanceIcon } from "@/api/smule-types"
import LoadingTemplate from "../components/LoadingTemplate"
import Lyrics from "../components/Lyrics"
import { SmuleMIDI } from "@/api/smule"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

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
    
    const [audioTime, setAudioTime] = useState(0)
    // const audioCtx = new AudioContext()
    // const [songSource, setSongSource] = useState(new Audio())
    // const [origTrackSource, setOrigTrackSource] = useState(new Audio())
    // const [audioLength, setAudioLength] = useState(0)
    // const [visibleAudioTime, setVisibleAudioTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)


    useEffect(() => {
        smule.fetchPerformance(params.performanceId).then(async ({ performance }) => {
            setPerformance(performance)

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
            setSongUrl(songUrl)

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
        const updateAudioTime = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(updateAudioTime)
            }
            // if (songSource) {
            //     setAudioTime(songSource.currentTime)
            // }
        }
        requestAnimationFrame(updateAudioTime)
    }, [loading])

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-col justify-center items-center">
            {loading ? <LoadingTemplate/> :(
            <>
                <img src={coverArt} className="rounded-md"/>
                <h1 className="text-2xl">{performance.title} - {performance.artist}</h1>
                <audio src={shortTermUrl} ref={audioRef} controls/>
                <br/>
                <Lyrics lyrics={lyrics} audioTime={audioTime} part={performance.origTrackPartId == 1 ? 2 : 1}/>
            </>
            )}
            </PaddedBody>
        </>
    )
}
