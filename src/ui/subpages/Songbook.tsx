import { SmuleSession, Song, SongbookResult, SmuleUtil } from "smule.js";
import LoadingTemplate from "../components/LoadingTemplate";
import ArrComponent from "../components/Arr";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Songbook() {
    const navigate = useNavigate()
    const [songs, setArrs] = useState([] as Song[])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [cursor, setCursor] = useState("start")
    const [hasMoreSongs, setHasMoreSongs] = useState(true)
    const [category, setCategory] = useState(0)
    const [categoryHasSongs, setCategoryHasSongs] = useState(true)
    const [categoriesUnchecked, setCategoriesUnchecked] = useState([] as number[])
    const [loadingAttempt, setLoadingAttempt] = useState(0)

    
    useEffect(() => {
        storage.get<SmuleSession>("session").then((session) => {
            if (!SmuleUtil.checkLoggedIn(session)) return navigate("/login")    
            smule.songs.fetchSongbook("start", 25).then(async (res: SongbookResult) => {
                if (!res) {
                    if (!session.isGuest)
                        await smule.account.refreshLogin()
                    if (loadingAttempt > 5) {
                        await extra.logout()
                        navigate("/logout")
                    }
                    setLoadingAttempt(loadingAttempt + 1)
                    return
                }
                setCategoriesUnchecked(res.categories.map(cat => cat.id).slice(1)) // removing first category because thats what cat1 stands for in cat1Songs
                setArrs(res.cat1Songs)
                setCursor(res.cat1Cursor.next)
                setHasMoreSongs(res.cat1Cursor.hasNext)
                setLoading(false)
            })
        })
    }, [loadingAttempt])
    
    const loadMoreSongs = useCallback(async () => {
        setLoadingMore(true)
        console.log(hasMoreSongs, categoryHasSongs, categoriesUnchecked.length, category, cursor, songs.length)
        if (!hasMoreSongs) {
            if (!categoryHasSongs) {
                if (categoriesUnchecked.length < 1) {
                    return
                }
                setCategory(categoriesUnchecked.shift())
                setCategoryHasSongs(true)
                setCursor("start")
                return await loadMoreSongs()
            } else {
                const res = await smule.songs.fetchFromCategory(cursor, category, 25)
                setArrs(songs.concat(res.songs))
                setCategoryHasSongs(res.cursor.hasNext)
                setCursor(res.cursor.next)
                console.log(cursor, res.cursor)
                if (!res.cursor.hasNext) {
                    if (categoriesUnchecked.length < 1) {
                        setHasMoreSongs(false)
                        return
                    }
                    setCategory(categoriesUnchecked.shift())
                    setCategoryHasSongs(true)
                    setCursor("start")
                }
            }
        } else {
            const res = await smule.songs.fetchSongbook(cursor, 25)
            setArrs(songs.concat(res.cat1Songs))
            setHasMoreSongs(res.cat1Cursor.hasNext)
            setCursor(res.cat1Cursor.next)
            console.log(cursor, res.cat1Cursor)
            if (!res.cat1Cursor.hasNext) {
                setCategory(categoriesUnchecked.shift())
                setCategoryHasSongs(true)
                setCursor("start")
            }
        }
        setLoadingMore(false)
    }, [songs, hasMoreSongs, cursor, categoriesUnchecked, categoryHasSongs])

    const handleScroll = () => {
        if (loading || !hasMoreSongs && !categoryHasSongs && categoriesUnchecked.length < 1) return
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            loadMoreSongs()
        }
    }
    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [songs])


    return (
        <div className="flex flex-col gap-4 max-w-7xl">
            {loading ? <LoadingTemplate/> : 
            <>
                {songs.map((song, index) => <ArrComponent key={index} arr={song.arrVersionLite} />)}
                {hasMoreSongs || categoryHasSongs ? 
                <button disabled={loadingMore} onClick={loadMoreSongs} className="flex flex-row gap-1 items-center justify-center">
                    {loadingMore && <Loader2 className="animate-spin" />}
                    Load{loadingMore ? "ing" : ""} more
                </button> : "End..."}
            </>
            }
        </div>
    )
}