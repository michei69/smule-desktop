import { SmuleMIDI } from "@/api/smule";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import PaddedBody from "../components/PaddedBody";
import LoadingTemplate from "../components/LoadingTemplate";
import Lyrics from "../components/Lyrics";

export default function DuetSelect() {
    const params = useParams() as unknown as {songId: string}
    const [loading, setLoading] = useState(true)
    const [lyrics, setLyrics] = useState({} as SmuleMIDI.SmuleMidiData)
    
    useEffect(() => {
        smule.fetchSong(params.songId).then(async ({ arrVersion }) => {
            let midiUrl = ""
            for (let resource of arrVersion.origResources) {
                if (resource.role == "midi") {
                    midiUrl = await storage.download(resource.url)
                }
            }
            for (let resource of arrVersion.normResources) {
                if (resource.role == "midi" && !midiUrl) {
                    midiUrl = await storage.download(resource.url)
                }
            }
            setLyrics(await smule.fetchLyrics(midiUrl))
            setLoading(false)
        })
    }, [])

    return (
        <>
            <Navbar/>
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
        </>
    )
}