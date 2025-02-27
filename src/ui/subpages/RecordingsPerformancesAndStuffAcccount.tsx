import { useParams } from "react-router";
import { useEffect, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import { PerformanceIcon, PerformancesFillStatus, PerformanceSortMethod, ProfileResult } from "@/api/smule-types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PerformanceComponent from "../components/Performance";

export default function RecordingsPerfomancesAndStuffAccount() {
    const params = useParams() as unknown as { accountId: number };

    const [loading, setLoading] = useState(true)
    const [loadingPerformances, setLoadingPerformances] = useState(true)
    
    const [hasSingProfile, setHasSingProfile] = useState(true)
    const [profile, setProfile] = useState({} as ProfileResult)
    
    const [loadingPerformancesManually, setLoadingPerformancesManually] = useState(false)
    const [recOffset, setRecOffset] = useState(0)
    const [hasMoreRecs, setHasMoreRecs] = useState(true)
    const [recs, setRecs] = useState([] as PerformanceIcon[])

    const [performanceOffset, setPerformanceOffset] = useState(0)
    const [hasMorePerformances, setHasMorePerformances] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])

    useEffect(() => {
        setLoading(true)
        smule.fetchAccount(params.accountId).then((profile) => {
            setProfile(profile)
            setHasSingProfile(!!profile.singProfile)
            setLoading(false)
        })

        smule.fetchPerformancesFromAccount(params.accountId).then((performances) => {
            if (!performances.participationIcons) {
                setHasMoreRecs(false)
                setLoadingPerformances(false)
                return
            }
            setRecs(performances.participationIcons.map(performance => performance.performanceIcon))

            setHasMoreRecs(performances.next != -1)
            setLoadingPerformances(false)
        })
        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.ACTIVESEED, PerformanceSortMethod.NEWEST_FIRST, 20, 0).then((perf) => {
            if (!perf.participationIcons) {
                setHasMorePerformances(false)
                setLoadingPerformances(false)
                return
            }
            setPerformances(perf.participationIcons.map(performance => performance.performanceIcon))

            setHasMorePerformances(perf.next != -1)
            setLoadingPerformancesManually(false)
        })
    }, [params])

    useEffect(() => {
        if (recOffset == 0) return
        setLoadingPerformancesManually(true)

        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.FILLED, PerformanceSortMethod.NEWEST_FIRST, 20, recOffset).then((perf) => {
            setRecs(recs.concat(
                perf.participationIcons.map(performance => performance.performanceIcon)
            ))

            setHasMoreRecs(perf.next != -1)
            setLoadingPerformancesManually(false)
        })
    }, [recOffset])

    useEffect(() => {
        if (performanceOffset == 0) return
        setLoadingPerformancesManually(true)

        smule.fetchPerformancesFromAccount(params.accountId, PerformancesFillStatus.ACTIVESEED, PerformanceSortMethod.NEWEST_FIRST, 20, performanceOffset).then((perf) => {
            setPerformances(performances.concat(
                perf.participationIcons.map(performance => performance.performanceIcon)
            ))

            setHasMorePerformances(perf.next != -1)
            setLoadingPerformancesManually(false)
        })
    }, [performanceOffset])

    return (
    <>
    {loading ? <LoadingTemplate/> : <>
        {
        hasSingProfile ?
        <div className="flex flex-col h-full gap-4" style={{minWidth: "45vw", overflow: "scroll", height: "90vh"}}>
            <h1 className="font-bold">Pinned recordings</h1>
            <div className="flex flex-col gap-4">
                {profile.singProfile.pinPerformanceIcons ?
                profile.singProfile.pinPerformanceIcons.map((performance, idx) => {
                    return (
                        <PerformanceComponent performance={performance} key={idx}/>
                    )
                })
                : "None"
                }
            </div>
        </div>
        : ""
        }
        <div className="flex flex-col h-full gap-4" style={{minWidth: "45vw", overflow: "scroll", height: "90vh"}}>
            <h1 className="font-bold">Recordings</h1>
            <div className="flex flex-col gap-4">
            {loadingPerformances ? <LoadingTemplate/> : <>
                {recs.map((performance, idx) => {
                    return (
                        <PerformanceComponent performance={performance} key={idx}/>
                    )
                })}
            </>}
            {
                hasMoreRecs ?
                <Button onClick={() => {
                    setRecOffset(recs.length)
                }} disabled={loadingPerformancesManually}>
                    {loadingPerformancesManually ? <Loader2 className="animate-spin"/> : ""}
                    Load more
                </Button>
                : "No more"
            }
            </div>
        </div>
        <div className="flex flex-col h-full gap-4" style={{minWidth: "45vw", overflow: "scroll", height: "90vh"}}>
            <h1 className="font-bold">Performances</h1>
            <div className="flex flex-col gap-4">
            {loadingPerformances ? <LoadingTemplate/> : <>
                {performances.map((performance, idx) => {
                    return (
                        <PerformanceComponent performance={performance} key={idx}/>
                    )
                })}
            </>}
            {
                hasMorePerformances ?
                <Button onClick={() => {
                    setPerformanceOffset(performances.length)
                }} disabled={loadingPerformancesManually}>
                    {loadingPerformancesManually ? <Loader2 className="animate-spin"/> : ""}
                    Load more
                </Button>
                : "No more"
            }
            </div>
        </div>
    </>}
    </>
    )
}