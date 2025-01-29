import { PerformanceIcon } from "@/api/smule-types"
import { useEffect, useState } from "react"
import LoadingTemplate from "./LoadingTemplate"
import PerformanceComponent from "./Performance"

export default function PerfFromKeyComponent({ key }: { key: string }) {
    const [loading, setLoading] = useState(true)
    const [perf, setPerf] = useState({} as PerformanceIcon)

    useEffect(() => {
        smule.lookUpPerformanceByKey(key).then((res) => {
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