import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import { SDCArr } from "smule.js"

export function SegmentsSubPage() {
    const navigate = useNavigate()

    const [generated, setGenerated] = useState(false)
    const [arr, setArr] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]
    const [generating, setGenerating] = useState(false)

    return (
        <>
            <h1>area under construction</h1>
            <button disabled={generating || generated} onClick={async () => {
                setGenerating(true)
                const segments = await smuleDotCom.generateSegments({
                    ...arr,
                    coverUrl: {
                        ...arr.coverUrl,
                        url: ""
                    }
                })
                console.log(segments)
                setArr({
                    ...arr,
                    segments: segments.segments.map(segment => ({
                        ...segment,
                        climax: false
                    })),
                    segProcessVer: segments.segProcessVer
                })
                setGenerated(true)
                setGenerating(false)
            }} className="flex flex-row gap-1 items-center">autogenerate {generating ? <Loader2 className="w-4 animate-spin"/> : ""}</button>
            <button disabled={!generated} onClick={() => navigate("/create-arr/publish")}>next</button>
        </>
    )
}