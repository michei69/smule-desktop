import { SmuleMidiData } from "smule.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PaddedBody from "../components/PaddedBody";
import LoadingTemplate from "../components/LoadingTemplate";
import Lyrics from "../components/Lyrics";

export default function DuetSelect() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [lyrics, setLyrics] = useState({} as SmuleMidiData)
    
    useEffect(() => {
        smule.songs.fetchLyricsAndPitches(params.songId).then(data => {
            setLyrics(data as SmuleMidiData)
            setLoading(false)
        })
    }, [])

    return (
        <PaddedBody className="flex flex-col justify-center items-center h-full min-h-fit">
        {loading ? <LoadingTemplate/> :(
        <>
            <h1>choose which part you'd like to sing (blue = 1, gray = 2, yellow = both)</h1>
            <div className="flex flex-row gap-4 mt-8">
                <Link to={"/play/DUET/1/" + params.songId} className="link-button">part 1</Link>
                <Link to={"/play/DUET/2/" + params.songId} className="link-button">part 2</Link>
                <Link to={"/play/DUET/3/" + params.songId} className="link-button">both</Link>
            </div>
            <Lyrics lyrics={lyrics} audioTime={0} part={1} pause={() => {}} resume={() => {}} setTime={() => {}} preview={true}/>
        </>
        )}
        </PaddedBody>
    )
}