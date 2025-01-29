import { Suspense, useEffect, useState } from "react"
import { AccountIcon, Arr, ProfileResult, SmuleSession, Song, SongbookResult } from "../../api/smule-types"
import { useNavigate } from "react-router"
import { SmuleUtil } from "../../api/util"
import ArrComponent from "../components/Arr"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import { Loader2 } from "lucide-react"
import LoadingTemplate from "../components/LoadingTemplate"

export default function Home() {
    const [songs, setArrs] = useState([] as Song[])
    const [loading, setLoading] = useState(true)
    const [cursor, setCursor] = useState("start")
    const [hasMoreSongs, setHasMoreSongs] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        storage.get<SmuleSession>("session").then((session) => {
            if (!SmuleUtil.checkLoggedIn(session)) navigate("/login")
        })
        
        smule.getSongbook("start", 25).then((res: SongbookResult) => {
            setArrs(res.cat1Songs)
            console.log(res.cat1Cursor)
            setCursor(res.cat1Cursor.next)
            setHasMoreSongs(res.cat1Cursor.hasNext)
            setLoading(false)
        })
    }, [])

    
    const handleScroll = () => {
        if (loading || !hasMoreSongs) return
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            smule.getSongbook(cursor, 25).then((res: SongbookResult) => {
                setArrs(songs.concat(res.cat1Songs))
                setHasMoreSongs(res.cat1Cursor.hasNext)
                setCursor(res.cat1Cursor.next)
            })
        }
    }
    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [songs])

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-col gap-4 max-w-7xl">
                {loading ? <LoadingTemplate/> : 
                <>
                    {songs.map((song, index) => <ArrComponent key={index} arr={song.arrVersionLite} />)}
                    {hasMoreSongs ? <LoadingTemplate/> : "End..."}
                </>
                }
            </PaddedBody>
        </>
    )
}