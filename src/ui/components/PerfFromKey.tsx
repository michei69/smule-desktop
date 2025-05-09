import { PerformanceIcon } from "@/api/smule-types"
import { useEffect, useState } from "react"
import LoadingTemplate from "./LoadingTemplate"
import PerformanceComponent from "./Performance"

export default function PerfFromKeyComponent({ performanceKey }: { performanceKey: string }) {
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
            {loading ? <LoadingTemplate/> : (
                <PerformanceComponent performance={perf}/>
            )}
        </>
    )
}