import { PerformanceIcon } from "@/api/smule-types"
import { useEffect, useState } from "react"
import LoadingTemplate from "./LoadingTemplate"
import MiniUser from "./MiniUser"
import { ThumbsUp } from "lucide-react"
import { useNavigate } from "react-router"

export default function MiniPerformanceFromKey({ performanceKey }: { performanceKey: string }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [perf, setPerf] = useState({} as PerformanceIcon)

    useEffect(() => {
        smule.performances.lookUp.byKey(performanceKey).then((res) => {
            setPerf(res)
            setLoading(false)
        })
    }, [])

    return (
        <>
            {loading ? <LoadingTemplate /> : (
                <div className="flex flex-row card cute-border rounded-2xl items-center gap-2 cursor-pointer" onClick={() => navigate("/performance/" + perf.performanceKey)}>
                    <img src={perf.coverUrl} className="rounded-xl aspect-square w-16" />
                    <div className="flex flex-col gap-1">
                        <p className="text-xl text-left">{perf.arrVersion && perf.arrVersion.arr ? perf.arrVersion.arr.composition ? perf.arrVersion.arr.composition.title : perf.arrVersion.arr.name ? perf.arrVersion.arr.name : perf.arrVersion.arr.compTitle : perf.title}</p>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="flex flex-row justify-center items-center gap-1 flex-wrap">
                                <MiniUser account={perf.accountIcon} />
                            </p>
                            <p className="flex flex-row gap-1">
                                <ThumbsUp className="w-4" />
                                {perf.totalLoves}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}