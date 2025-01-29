import { Link, useNavigate } from "react-router";
import { Arr } from "../../api/smule-types";
import { MicVocal, Play, ThumbsUp } from "lucide-react";
export default function ArrComponent({arr}: {arr: Arr}) {
    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={arr.coverUrl} className="rounded-xl aspect-square w-16" />
            <div className="flex flex-col gap-1">
                <p className="text-xl">{arr.name ?? arr.compTitle} - {arr.artist}</p>
                <div className="flex flex-row gap-1 items-center">
                    <img src={arr.ownerAccountIcon.picUrl} className="h-4 aspect-square rounded-xl"/>
                    <p className="font-light">@{arr.ownerAccountIcon.handle}</p>
                    <ThumbsUp className="w-4"/>
                    {Math.floor(arr.rating*100)}%
                    {arr.lyrics ? (
                        <MicVocal className="w-4"/>
                    ) : ""}
                </div>
            </div>
            <Link to={"/song/" + arr.key} className="flex flex-row gap-1 cute-border p-2 rounded-xl ml-auto">
                <Play/>
            </Link>
        </div>
    )
}