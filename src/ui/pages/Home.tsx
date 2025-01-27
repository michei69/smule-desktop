import { Suspense, useEffect, useState } from "react"
import { Arr, SmuleSession, Song, SongbookResult } from "../../api/smule-types"
import { useNavigate } from "react-router"
import { SmuleUtil } from "../../api/util"
import ArrComponent from "../components/Arr"

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
            <h1>helloo</h1>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    songs.map((song, index) => <ArrComponent key={index} arr={song.arrVersionLite} />)
                )}
            </div>
        </>
    )
}