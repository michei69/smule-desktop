import { ArrExtended } from "@/api/smule-types"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import Navbar from "../components/Navbar"
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
        smule.songs.fetchOne(params.songId).then(async ({ arrVersion }) => {
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
                    trackUrl = resource.url
                }
            }
            for (let resource of arrVersion.normResources) {
                if (resource.role == "bg" && !trackUrl) {
                    trackUrl = resource.url
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