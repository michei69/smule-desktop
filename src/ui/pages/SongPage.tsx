import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrResult, PerformanceIcon, PerformanceReq, PerformancesFillStatus, PerformancesSortOrder } from "../../api/smule-types";
import LoadingTemplate from "../components/LoadingTemplate";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import PerformanceComponent from "../components/Performance";
import PaddedBody from "../components/PaddedBody";
import { Util } from "@/api/util";
import { AlignEndHorizontal, ExternalLink, Hourglass, Languages, Loader2, MicVocal, ThumbsUp, Users } from "lucide-react";
import MiniUser from "../components/MiniUser";
import Settings from "@/lib/settings";

export default function SongPage() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState({} as ArrResult)
    const [songTitle, setSongTitle] = useState("")
    const [songArtist, setSongArtist] = useState("")
    const [coverArt, setCoverArt] = useState("")
    const [songUrl, setSongUrl] = useState("")

    const [loadingPerformances, setLoadingPerformances] = useState(true)
    const [loadingRecordings, setLoadingRecordings] = useState(true)
    const [loadingRecordings2, setLoadingRecordings2] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])
    const [recordings, setRecordings] = useState([] as PerformanceIcon[])

    const [cursorRecordings, setCursorRecordings] = useState("start")
    const [nextCursorRecordings, setNextCursorRecordings] = useState("")
    const [hasMoreRecordings, setHasMoreRecordings] = useState(true)

    useEffect(() => {
        setLoading(true)
        smule.fetchSong(params.songId).then(async (res) => {
            setSong(res)

            if (Settings.get().developerMode)
                console.log(res)

            setSongTitle(
                res.arrVersion.arr.composition ? res.arrVersion.arr.composition.title :
                res.arrVersion.arr.compTitle ??
                res.arrVersion.arr.name 
            )
            setSongArtist(
                res.arrVersion.arr.composition ? res.arrVersion.arr.composition.artist :
                res.arrVersion.arr.artist
            )

            let coverUrl = ""
            let songUrl = ""
            for (let resource of res.arrVersion.normResources) {
                if (resource.role.includes("cover_art")) {
                    coverUrl = resource.url
                } else if (resource.role.includes("background")) {
                    songUrl = resource.url
                }
            }
            setSongUrl(songUrl)
            for (let resource of res.arrVersion.origResources) {
                if (!coverUrl && resource.role.includes("cover")) {
                    coverUrl = resource.url
                } else if (songUrl && resource.role.includes("bg")) {
                    
                }
            }
            setCoverArt(coverUrl)

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
    }, [params])

    useEffect(() => {
        if (!song || !song.arrVersion) return
        setLoadingRecordings2(true)
        smule.searchSpecific(songTitle, "RECORDING", "POPULAR", cursorRecordings, 10).then(res => {
                setRecordings(recordings.concat(res.recs))
                setHasMoreRecordings(res.cursor.hasNext)
                setNextCursorRecordings(res.cursor.next)
                setLoadingRecordings2(false)
                setLoadingRecordings(false)
            })
    }, [cursorRecordings, loading])

    return (
        <>
            <Navbar params={params}/>
            {
            loading ? <LoadingTemplate/> :
                <PaddedBody className="flex flex-col gap-4 items-center justify-center mt-8">
                    <img src={coverArt} className="rounded-md"/>
                    <h1 className="text-2xl font-bold">
                        {songTitle} - {songArtist}
                    </h1>
                    <p className="flex flex-row items-center justify-center gap-1">
                        Uploaded by
                        <div className="w-1"></div>
                        <MiniUser account={song.arrVersion.arr.ownerAccountIcon} verified={song.arrVersion.arr.smuleOwned}/>
                    </p>
                    <audio src={songUrl} controls/>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        {
                        Number.isNaN(Math.floor(song.arrVersion.arr.rating*100)) ? "" :
                        <p className="flex flex-row gap-1">
                            <ThumbsUp className="w-4"/>
                            {Math.floor(song.arrVersion.arr.rating*100)}%
                        </p>
                        }
                        <p className="flex flex-row gap-1">
                            <Languages className="w-4"/>
                            {new Intl.DisplayNames(['en'], {type: "language"}).of(song.arrVersion.arr.langId)}
                        </p>
                        {song.arrVersion.lyrics ? (
                            <p className="flex flex-row gap-1">
                                <MicVocal className="w-4"/>
                                Lyrics
                            </p>
                        ) : ""}
                        {song.arrVersion.pitchTrack ? (
                            <p className="flex flex-row gap-1">
                                <AlignEndHorizontal className="w-4"/>
                                Pitch
                            </p>
                        ) : ""}
                        <p className="flex flex-row gap-1">
                            <Hourglass className="w-4"/>
                            {Util.formatTime(song.arrVersion.length * 1000)}
                        </p>
                        {song.arrVersion.groupParts ? (
                            <p className="flex flex-row gap-1">
                                <Users className="w-4"/>
                                Group
                            </p>
                        ) : ""}
                        <p className="flex flex-row gap-1 fakelink username" onClick={() => openExternalLink(song.arrVersion.arr.webUrl)} title={song.arrVersion.arr.webUrl}>
                            <ExternalLink className="w-4"/>
                            Link
                        </p>
                    </div>
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
                            {hasMoreRecordings ? <Button disabled={loadingRecordings2} onClick={() => setCursorRecordings(nextCursorRecordings)}>
                                {loadingRecordings2 ? (<>
                                    <Loader2 className="animate-spin"/>
                                    Loading...
                                </>) : "Load more"}
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
