import { PerformanceIcon } from "smule.js"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"
import Navbar from "../components/Navbar"
import PaddedBody from "../components/PaddedBody"
import PerformanceComponent from "../components/Performance"
import { Button } from "@/components/ui/button"

export default function PerformanceChildren() {
    const params = useParams() as { performanceKey: string }
    const [performances, setPerformances] = useState([] as PerformanceIcon[])
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [offset, setOffset] = useState(0)
    const [nextOffset, setNextOffset] = useState(0)

    useEffect(() => {
        setLoading(true)
        setLoading2(true)
        smule.performances.fetchChildren(params.performanceKey).then((res) => {
            setPerformances(res.performanceIcons)
            setNextOffset(res.next)
            setLoading(false)
            setLoading2(false)
        })
    }, [params])

    useEffect(() => {
        setLoading2(true)
        smule.performances.fetchChildren(params.performanceKey, offset).then((res) => {
            setPerformances([...performances, ...res.performanceIcons])
            setNextOffset(res.next)
            setLoading2(false)
        })
    }, [offset])

    return (
        <>
        {loading ? <LoadingTemplate/> : 
            <PaddedBody className="flex flex-col gap-12 items-center justify-center mt-8" style={{width: "90%"}}>
                <div className="flex flex-col gap-2">
                    {performances.map((perf, idx) => <PerformanceComponent key={idx} performance={perf}/>)}
                    {nextOffset != -1 ?
                        <Button onClick={() => {setOffset(nextOffset)}} disabled={loading2} className="mt-2">
                            {loading2 ? "Loading..." : "Load more"}
                        </Button>
                    : ""}
                </div>
            </PaddedBody>
        }
        </>
    )
}