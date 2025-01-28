import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Arr, ArrResult } from "../../api/smule-types";
import { SmuleMIDI } from "../../api/smule";
import Lyrics from "../components/Lyrics";

export default function SongPage() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrResult)
    const [audioLink, setAudioLink] = useState("")
    const [lyrics, setLyrics] = useState([] as SmuleMIDI.SmuleLyrics[])
    const [audioTime, setAudioTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        smule.fetchSong(params.songId).then(async (res) => {
            setSong(res)
            for (let resource of res.arrVersion.origResources) {
                if (resource.role == "bg") {
                    let url = await storage.download(resource.url)
                    setAudioLink(url)
                }
            }
            for (let resource of res.arrVersion.normResources) {
                if (resource.role == "main") {
                    let url = await storage.download(resource.url)
                    let lyric = await smule.fetchLyrics(url)
                    setLyrics(lyric)
                }
            }
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        const updateAudioTime = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(updateAudioTime)
            }
        }
        requestAnimationFrame(updateAudioTime)
    }, [loading])

    return (
        <>
        {
        loading ? <p>loading</p> :
            <div>
                <img src={song.arrVersion.arr.coverUrl} />
                <p>{song.arrVersion.arr.compTitle} - {song.arrVersion.arr.artist}</p>
                <p>{song.arrVersion.lyrics ? "Lyrics" : "No Lyrics"}</p>
                <audio ref={audioRef} controls src={audioLink} />
                <Lyrics lyrics={lyrics} audioTime={audioTime} />
            </div>
        }
        </>
    )
}
