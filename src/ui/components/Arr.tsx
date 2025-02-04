import { Link, useNavigate } from "react-router";
import { Arr } from "../../api/smule-types";
import { AudioLines, Hourglass, Languages, MicVocal, Play, ThumbsUp, Verified } from "lucide-react";
import { SmuleUtil, Util } from "@/api/util";
export default function ArrComponent({arr}: {arr: Arr}) {
    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={arr.coverUrl} className="rounded-xl aspect-square w-16" />
            <div className="flex flex-col gap-1">
                <p className="text-xl">{arr.name ?? arr.compTitle} - {arr.artist}</p>
                <div className="flex flex-row gap-1 items-center">
                    <img src={arr.ownerAccountIcon.picUrl} className="h-4 aspect-square rounded-xl"/>
                    <p className="font-light">@{arr.ownerAccountIcon.handle}</p>
                    {arr.smuleOwned || SmuleUtil.isVerified(arr.ownerAccountIcon.verifiedType) ? (
                        <Verified className="w-4 mr-2"/>
                    ) : ""}
                    {
                    Number.isNaN(Math.floor(arr.rating*100)) ? "" :
                    <>
                        <ThumbsUp className="w-4"/>
                        {Math.floor(arr.rating*100)}%
                    </>
                    }
                    <p className="flex flex-row gap-1">
                        <Languages className="w-4"/>
                        {new Intl.DisplayNames(['en'], {type: "language"}).of(arr.langId)}
                    </p>
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