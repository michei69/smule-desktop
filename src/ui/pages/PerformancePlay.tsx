import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { ArrExtended, PerformanceIcon } from "@/api/smule-types"
import LoadingTemplate from "../components/LoadingTemplate"
import PlayPageComponent from "../components/PlayPageComponent"
import Navbar from "../components/Navbar"

// TODO: better playback
export default function PerformancePlay() {
    const params = useParams() as unknown as {performanceId: string}
    const [loading, setLoading] = useState(true)
    const [performance, setPerformance] = useState({} as PerformanceIcon)
    const [arr, setArr] = useState({} as ArrExtended)
    const [songUrl, setSongUrl] = useState("")
    const [singingText, setSingingText] = useState("")


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

            setArr(performance.arrVersion)

            let songUrl = await storage.download(performance.shortTermRenderedUrl)
            setSongUrl(songUrl)

            setLoading(false)
        })
    }, [])

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
            arr={arr} 
            singingText={singingText} 
            songTitle={performance.title} 
            songArtist={performance.artist} 
            part={performance.origTrackPartId == 1 ? 2 : !performance.origTrackPartId ? 3 : 1}
        />
        }
        </>
    )
}
