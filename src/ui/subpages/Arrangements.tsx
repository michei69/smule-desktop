import { useCallback, useEffect, useState } from "react"
import LoadingTemplate from "../components/LoadingTemplate"
import { Arr } from "smule.js"
import ArrComponent from "../components/Arr"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router"

export default function ArrangementsSubPage() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [songs, setSongs] = useState([] as Arr[])
    const [hasMoreSongs, setHasMoreSongs] = useState(true)
    const [next, setNext] = useState(-1)
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        smule.account.fetchSelf().then(async ({ profile }) => {
            const res = await smule.songs.fetchOwnedBy(profile.accountIcon.accountId)
            console.log(res)
            setSongs(res.arrVersionLites)
            setHasMoreSongs(res.next != -1)
            setNext(res.next)
            setLoading(false)
        })
    }, [])

    const loadMore = useCallback(async () => {
        setLoadingMore(true)
        const res = await smule.songs.fetchOwnedBy(next)
        setSongs([...songs, ...res.arrVersionLites])
        setHasMoreSongs(res.next != -1)
        setNext(res.next)
        setLoadingMore(false)
    }, [next])

    return (
        <>{loading ? <LoadingTemplate/> : 
        <div className="flex flex-col gap-8">
            <button onClick={() => navigate("/create-arr")}>Create new arrangement</button>
            <div className="flex flex-col gap-4 max-w-7xl">
                {songs.map((song, index) => <ArrComponent key={index} arr={song} />)}
                {hasMoreSongs ? 
                <button onClick={loadMore} disabled={loadingMore || loading}>
                    {loadingMore || loading ? <Loader2 className="animate-spin mr-2"/> : ""}
                    Load{loadingMore || loading ? "ing" : ""} more
                </button> : "No more arrangements..."}
            </div>
        </div>}</>
    )
}