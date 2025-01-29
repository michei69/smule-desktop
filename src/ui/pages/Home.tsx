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
    const navigate = useNavigate()

    useEffect(() => {
        storage.get<SmuleSession>("session").then((session) => {
            if (!SmuleUtil.checkLoggedIn(session)) navigate("/login")
        })
        
        smule.getSongbook().then((res: SongbookResult) => {
            setArrs(res.cat1Songs)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-col gap-4 max-w-7xl">
                {loading ? <LoadingTemplate/> : (
                    songs.map((song, index) => <ArrComponent key={index} arr={song.arrVersionLite} />)
                )}
            </PaddedBody>
        </>
    )
}