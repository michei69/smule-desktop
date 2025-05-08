import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import PaddedBody from "../components/PaddedBody"
import Navbar from "../components/Navbar"
import { Arr, PerformanceIcon, SearchResult } from "@/api/smule-types"
import ArrComponent from "../components/Arr"
import PerformanceComponent from "../components/Performance"
import { Button } from "@/components/ui/button"

export default function Search() {
    let params = useParams() as unknown as {query: string}
    const [loading, setLoading] = useState(true)
    const [searchResults, setSearchResults] = useState({} as SearchResult)

    const [loadingSongs, setLoadingSongs] = useState(false)
    const [cursorSongs, setCursorSongs] = useState("start")
    const [nextCursorSongs, setNextCursorSongs] = useState("")
    const [hasMoreSongs, setHasMoreSongs] = useState(true)
    const [songs, setSongs] = useState([] as Arr[])

    const [loadingPerfs, setLoadingPerfs] = useState(false)
    const [cursorPerfs, setCursorPerfs] = useState("start")
    const [nextCursorPerfs, setNextCursorPerfs] = useState("")
    const [hasMorePerfs, setHasMorePerfs] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])

    const [loadingRecs, setLoadingRecs] = useState(false)
    const [cursorRecs, setCursorRecs] = useState("start")
    const [nextCursorRecs, setNextCursorRecs] = useState("")
    const [hasMoreRecs, setHasMoreRecs] = useState(true)
    const [recordings, setRecordings] = useState([] as PerformanceIcon[])

    useEffect(() => {
        setLoading(true)
        smule.search.perform(params.query).then(res => {
            setSearchResults(res)
            setSongs(res.songs.map(song => song.arrangementVersionLite))
            setPerformances(res.seeds)
            setLoading(false)
        })
    }, [params])

    useEffect(() => {
        if (!cursorSongs) return
        setLoadingSongs(true)
        smule.search.performSpecific(params.query, "SONG", "POPULAR", cursorSongs).then(res => {
            if (cursorSongs == "start") {
                setSongs(res.songs.map(song => song.arrangementVersionLite))
            } else {
                setSongs(songs.concat(res.songs.map(song => song.arrangementVersionLite)))
            }
            setHasMoreSongs(res.cursor.hasNext)
            setNextCursorSongs(res.cursor.next)
            setLoadingSongs(false)
        })
    }, [cursorSongs])

    useEffect(() => {
        if (!cursorPerfs) return
        setLoadingPerfs(true)
        smule.search.performSpecific(params.query, "ACTIVESEED", "POPULAR", cursorPerfs).then(res => {
            if (cursorPerfs == "start") {
                setPerformances(res.seeds)
            } else {
                setPerformances(performances.concat(res.seeds))
            }
            setHasMorePerfs(res.cursor.hasNext)
            setNextCursorPerfs(res.cursor.next)
            setLoadingPerfs(false)
        })
    }, [cursorPerfs])

    useEffect(() => {
        if (!cursorRecs) return
        setLoadingRecs(true)
        smule.search.performSpecific(params.query, "RECORDING", "POPULAR", cursorRecs).then(res => {
            if (cursorRecs == "start") {
                setRecordings(res.recs)
            } else {
                setRecordings(recordings.concat(res.recs))
            }
            setHasMoreRecs(res.cursor.hasNext)
            setNextCursorRecs(res.cursor.next)
            setLoadingRecs(false)
        })
    }, [cursorRecs])

    return (
        <>
        <Navbar params={params}/>
        {loading ? <LoadingTemplate/> :
        <PaddedBody className="flex flex-col gap-4">
            <section className="card rounded-xl">
                <h1>songs</h1>
                {songs.map((song, idx) => {
                    return <ArrComponent key={idx} arr={song}/>
                })}
                {
                hasMoreSongs ? 
                    <Button onClick={() => {
                        nextCursorSongs ? setCursorSongs(nextCursorSongs) : setCursorSongs("start")
                    }} disabled={loadingSongs}>
                        {loadingSongs ? <LoadingTemplate/> : "Load more"}
                    </Button> 
                : <p>no more</p>
                }
            </section>
            <section className="card rounded-xl">
                <h1>performances</h1>
                {performances.map((performance, idx) => {
                    return <PerformanceComponent performance={performance} key={idx}/>
                })}
                {hasMorePerfs ? 
                    <Button onClick={() => {
                        nextCursorPerfs ? setCursorPerfs(nextCursorPerfs) : setCursorPerfs("start")
                    }} disabled={loadingPerfs}>
                        {loadingPerfs ? <LoadingTemplate/> : "Load more"}
                    </Button>
                : <p>no more</p>
                }
            </section>
            <section className="card rounded-xl">
                <h1>recordings</h1>
                {recordings.map((performance, idx) => {
                    return <PerformanceComponent performance={performance} key={idx}/>
                })}
                {hasMoreRecs ?
                    <Button onClick={() => {
                        nextCursorRecs ? setCursorRecs(nextCursorRecs) : setCursorRecs("start")
                    }} disabled={loadingRecs}>
                        {loadingRecs ? <LoadingTemplate/> : "Load more"}
                    </Button>
                : <p>no more</p>
                }
            </section>
        </PaddedBody>
        }    
        </>
    )
}