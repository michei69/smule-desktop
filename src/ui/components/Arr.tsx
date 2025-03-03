import { Link } from "react-router";
import { Arr } from "../../api/smule-types";
import { Calendar, CassetteTape, Headphones, Languages, MicVocal, Play, ThumbsUp } from "lucide-react";
import MiniUser from "./MiniUser";
import Settings from "@/lib/settings";
import { Util } from "@/api/util";
export default function ArrComponent({arr}: {arr: Arr}) {
    if (Settings.get().developerMode) console.log(arr)
    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={arr.coverUrl} className="rounded-xl aspect-square w-16" />
            <div className="flex flex-col gap-1">
                <p className="text-xl text-left">{arr.composition ? arr.composition.title : arr.compTitle ?? arr.name} - {arr.composition ? arr.composition.artist : arr.artist}</p>
                <div className="flex flex-row gap-2 items-center">
                    <p className="flex flex-row justify-center items-center gap-1 flex-wrap">
                        <MiniUser account={arr.ownerAccountIcon} verified={arr.smuleOwned}/>
                    </p>
                    {
                    Number.isNaN(Math.floor(arr.rating*100)) ? "" :
                    <p className="flex flex-row gap-1">
                        <ThumbsUp className="w-4"/>
                        {Math.floor(arr.rating*100)}%
                        {Settings.get().developerMode ? <span className="font-light">({Util.formatValue(arr.totalVotes, false)})</span> : ""}
                    </p>
                    }
                    {Settings.get().developerMode ? (
                    <>
                    <p className="flex flex-row gap-1 font-light">
                        <CassetteTape className="w-4"/>
                        {Util.formatValue(arr.perfCount, false)}
                    </p>
                    <p className="flex flex-row gap-1 font-light">
                        <Headphones className="w-4"/>
                        {Util.formatValue(arr.totalPlays, false)}
                    </p>
                    </>
                    ) : ""}
                    <p className="flex flex-row gap-1">
                        <Languages className="w-4"/>
                        {new Intl.DisplayNames(['en'], {type: "language"}).of(arr.langId)}
                    </p>
                    {Settings.get().developerMode ? (
                    <p className="flex flex-row gap-1 font-light">
                        <Calendar className="w-4"/>
                        {new Date(arr.arrCreatedAt * 1000).toLocaleDateString("ro-RO")}
                    </p>
                    ) : ""}
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