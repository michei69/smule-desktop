import { useNavigate, useOutletContext } from "react-router";
import { SDCArr, SmuleMidiData, SmulePitchesData, SmuleUserSinging } from "smule.js";
import Lyrics from "../components/Lyrics";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PublishArrSubPage() {
    const navigate = useNavigate()

    const [arr, _] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]
    const [publishing, setPublishing] = useState(false)

    const lyrics = {
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
    } as SmuleMidiData

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [audioTime, setAudioTime] = useState(0)

    useEffect(() => {
        const audioUpdate = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(audioUpdate)
            }
        }
        requestAnimationFrame(audioUpdate)
    }, [])

    const publishArr = useCallback(async () => {
        setPublishing(true)
        arr.lyrics.id = null
        arr.lyrics.lyric_video_paragraphs = undefined
        arr.lyrics.group_parts_count = undefined
        console.log(arr)
        const req = await smuleDotCom.saveArr(arr)
        if (req.arrUpdated) {
            // waiting another second so the arrangement actually gets published
            await new Promise(resolve => setTimeout(resolve, 1000))
            navigate("/song/" + req.arr_key)
        }
        else alert("didnt save...1!!")
        setPublishing(false)
    }, [arr])

    return (
        <div className="flex flex-col">
            <div className="card rounded-2xl flex flex-row gap-4 items-center -mb-8">
                <img src={arr.coverUrl.url} className="rounded-xl aspect-square h-48 w-48" />
                <div className="flex flex-col gap-1">
                    <p className="text-xl text-left">{arr.title} - {arr.artist}</p>
                    <div className="flex flex-row items-center gap-2">
                        <label>Genre:</label>
                        <div className="flex flex-row items-center gap-2 flex-wrap">{arr.genres.map((genre, i) => 
                            <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i}>{genre.text}</span>
                        )}</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label>Tags:</label>
                        <div className="flex flex-row items-center gap-2 flex-wrap">{arr.tags.map((tag, i) => 
                            <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i}>{tag.text}</span>
                        )}</div>
                    </div>
                    <audio src={arr.audioData.url} ref={audioRef} controls className="mt-4" />
                </div>
            </div>
            <Lyrics lyrics={lyrics} audioTime={audioTime} avTmplSegments={[]} part={1} pause={() => {audioRef.current?.pause()}} resume={() => {audioRef.current?.play()}} setTime={(e) => {audioRef.current.currentTime = e}} preview={false} fill={true} dontScroll={true} />

            <button disabled={publishing} className="flex flex-row gap-1 items-center mt-16" onClick={publishArr}>Publish{publishing ? <>ing <Loader2 className="w-4 animate-spin"/></> : ""}</button>
        </div>
    )
}