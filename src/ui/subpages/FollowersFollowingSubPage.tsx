import { ProfileResult } from "@/api/smule-types"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LoadingTemplate from "../components/LoadingTemplate"

export default function FollowersFollowingSubPage() {
    const params = useParams() as unknown as {accountId: number}

    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({} as ProfileResult)

    useEffect(() => {
        setLoading(true)
        smule.fetchAccount(params.accountId).then((res) => {
            setProfile(res)
            setLoading(false)
        })
    }, [params])
    
    return (
    <>
    {loading ? <LoadingTemplate/> : <>
    todo
    </>}
    </>
    )
}