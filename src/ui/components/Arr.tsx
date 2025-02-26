import { Link } from "react-router";
import { Arr } from "../../api/smule-types";
import { Languages, MicVocal, Play, ThumbsUp } from "lucide-react";
import MiniUser from "./MiniUser";
export default function ArrComponent({arr}: {arr: Arr}) {
    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={arr.coverUrl} className="rounded-xl aspect-square w-16" />
            <div className="flex flex-col gap-1">
                <p className="text-xl text-left">{arr.composition ? arr.composition.title : arr.name ?? arr.compTitle} - {arr.composition ? arr.composition.artist : arr.artist}</p>
                <div className="flex flex-row gap-2 items-center">
                    <p className="flex flex-row justify-center items-center gap-1 flex-wrap">
                        <MiniUser account={arr.ownerAccountIcon} verified={arr.smuleOwned}/>
                    </p>
                    {
                    Number.isNaN(Math.floor(arr.rating*100)) ? "" :
                    <p className="flex flex-row gap-1">
                        <ThumbsUp className="w-4"/>
                        {Math.floor(arr.rating*100)}%
                    </p>
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