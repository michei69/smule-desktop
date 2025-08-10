import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import { Arr, PerformanceIcon, SingUserProfileResult } from "smule.js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PerformanceComponent from "../components/Performance";
import ArrComponent from "../components/Arr";

export default function RecordingsPerfomancesAndStuffAccount() {
    const params = useParams() as unknown as { accountId: number };

    const [loading, setLoading] = useState(true)
    const [loadingPerformances, setLoadingPerformances] = useState(true)
    const [loadingRecs, setLoadingRecs] = useState(true)
    const [loadingArrangements, setLoadingArrangements] = useState(true)
    
    const [hasSingProfile, setHasSingProfile] = useState(true)
    const [profile, setProfile] = useState({} as SingUserProfileResult)
    
    const [loadingRecsManually, setLoadingRecsManually] = useState(false)
    const [loadingPerformancesManually, setLoadingPerformancesManually] = useState(false)
    const [loadingArrangementsManually, setLoadingArrangementsManually] = useState(false)
    
    const [hasMoreRecs, setHasMoreRecs] = useState(true)
    const [recs, setRecs] = useState([] as PerformanceIcon[])
    const [hasMorePerformances, setHasMorePerformances] = useState(true)
    const [performances, setPerformances] = useState([] as PerformanceIcon[])
    const [hasMoreArrangements, setHasMoreArrangements] = useState(true)
    const [arrangements, setArrangements] = useState([] as Arr[])

    useEffect(() => {
        setLoading(true)
        smule.account.fetchOne(params.accountId).then((profile) => {
            setProfile(profile)
            setHasSingProfile(!!profile.singProfile)
            setLoading(false)
        })

        setLoadingRecs(true)
        smule.performances.fetchFromAccount(params.accountId).then((performances) => {
            if (!performances.participationIcons) {
                setHasMoreRecs(false)
                setLoadingRecs(false)
                return
            }
            setRecs(performances.participationIcons.map(performance => performance.performanceIcon))

            setHasMoreRecs(performances.next != -1)
            setLoadingRecs(false)
        })

        setLoadingPerformances(true)
        smule.performances.fetchFromAccount(params.accountId, "ACTIVESEED", "NEWEST_FIRST", 20, 0).then((perf) => {
            if (!perf.participationIcons) {
                setHasMorePerformances(false)
                setLoadingPerformances(false)
                return
            }
            setPerformances(perf.participationIcons.map(performance => performance.performanceIcon))

            setHasMorePerformances(perf.next != -1)
            setLoadingPerformances(false)
        })

        setLoadingArrangements(true)
        smule.songs.fetchOwnedBy(params.accountId).then((arr) => {
            if (!arr.arrVersionLites) {
                setHasMoreArrangements(false)
                setLoadingArrangements(false)
                return
            }
            setArrangements(arr.arrVersionLites)

            setHasMoreArrangements(arr.next != -1)
            setLoadingArrangements(false)
        })
    }, [params])

    const loadMoreRecs = useCallback(async () => {
        setLoadingRecsManually(true)

        const res = await smule.performances.fetchFromAccount(params.accountId, "FILLED", "NEWEST_FIRST", 20, recs.length)
        setRecs(recs.concat(
            res.participationIcons.map(performance => performance.performanceIcon)
        ))

        setHasMoreRecs(res.next != -1)
        setLoadingRecsManually(false)
    }, [recs])

    const loadMorePerformances = useCallback(async () => {
        setLoadingPerformancesManually(true)

        const res = await smule.performances.fetchFromAccount(params.accountId, "ACTIVESEED", "NEWEST_FIRST", 20, performances.length)
        setPerformances(performances.concat(
            res.participationIcons.map(performance => performance.performanceIcon)
        ))

        setHasMorePerformances(res.next != -1)
        setLoadingPerformancesManually(false)
    }, [performances])

    const loadMoreArrangements = useCallback(async () => {
        setLoadingArrangementsManually(true)

        const res = await smule.songs.fetchOwnedBy(params.accountId, arrangements.length)
        setArrangements(arrangements.concat(
            res.arrangements
        ))

        setHasMoreArrangements(res.next != -1)
        setLoadingArrangementsManually(false)
    }, [arrangements])

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
            {loadingRecs ? <LoadingTemplate/> : <>
                {recs.map((performance, idx) => {
                    return (
                        <PerformanceComponent performance={performance} key={idx}/>
                    )
                })}
            </>}
            {
                hasMoreRecs ?
                <Button onClick={loadMoreRecs} disabled={loadingRecsManually}>
                    {loadingRecsManually ? <Loader2 className="animate-spin"/> : ""}
                    Load{loadingRecsManually ? "ing" : ""} more
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
                <Button onClick={loadMorePerformances} disabled={loadingPerformancesManually}>
                    {loadingPerformancesManually ? <Loader2 className="animate-spin"/> : ""}
                    Load{loadingPerformancesManually ? "ing" : ""} more
                </Button>
                : "No more"
            }
            </div>
        </div>
        <div className="flex flex-col h-full gap-4" style={{minWidth: "45vw", overflow: "scroll", height: "90vh"}}>
            <h1 className="font-bold">Arrangements</h1>
            <div className="flex flex-col gap-4">
            {loadingArrangements ? <LoadingTemplate/> : <>
                {arrangements.map((arr, idx) => {
                    return (
                        <ArrComponent arr={arr} key={idx}/>
                    )
                })}
            </>}
            {
                hasMoreArrangements ?
                <Button onClick={loadMoreArrangements} disabled={loadingArrangementsManually}>
                    {loadingArrangementsManually ? <Loader2 className="animate-spin"/> : ""}
                    Load{loadingArrangementsManually ? "ing" : ""} more
                </Button>
                : "No more"
            }
            </div>
        </div>
    </>}
    </>
    )
}