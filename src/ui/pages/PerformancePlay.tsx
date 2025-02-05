import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { ArrExtended, PerformanceIcon } from "@/api/smule-types"
import LoadingTemplate from "../components/LoadingTemplate"
import PlayPageComponent from "../components/PlayPageComponent"
import Navbar from "../components/Navbar"
import MiniUser from "../components/MiniUser"

// TODO: better playback
export default function PerformancePlay() {
    const params = useParams() as unknown as {performanceId: string}
    const [loading, setLoading] = useState(true)
    const [performance, setPerformance] = useState({} as PerformanceIcon)
    const [arr, setArr] = useState({} as ArrExtended)
    const [songUrl, setSongUrl] = useState("")
    const [singingText, setSingingText] = useState(<></>)


    useEffect(() => {
        smule.fetchPerformance(params.performanceId).then(async ({ performance }) => {
            setPerformance(performance)

            if (performance.ensembleType == "SOLO") {
                setSingingText(<>Singing alone</>)
            } else if (performance.ensembleType == "DUET" && performance.totalPerformers == 1) {
                setSingingText(<>
                    <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                        Singing together with 
                        <div className="w-1"/>
                        <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                            <MiniUser account={performance.accountIcon}/>
                        </div>
                    </div>
                </>)
            } else {
                setSingingText(
                <>
                <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                Singing together with
                <div className="w-1"/>
                {
                    performance.recentTracks.map((track, i) => {
                        return <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                            <MiniUser key={i} account={track.accountIcon}/>
                            <div className="w-1"/>
                        </div>
                    })
                }
                </div>
                </>
                )
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
