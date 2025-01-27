import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Arr, ArrResult } from "../../api/smule-types";

export default function SongPage() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrResult)
    const [audioLink, setAudioLink] = useState("")

    useEffect(() => {
        smule.fetchSong(params.songId).then((res) => {
            setSong(res)
            for (let resource of res.arrVersion.origResources) {
                if (resource.role == "bg") {
                    storage.download(resource.url).then((url) => {
                        setAudioLink(url)
                        setLoading(false)
                    })
                    break
                }
            }
        })
    }, [])

    return (
        <>
        {
        loading ? <p>loading</p> :
            <div>
                <img src={song.arrVersion.arr.coverUrl} />
                <p>{song.arrVersion.arr.compTitle} - {song.arrVersion.arr.artist}</p>
                <p>{song.arrVersion.lyrics ? "Lyrics" : "No Lyrics"}</p>
                <audio controls src={audioLink} />
            </div>
        }
        </>
    )
}