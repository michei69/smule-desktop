import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import { SmuleMIDI } from "@/api/smule-midi";
import Lyrics from "../components/Lyrics";
import { AvTemplateLite } from "@/api/smule-types";
import { SmuleEffects } from "@/api/smule-effects";

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

    const [avTemplates, setAvTemplates] = useState([] as AvTemplateLite[])
    const [avTemplateUsed, setAvTemplateUsed] = useState({} as AvTemplateLite)
    const [loadedAvTemplate, setLoadedAvTemplate] = useState({} as SmuleEffects.AVFile)

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

            let avTemplates = await smule.fetchAvTemplates()
            setAvTemplates(avTemplates.recAvTemplateLites.map((x) => x.avtemplateLite))

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

    useEffect(() => {
        if (Object.keys(avTemplateUsed).length < 1) return
        storage.download(avTemplateUsed.mainResourceUrl).then(async filePath => {
            let avTmpl = await smule.processAvTemplateZip(filePath)
            console.log(avTmpl)
            setLoadedAvTemplate(avTmpl)
        })
    }, [avTemplateUsed])

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
                <div className="flex flex-col gap-8 items-center justify-center" style={{width: "25%"}}>
                    <h1>u sang gr8</h1>
                    <audio ref={audioRef} src={url} controls onPlay={() => {
                        if (!bgAudioRef.current) return
                        bgAudioRef.current.currentTime = audioRef.current.currentTime
                        bgAudioRef.current.play()
                    }} onPause={() => {
                        if (!bgAudioRef.current) return
                        bgAudioRef.current.pause()
                    }} />
                    <div className="flex flex-row gap-8 w-full overflow-scroll">
                    {Object.keys(loadedAvTemplate).length > 0 && loadedAvTemplate.template.parameters.map((param, idx) => 
                        <div className="flex flex-col w-32 items-center">
                            <input type="range" min={param.min_value} max={param.max_value} defaultValue={param.default_value} step="0.01" />
                            <p>{param.name}</p>
                        </div>
                    )}
                    </div>
                    <div className="flex flex-row gap-8 w-full overflow-scroll">
                    {avTemplates.map((template, idx) => 
                        <div className={`flex flex-col w-16 min-w-fit items-center ${avTemplateUsed.id == template.id ? "" : "brightness-60"}`} key={idx} onClick={() => {
                            setAvTemplateUsed(template)
                        }}>
                            <img src={template.imageUrl} className={`rounded-md w-16 aspect-square`} onClick={() => {
                                setAvTemplateUsed(template)
                            }}/>
                            <p>{template.name}</p>
                        </div>
                    )}
                    </div>
                </div>
            </>
            }
            </PaddedBody>
        </>
    )
}