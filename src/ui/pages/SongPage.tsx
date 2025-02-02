import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router";
import { Arr, ArrResult, PerformanceIcon, PerformanceReq, PerformancesFillStatus, PerformancesSortOrder } from "../../api/smule-types";
import LoadingTemplate from "../components/LoadingTemplate";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import PerformanceComponent from "../components/Performance";
import PaddedBody from "../components/PaddedBody";

export default function SongPage() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrResult)
    const [songTitle, setSongTitle] = useState("")
    const [songArtist, setSongArtist] = useState("")
    const [coverArt, setCoverArt] = useState("")

    const [loadingPerformances, setLoadingPerformances] = useState(true)
    const [loadingRecordings, setLoadingRecordings] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])
    const [recordings, setRecordings] = useState([] as PerformanceIcon[])

    const [cursorRecordings, setCursorRecordings] = useState("start")
    const [nextCursorRecordings, setNextCursorRecordings] = useState("")
    const [hasMoreRecordings, setHasMoreRecordings] = useState(true)

    useEffect(() => {
        smule.fetchSong(params.songId).then(async (res) => {
            setSong(res)

            setSongTitle(
                res.arrVersion.arr.composition ? res.arrVersion.arr.composition.title :
                res.arrVersion.arr.name ??
                res.arrVersion.arr.compTitle
            )
            setSongArtist(
                res.arrVersion.arr.composition ? res.arrVersion.arr.composition.artist :
                res.arrVersion.arr.artist
            )

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

    useEffect(() => {
        if (!song || !song.arrVersion) return
        setLoadingRecordings(true)
        smule.searchSpecific(songTitle, "RECORDING", "POPULAR", cursorRecordings, 10).then(res => {
                setRecordings(recordings.concat(res.recs))
                setHasMoreRecordings(res.cursor.hasNext)
                setNextCursorRecordings(res.cursor.next)
                setLoadingRecordings(false)
            })
    }, [cursorRecordings, loading])

    return (
        <>
            <Navbar/>
            {
            loading ? <LoadingTemplate/> :
                <PaddedBody className="flex flex-col gap-4 items-center justify-center mt-8">
                    <img src={coverArt} className="rounded-md"/>
                    <h1>
                        {songTitle} - {songArtist}
                    </h1>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Link to={"/play/SOLO/0/" + params.songId} className="link-button">Solo</Link>
                        <Link to={"/duet-select/" + params.songId} className="link-button">Duet</Link>
                        {/* Do groups have to choose their side? i forgot */}
                        <Link to={"/play/GROUP/0/" + params.songId} className="link-button">Group</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="card rounded-xl">
                            <h1>Performances</h1>
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
                        <div className="card rounded-xl">
                            <h1>Recordings</h1>
                            <div className="flex flex-col gap-4">
                            {
                            loadingRecordings ? <LoadingTemplate/> : 
                            <>
                            {recordings.length > 0 ? (
                                recordings.map((performance, index) => 
                                    <PerformanceComponent performance={performance} key={index}/>
                                )
                            ) : (
                                <p>No recordings available</p>
                            )}
                            {hasMoreRecordings ? <Button disabled={loadingRecordings} onClick={() => setCursorRecordings(nextCursorRecordings)}>
                                {loadingRecordings ? "Loading..." : "Load more"}
                            </Button> : ""}
                            </>
                            }
                            </div>
                        </div>
                    </div>
                </PaddedBody>
            }
        </>
    )
}
