import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router"
import { SDCArr } from "smule.js"

export default function UploadMP3SubPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const [selected, setSelected] = useState(null as string)
    const [selectedFileBuffer, setSelectedFileBuffer] = useState(null as ArrayBuffer)
    const [uploading, setUploading] = useState(false)
    const [_, setCurrentArr] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]

    useEffect(() => {
        // Load if we have an arr
        if (location.state != null && location.state.arr != null) {
            setUploading(true)
            setSelected(null)
            setSelectedFileBuffer(null)
            smuleDotCom.fetchArrUploadData(location.state.arr).then((arr) => arr).then(arr => {
                setCurrentArr({
                    ...arr.song.arrangement,
                    lyrics: {
                        ...arr.song.arrangement.lyrics,
                        lines: [
                            {text: "(Intro)", ts: 0, part: "", group_parts: []}, // Need to be added so that it doesnt get cropped by smule
                            ...arr.song.arrangement.lyrics.lines
                        ]
                    }
                })
                navigate("/create-arr/customize")
            })
        }
    }, [location])

    const uploadMp3 = useCallback(async () => {
        if (selectedFileBuffer) {
            setUploading(true)
            const arr = await smuleDotCom.createArrangement(new Uint8Array(selectedFileBuffer))
            setCurrentArr({
                ...arr,
                lyrics: {
                    ...arr.lyrics,
                    lines: [
                        {text: "(Intro)", ts: 0, part: "", group_parts: []}, // Need to be added so that it doesnt get cropped by smule
                        ...arr.lyrics.lines
                    ]
                }
            })
            setUploading(false)
            navigate("/create-arr/customize")
        }
    }, [selectedFileBuffer])

    return (
        <div className="flex flex-col gap-2 items-center">
            <audio src={selected} controls></audio>
            <input type="file" accept="audio/mpeg" onChange={async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    setUploading(true)
                    setSelected(URL.createObjectURL(e.target.files[0]))
                    setSelectedFileBuffer(await e.target.files[0].arrayBuffer())
                    setUploading(false)
                }
            }}/>
            <button disabled={uploading} onClick={uploadMp3} className="flex flex-row gap-1 items-center">Upload{uploading ? <>ing <Loader2 className="animate-spin"/></> : ""}</button>
        </div>
    )
}