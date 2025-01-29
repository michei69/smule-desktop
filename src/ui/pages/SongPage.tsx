import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Arr, ArrResult, PerformanceIcon, PerformanceReq, PerformancesFillStatus, PerformancesSortOrder } from "../../api/smule-types";
import { SmuleMIDI } from "../../api/smule";
import Lyrics from "../components/Lyrics";
import { Loader2 } from "lucide-react";
import LoadingTemplate from "../components/LoadingTemplate";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import PerformanceComponent from "../components/Performance";

export default function SongPage() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrResult)
    const [coverArt, setCoverArt] = useState("")

    const [loadingPerformances, setLoadingPerformances] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])

    // const [audioLink, setAudioLink] = useState("")
    // const [lyrics, setLyrics] = useState([] as SmuleMIDI.SmuleLyrics[])
    // const [audioTime, setAudioTime] = useState(0)
    // const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        smule.fetchSong(params.songId).then(async (res) => {
            setSong(res)
            for (let resource of res.arrVersion.normResources) {
                if (coverArt) break;
                if (resource.role == "cover_art") {
                    let url = await storage.download(resource.url)
                    setCoverArt(url)
                }
            }
            for (let resource of res.arrVersion.normResources) {
                if (coverArt) break;
                if (resource.role == "cover") {
                    let url = await storage.download(resource.url)
                    setCoverArt(url)
                }
            }
            setLoading(false)

            smule.requestListsOfPerformances([
                new PerformanceReq(res.arrVersion.arr.key, PerformancesSortOrder.RECENT, PerformancesFillStatus.SEED),
                new PerformanceReq(res.arrVersion.arr.key, PerformancesSortOrder.HOT, PerformancesFillStatus.ACTIVESEED)
            ]).then((res) => {
                for (let performanceList of res.perfLists) {
                    setPerformances([
                        ...performances,
                        ...performanceList.performanceIcons
                    ])
                }
                setLoadingPerformances(false)
            })
        })
    }, [])

    // useEffect(() => {
    //     const updateAudioTime = () => {
    //         if (audioRef.current) {
    //             setAudioTime(audioRef.current.currentTime)
    //             requestAnimationFrame(updateAudioTime)
    //         }
    //     }
    //     requestAnimationFrame(updateAudioTime)
    // }, [loading])

    return (
        <>
            <Navbar/>
            {
            loading ? <LoadingTemplate/> :
                <div className="flex flex-col gap-4 items-center justify-center mt-8">
                    <img src={coverArt} className="rounded-md"/>
                    <h1>
                        {
                            song.arrVersion.arr.composition ? song.arrVersion.arr.composition.title :
                            song.arrVersion.arr.name ??
                            song.arrVersion.arr.compTitle
                        } - {
                            song.arrVersion.arr.composition ? song.arrVersion.arr.composition.artist :
                            song.arrVersion.arr.artist}
                    </h1>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Button>Duet</Button>
                        <Button>Group</Button>
                        <Button>Solo</Button>
                    </div>
                    <div className="flex flex-col gap-4">
                    {
                    loadingPerformances ? <LoadingTemplate/> : 
                    <>
                    {performances.length > 0 ? (
                        performances.map((performance, index) => 
                            <PerformanceComponent performance={performance} key={index}/>
                        )
                    ) : (
                        <p>No performances available</p>
                    )}
                    </>
                    }
                    </div>
                </div>
            }
        </>
    )
}
