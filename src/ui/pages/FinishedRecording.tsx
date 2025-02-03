import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";

export default function FinishedRecording() {
    const params = useParams() as unknown as {songId: string, fileName: string}
    const [loading, setLoading] = useState(true)
    
    const [url, setUrl] = useState("")

    useEffect(() => {
        smule.getTMPDir().then((dir) => {
            setUrl(dir + "/" + params.fileName)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <Navbar/>
            <PaddedBody className="flex flex-row justify-center items-center h-full min-h-fit">
            {loading ? <LoadingTemplate/> :
            <>
                <audio src={url} controls />
            </>
            }
            </PaddedBody>
        </>
    )
}