import { ArrResult } from "smule.js";
import { useEffect, useState } from "react";
import ArrComponent from "./Arr";
import LoadingTemplate from "./LoadingTemplate";

export default function ArrFromKeyComponent({ key }: { key: string }) {
    const [loading, setLoading] = useState(true)
    const [arr, setArr] = useState({} as ArrResult)

    useEffect(() => {
        smule.songs.fetchOne(key).then((res) => {
            setArr(res)
            setLoading(false)
        })
    }, [])

    return (
        <>
            {loading ? <LoadingTemplate/> : (
                <ArrComponent arr={arr.arrVersion.arr}/>
            )}
        </>
    )
}