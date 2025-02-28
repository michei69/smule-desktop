import { PlaylistDetailed } from "@/api/smule-types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import PerformanceComponent from "../components/Performance"
import Settings from "@/lib/settings"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Explore() {
    const navigate = useNavigate()
    const [loadingPlaylists, setLoadingPlaylists] = useState(true)
    const [playlists, setPlaylists] = useState([] as PlaylistDetailed[])
    const [loadMoreForPlaylistId, setLoadMoreForPlaylistId] = useState(-1)
    const [doesntHaveMore, setDoesntHaveMore] = useState([] as number[])

    useEffect(() => {
        setLoadingPlaylists(true)
        smule.explorePlaylists().then((data) => {
            if (Settings.get().developerMode) console.log(data)
            setPlaylists(data.primary)
            setLoadingPlaylists(false)
        })
    }, [])

    useEffect(() => {
        if (loadMoreForPlaylistId == -1) return
        smule.fetchPlaylist(loadMoreForPlaylistId, playlists.find(p => p.playlist.id == loadMoreForPlaylistId)!.recPerformanceIcons.length).then((data) => {
            if (data.next == -1) setDoesntHaveMore([...doesntHaveMore, loadMoreForPlaylistId])
            setPlaylists(playlists.map(p => p.playlist.id == loadMoreForPlaylistId ? {...p, recPerformanceIcons: [...p.recPerformanceIcons, ...data.recPerformanceIcons]} : p))
            setLoadMoreForPlaylistId(-1)
        })
    }, [loadMoreForPlaylistId])

    return (
        <div>
            <div className="flex flex-col gap-4">
            {loadingPlaylists ? <LoadingTemplate/> :
            playlists.map((playlist, idx) => (
                <div className="card rounded-2xl flex flex-col items-center justify-center" key={idx}>
                    {playlist.playlist.imgUrl ? 
                        <img src={playlist.playlist.imgUrl} className="rounded-2xl w-64 aspect-square mb-2" />
                    : ""}
                    <h1 className="font-bold font-lg">{playlist.playlist.name}</h1>
                    <p className="font-normal mb-2">{playlist.playlist.message}</p>
                    <div>
                        {playlist.recPerformanceIcons.map((recPerformanceIcon, idx) => (
                            <PerformanceComponent performance={recPerformanceIcon.performanceIcon} key={idx} />
                        ))}
                        {!doesntHaveMore.includes(playlist.playlist.id) ?
                            <Button onClick={() => setLoadMoreForPlaylistId(playlist.playlist.id)} disabled={loadMoreForPlaylistId != -1}>
                                {loadMoreForPlaylistId == playlist.playlist.id ? <Loader2 className="animate-spin mr-2"/> : ""}
                                Load more
                            </Button>
                        : <p>No more</p>}
                    </div>
                </div>
            ))
            }
            </div>
        </div>
    )
}