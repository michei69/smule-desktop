import { ArrExtended, EnsembleType, SmuleUtil } from "smule.js"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import Navbar from "../components/Navbar"
import PlayPageComponent from "../components/PlayPageComponent"

export default function SongPlay() {
    const params = useParams() as unknown as {type: EnsembleType, part: number, songId: string}
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

            const songData = SmuleUtil.getFilesFromArr(arrVersion)
            setSongUrl(songData.song_file || songData.song_file_original)
            
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
                <LoadingTemplate/>
            ) :
            <PlayPageComponent 
                audioLink={songUrl} 
                arr={song} 
                singingText={singingText} 
                songTitle={songTitle} 
                songArtist={songArtist} 
                part={params.part}
                ensembleType={params.type}
            />
            }
        </>
    )
}