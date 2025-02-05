import { useEffect, useState } from "react"
import { SmuleSession, Song, SongbookResult } from "../../api/smule-types"
import { useNavigate } from "react-router"
import { SmuleUtil } from "../../api/util"
import ArrComponent from "../components/Arr"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import LoadingTemplate from "../components/LoadingTemplate"

export default function Home() {
    const [songs, setArrs] = useState([] as Song[])
    const [loading, setLoading] = useState(true)
    const [cursor, setCursor] = useState("start")
    const [hasMoreSongs, setHasMoreSongs] = useState(true)
    const [category, setCategory] = useState(0)
    const [categoryHasSongs, setCategoryHasSongs] = useState(true)
    const [categoriesUnchecked, setCategoriesUnchecked] = useState([] as number[])
    const [loadingAttempt, setLoadingAttempt] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        storage.get<SmuleSession>("session").then((session) => {
            if (!SmuleUtil.checkLoggedIn(session)) navigate("/login")    
            smule.getSongbook("start", 25).then(async (res: SongbookResult) => {
                if (!res) {
                    if (!session.isGuest)
                        await smule.refreshLogin()
                    if (loadingAttempt > 5) return await smule.logout(navigate)
                    setLoadingAttempt(loadingAttempt + 1)
                    return
                }
                setCategoriesUnchecked(res.categories.map(cat => cat.id))
                setArrs(res.cat1Songs)
                setCursor(res.cat1Cursor.next)
                setHasMoreSongs(res.cat1Cursor.hasNext)
                setLoading(false)
            })
        })
    }, [loadingAttempt])
    
    
    const handleScroll = () => {
        if (loading || !hasMoreSongs && !categoryHasSongs && categoriesUnchecked.length < 1) return
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            if (hasMoreSongs) {
                smule.getSongbook(cursor, 25).then((res: SongbookResult) => {
                    setArrs(songs.concat(res.cat1Songs))
                    setHasMoreSongs(res.cat1Cursor.hasNext)
                    setCursor(res.cat1Cursor.next)
                    if (!res.cat1Cursor.hasNext) {
                        setCategory(categoriesUnchecked.shift()!)
                        setCategoryHasSongs(true)
                    }
                })
            } else {
                if (!categoryHasSongs) {
                    setCategory(categoriesUnchecked.shift()!)
                    setCategoryHasSongs(true)
                    setCursor("start")
                } else {
                    smule.getSongsFromCategory(cursor, category, 25).then(res => {
                        setArrs(songs.concat(res.songs))
                        setHasMoreSongs(res.cursor.hasNext)
                        setCursor(res.cursor.next)
                        if (!res.cursor.hasNext) {
                            setCategory(categoriesUnchecked.shift()!)
                            setCategoryHasSongs(true)
                        }
                    })
                }
            }
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
                    {hasMoreSongs || categoryHasSongs ? <LoadingTemplate/> : "End..."}
                </>
                }
            </PaddedBody>
        </>
    )
}