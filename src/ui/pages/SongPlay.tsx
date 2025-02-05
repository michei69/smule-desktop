import { useParams } from "react-router"
import { useEffect, useRef, useState } from "react"
import { Arr, ArrExtended } from "@/api/smule-types"
import { SmuleMIDI } from "@/api/smule"
import Navbar from "../components/Navbar"
import Lyrics from "../components/Lyrics"
import PaddedBody from "../components/PaddedBody"
import LoadingTemplate from "../components/LoadingTemplate"
import { Util } from "@/api/util"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Mic, Pause, Play, RefreshCw } from "lucide-react"
import cat from "/cat-jam.gif"
import PlayPageComponent from "../components/PlayPageComponent"

export default function SongPlay() {
    const params = useParams() as unknown as {type: "SOLO"|"DUET"|"GROUP", part: number, songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrExtended)
    const [songUrl, setSongUrl] = useState("")
    const [singingText, setSingingText] = useState(<></>)
    const [songTitle, setSongTitle] = useState("")
    const [songArtist, setSongArtist] = useState("")

    useEffect(() => {
        smule.fetchSong(params.songId).then(async ({ arrVersion }) => {
            setSong(arrVersion)

            if (params.type == "SOLO") {
                setSingingText(<>Singing alone</>)
            } else if (params.type == "DUET") {
                setSingingText(<>Singing in a duet</>)
            } else {
                setSingingText(<>Singing in a group</>)
            }

            let trackUrl = ""
            for (let resource of arrVersion.origResources) {
                if (resource.role == "bg") {
                    trackUrl = await storage.download(resource.url)
                }
            }
            for (let resource of arrVersion.normResources) {
                if (resource.role == "bg" && !trackUrl) {
                    trackUrl = await storage.download(resource.url)
                }
            }
            setSongUrl(trackUrl)
            
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

    return (
        <>
            {loading ? (
            <>
                <Navbar/>
                <LoadingTemplate/>
            </>
            ) :
            <PlayPageComponent 
                audioLink={songUrl} 
                arr={song} 
                singingText={singingText} 
                songTitle={songTitle} 
                songArtist={songArtist} 
                part={params.part}
            />
            }
        </>
    )
}