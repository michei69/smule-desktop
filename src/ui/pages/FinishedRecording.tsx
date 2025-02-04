import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import { SmuleMIDI } from "@/api/smule";
import Lyrics from "../components/Lyrics";

export default function FinishedRecording() {
    const params = useParams() as unknown as {songId: string, fileName: string, part: number, origTrackUrl: string}
    const [loading, setLoading] = useState(true)
    const [songTitle, setSongTitle] = useState("")
    const [songArtist, setSongArtist] = useState("")
    const [coverArt, setCoverArt] = useState("")
    const [lyrics, setLyrics] = useState({} as SmuleMIDI.SmuleMidiData)
    
    const [url, setUrl] = useState("")
    const [audioTime, setAudioTime] = useState(0)

    const bgAudioRef = useRef<HTMLAudioElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        smule.getTMPDir().then((dir) => {
            setUrl(dir + "/" + params.fileName)
        })

        bgAudioRef.current = new Audio(params.origTrackUrl)

        smule.fetchSong(params.songId).then(async ({ arrVersion }) => {
            setSongTitle(
                arrVersion.arr.composition ? arrVersion.arr.composition.title :
                arrVersion.arr.name ?? arrVersion.arr.compTitle 
            )
            setSongArtist(
                arrVersion.arr.composition ? arrVersion.arr.composition.artist :
                arrVersion.arr.artist
            )

            let midiUrl = ""
            let coverArt = ""
            for (let resource of arrVersion.origResources) {
                if (resource.role == "cover") {
                    coverArt = resource.url
                } else if (resource.role == "midi") {
                    midiUrl = await storage.download(resource.url)
                }
            }
            for (let resource of arrVersion.normResources) {
                if (resource.role == "main" && !midiUrl) {
                    midiUrl = await storage.download(resource.url)
                } else if (resource.role == "cover_art" && !coverArt) {
                    coverArt = resource.url
                }
            }
            setCoverArt(coverArt)

            let lyrics = await smule.fetchLyrics(midiUrl)
            setLyrics(lyrics)

            setLoading(false)
        })
    }, [params])

    useEffect(() => {
        const audioUpdate = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(audioUpdate)
            }
        }
        requestAnimationFrame(audioUpdate)
    }, [loading])

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-row justify-center items-center h-full min-h-fit">
            {loading ? <LoadingTemplate/> :
            <>
                <div className="flex flex-col items-center gap-4 left-side-player">
                    <img src={coverArt} className="rounded-md max-w-xs aspect-square"/>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl">{songTitle}</h1>
                        <p className="text-md">{songArtist}</p>
                    </div>
                </div>
                <Lyrics lyrics={lyrics} audioTime={audioTime} part={params.part} pause={()=>{}} resume={()=>{}} setTime={()=>{}} />
                <div className="flex flex-col gap-8 right-side-player items-center justify-center">
                    <h1>u sang gr8</h1>
                    <audio ref={audioRef} src={url} controls onPlay={() => {
                        if (!bgAudioRef.current) return
                        bgAudioRef.current.currentTime = audioRef.current.currentTime
                        bgAudioRef.current.play()
                    }} onPause={() => {
                        if (!bgAudioRef.current) return
                        bgAudioRef.current.pause()
                    }} />
                </div>
            </>
            }
            </PaddedBody>
        </>
    )
}