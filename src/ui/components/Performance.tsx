import { PerformanceIcon } from "@/api/smule-types";
import { SmuleUtil } from "@/api/util";
import { Gift, Headphones, Heart, Lock, MessageCircleMore, MicVocal, Play, Verified, Video } from "lucide-react";
import { Link, useNavigate } from "react-router";
import MiniUser from "./MiniUser";
import Settings from "@/lib/settings";

export default function PerformanceComponent({ performance }: { performance: PerformanceIcon }) {
    const navigate = useNavigate()

    if (Settings.get().developerMode) console.log(performance)

    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={performance.accountIcon.picUrl} className="rounded-xl aspect-square w-16 mb-auto" />
            <div className="flex flex-col gap-1">
                <div className="text-xl text-left flex flex-row flex-wrap gap-1">
                    <span className="cursor-pointer username" onClick={() => navigate("/account/" + performance.accountIcon.accountId)}>@{performance.accountIcon.handle}</span>
                    {SmuleUtil.isVerified(performance.accountIcon.verifiedType) ? (
                        <Verified className="w-4 mt-1"/>
                    ) : ""}
                    <span className="italic font-light">sang {!performance.origTrackPartId ? "everything" : "part " + performance.origTrackPartId}</span>
                    <span>({performance.ensembleType})</span> 
                    {performance.recentTracks &&performance.recentTracks.length > 0 && performance.recentTracks[0].accountIcon.accountId != performance.accountIcon.accountId ?
                    <>
                        <span className="italic font-light ml-0.5">along with</span>
                        <div className="flex flex-row gap-1 flex-wrap items-center">
                            {performance.recentTracks.map((track, index) => {
                                if (track.accountIcon.accountId == performance.accountIcon.accountId) return
                                if (index > 2) return
                                return (
                                <>
                                <div className="flex flex-row gap-1 text-sm items-center mt-0.5">
                                    <MiniUser key={index} account={track.accountIcon} />
                                </div>
                                {performance.totalPerformers > 2 ? (
                                    <span className="italic font-light">and {performance.totalPerformers - 2} more</span>
                                ) : ""}
                                </>
                                )
                            })}
                        </div>
                    </>
                    : performance.totalPerformers > 1 ? (
                        <span className="italic font-light ml-0.5">along with {performance.totalPerformers - 1} more</span>
                    ) : ""}
                </div>
                <p className="italic text-left font-light">{performance.message}</p>
                
                {/* mini ARR */}
                <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
                    <img src={performance.coverUrl} className="rounded-xl aspect-square w-12" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-left">{performance.arrVersion && performance.arrVersion.arr ? performance.arrVersion.arr.composition ? performance.arrVersion.arr.composition.title : performance.arrVersion.arr.name ? performance.arrVersion.arr.name : performance.arrVersion.arr.compTitle : performance.title} - {performance.arrVersion && performance.arrVersion.arr ? performance.arrVersion.arr.artist : performance.artist}</p>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row gap-1">
                                <Headphones className="w-4"/>
                                <p>{performance.totalListens}</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <Heart className="w-4"/>
                                <p>{performance.totalLoves}</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <MessageCircleMore className="w-4"/>
                                <p>{performance.totalComments}</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <Gift className="w-4"/>
                                <p>{performance.giftCnt}</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <MicVocal className="w-4"/>
                                <p>{performance.totalPerformers}</p>
                            </div>
                            {performance.video ? (
                            <div className="flex flex-row gap-1">
                                <Video className="w-4"/>
                                <p>Video</p>
                            </div>
                            ) : ""}
                            {performance.isPrivate ? (
                            <div className="flex flex-row gap-1">
                                <Lock className="w-4"/>
                            </div>
                            ) : ""}
                            |
                            <p>
                                {Math.round((new Date().getTime() - performance.createdAt*1000) / 1000 / 3600 / 24)} days ago
                            </p>
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-row gap-1 items-center">
                    <img src={arr.ownerAccountIcon.picUrl} className="h-4 aspect-square rounded-xl"/>
                    <p className="font-light">@{arr.ownerAccountIcon.handle}</p>
                    <ThumbsUp className="w-4"/>
                    {Math.floor(arr.rating*100)}%
                    {arr.lyrics ? (
                        <MicVocal className="w-4"/>
                    ) : ""}
                </div> */}
            </div>
            <Link to={"/performance/" + performance.performanceKey} className="flex flex-row gap-1 cute-border p-2 rounded-xl ml-auto">
                <Play/>
            </Link>
        </div>
    )
}