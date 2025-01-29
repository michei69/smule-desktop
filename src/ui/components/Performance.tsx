import { PerformanceIcon } from "@/api/smule-types";
import { Gift, Headphones, Heart, MessageCircleMore, MicVocal, Play } from "lucide-react";
import { Link } from "react-router";

export default function PerformanceComponent({ performance }: { performance: PerformanceIcon }) {
    return (
        <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
            <img src={performance.accountIcon.picUrl} className="rounded-xl aspect-square w-16 mb-auto" />
            <div className="flex flex-col gap-1">
                <p className="text-xl text-left">@{performance.accountIcon.handle} <span className="italic font-light">sang part {performance.origTrackPartId}</span> ({performance.ensembleType})</p>
                <p className="italic text-left font-light">{performance.message}</p>
                
                {/* mini ARR */}
                <div className="flex flex-row gap-4 card cute-border rounded-2xl items-center">
                    <img src={performance.coverUrl} className="rounded-xl aspect-square w-12" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-left">{performance.title} - {performance.artist}</p>
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