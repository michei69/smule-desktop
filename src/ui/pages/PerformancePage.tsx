import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import { avTmplSegment, Comment, PerformanceResult } from "@/api/smule-types";
import MiniUser from "../components/MiniUser";
import Lyrics from "../components/Lyrics";
import { SmuleMIDI } from "@/api/smule-midi";
import { ArrowUp, Calendar, ExternalLink, Gift, Headphones, Heart, Hourglass, LockKeyhole, MessageCircleMore, MicVocal, Play, PlusCircle, TrendingUp } from "lucide-react";

export default function PerformancePage() {
    const navigate = useNavigate()
    const params = useParams() as unknown as {performanceId: string}
    const [loading, setLoading] = useState(true)
    const [performance, setPerformance] = useState({} as PerformanceResult)
    const [lyrics, setLyrics] = useState({} as SmuleMIDI.SmuleMidiData)
    const [avTmplSegments, setAvTmplSegments] = useState([] as avTmplSegment[])
    const [comments, setComments] = useState([] as Comment[])
    const [nextCommentOffset, setNextCommentOffset] = useState(0)
    const [loadingComments, setLoadingComments] = useState(true)
    const [hasMoreComments, setHasMoreComments] = useState(true)

    const [titleText, setTitleText] = useState("")

    const [playing, setPlaying] = useState(false)
    const [audioTime, setAudioTime] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause()
            if (videoRef.current) videoRef.current.pause()
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        smule.fetchPerformance(params.performanceId).then(async (res) => {
            setPerformance(res)
            setComments([])
            setNextCommentOffset(0)
            setHasMoreComments(true)
            console.log(res.performance)

            setAvTmplSegments(res.performance.arrVersion.arr.avTmplSegments)

            let midiUrl = ""
            for (let resource of res.performance.arrVersion.normResources) {
                if (resource.role == "main") {
                    midiUrl = resource.url
                }
            }
            for (let resource of res.performance.arrVersion.origResources) {
                if (!midiUrl && resource.role == "midi") {
                    midiUrl = resource.url
                }
            }
            let file = await storage.download(midiUrl)
            let lyrics = await smule.fetchLyrics(file)
            setLyrics(lyrics)

            let ogTitle = res.performance.arrVersion.arr.name || res.performance.arrVersion.arr.compTitle
            if (!ogTitle && res.performance.arrVersion.arr.composition) ogTitle = res.performance.arrVersion.arr.composition.title
            let artist = res.performance.arrVersion.arr.artist
            if (!artist && res.performance.arrVersion.arr.composition) artist = res.performance.arrVersion.arr.composition.artist
            if (!artist) artist = res.performance.artist

            let performanceTitle = res.performance.title.trim()
            ogTitle = ogTitle.trim()
            if (ogTitle == performanceTitle) {
                setTitleText(`${ogTitle} - ${artist}`)
            } else {
                setTitleText(`${performanceTitle} (${ogTitle} - ${artist})`)
            }

            // not verifying if we're a guest because its being verified before
            // sending the http request either way
            smule.markPerformanceListenStart(res.performance.performanceKey)

            setLoading(false)
        })
    }, [params])

    useEffect(() => {
        if (!hasMoreComments) return
        setLoadingComments(true)
        smule.fetchComments(params.performanceId, nextCommentOffset).then((res) => {
            if (!res || !res.comments) {
                setHasMoreComments(false)
                setLoadingComments(false)
                return
            }
            if (comments.length > 0)
                setComments(comments.concat(res.comments))
            else
                setComments(res.comments)
            setHasMoreComments(res.next == -1)
            setNextCommentOffset(res.next)
            setLoadingComments(false)
        }).catch(console.error)
    }, [nextCommentOffset])

    const [modifyComment, setModifyComment] = useState({commentIdx: -1, like: false})

    useEffect(() => {
        if (modifyComment.commentIdx == -1) return
        if (!comments[modifyComment.commentIdx]) return
        comments[modifyComment.commentIdx].likeCount += modifyComment.like ? 1 : -1
        setModifyComment({commentIdx: -1, like: false})
    }, [modifyComment])

    useEffect(() => {
        if (!audioRef.current && !videoRef.current) return
        if (audioRef.current) {
            if (playing) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        } else if (videoRef.current) {
            if (playing) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
        }
    }, [playing])
    
    useEffect(() => {
        const audioUpdate = () => {
            if (audioRef.current) {
                setAudioTime(audioRef.current.currentTime)
                requestAnimationFrame(audioUpdate)
            } else if (videoRef.current) {
                setAudioTime(videoRef.current.currentTime)
                requestAnimationFrame(audioUpdate)
            }
        }
        requestAnimationFrame(audioUpdate)
    }, [loading])

    return (
    <>
        <Navbar/>
        {
        loading ? <LoadingTemplate/> :
            <PaddedBody className="flex flex-row gap-12 items-center justify-center mt-8" style={{width: "90%"}}>
                <div className="flex flex-col gap-4 justify-center items-center grow" style={{width: "30%"}}>
                {performance.performance.videoType == "VISUALIZER" ?
                    <video ref={videoRef} className="rounded-2xl w-full aspect-square mt-16" src={performance.performance.visualizerRenderedUrl} controls></video> 
                : performance.performance.videoType == "VIDEO" ?
                    <video ref={videoRef} className="rounded-2xl w-full aspect-square mt-16" src={performance.performance.videoRenderedMp4Url || performance.performance.videoRenderedUrl} controls></video>
                :
                <>
                    <img className="rounded-2xl w-full aspect-square mt-16" src={performance.performance.coverUrl}></img>
                    <audio ref={audioRef} className="w-full" src={performance.performance.shortTermRenderedUrl} controls/>
                </>
                }
                </div>
                <div className="flex flex-col gap-1 justify-start items-start mt-5 grow" style={{width: "60%"}}>
                    <div className="flex flex-row gap-1 items-center w-full">
                        <div className="flex flex-col gap-1 justify-start items-start">
                            <div className="flex flex-row gap-1 items-center justify-center">
                            {
                                performance.performance.recentTracks.map((track, i) => {
                                    return <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                                        <MiniUser key={i} account={track.accountIcon}/>
                                        <div className="w-1"/>
                                    </div>
                                })
                            }
                            </div>
                            <h1 className="text-2xl font-bold cursor-pointer username" onClick={() => navigate("/song/" + performance.performance.arrVersion.arr.key)}>
                                {titleText}
                            </h1>
                            <p>{performance.performance.message || "(No message provided)"}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center ml-auto mr-8 float-right">
                        {performance.performance.parentPerformanceKey ? 
                        <Link to={"/performance/" + performance.performance.parentPerformanceKey} className="flex flex-row gap-1 cute-border p-2 rounded-xl card">
                            <ArrowUp/> Parent
                        </Link>
                        : ""}
                        <Link to={"/play/performance/" + performance.performance.performanceKey} className="flex flex-row gap-1 cute-border p-2 rounded-xl card">
                            <Play/> Join
                        </Link>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center -mb-8 z-50">
                        <div className="flex flex-row gap-1 items-center">
                            <Heart className="w-4"/>
                            <p>{performance.performance.totalLoves}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <Headphones className="w-4"/>
                            <p>{performance.performance.totalListens}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <MessageCircleMore className="w-4"/>
                            <p>{performance.performance.totalComments}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <Gift className="w-4"/>
                            <p>{performance.performance.giftCnt}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <MicVocal className="w-4"/>
                            <p>{performance.performance.ensembleType}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <Calendar className="w-4"/>
                            <p>{Math.round((new Date().getTime() - performance.performance.createdAt*1000) / 1000 / 3600 / 24)} days ago</p>
                        </div>
                        <p className="flex flex-row gap-1 items-center fakelink username" onClick={() => openExternalLink(performance.performance.webUrl)}>
                            <ExternalLink className="w-4"/>
                            Link
                        </p>
                        {performance.performance.isPrivate ? <LockKeyhole className="w-4"/> : ""}
                        {performance.performance.isJoinable ? <PlusCircle className="w-4"/> : ""}
                        {!performance.performance.complete ? <Hourglass className="w-4"/> : ""}
                        {performance.performance.boost ? <TrendingUp className="w-4"/> : ""}
                    </div>
                    <div className="flex flex-row gap-1 items-center w-full">
                        <div className="flex flex-col justify-center items-center" style={{width: "50%", minWidth: "50%", maxWidth: "50%"}}>
                            <Lyrics lyrics={lyrics} audioTime={audioTime} part={performance.performance.origTrackPartId} pause={() => setPlaying(false)} resume={() => setPlaying(true)} setTime={(time) => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = time
                                } else if (videoRef.current) {
                                    videoRef.current.currentTime = time
                                }
                            }} fill={true} avTmplSegments={avTmplSegments}/>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2 overflow-y-scroll mr-8 mt-10" style={{width:"100%", height:"60vh"}}>
                        {
                        comments.map((comment, i) => 
                            <div className="flex flex-row gap-1 items-center justify-center w-full card rounded-2xl cute-border" key={i}>
                                <div className="flex flex-col gap-1 items-start">
                                    <div className="flex flex-row gap-1 justify-center items-center">
                                        <MiniUser account={comment.accountIcon}/>
                                    </div>
                                    <p className="text-left ml-6 mr-2">{comment.message}</p>
                                </div>
                                <div className="flex flex-row gap-1 items-center justify-center ml-auto">
                                    <Heart className="w-4 darken-on-hover cursor-pointer" onClick={(e) => { 
                                        let self = e.target as HTMLElement
                                        if (self.classList.contains("text-red-500")) {
                                            self.classList.remove("text-red-500")
                                            smule.unlikeComment(performance.performance.performanceKey, comment.postKey)
                                            setModifyComment({commentIdx: i, like: false})
                                            
                                        } else {
                                            self.classList.add("text-red-500")
                                            smule.likeComment(performance.performance.performanceKey, comment.postKey)
                                            setModifyComment({commentIdx: i, like: true})
                                        }
                                    }}/>
                                    <p className="mb-0.5 select-none">{comment.likeCount}</p>
                                </div>
                            </div>)   
                        }
                        {
                        loadingComments && hasMoreComments ? <LoadingTemplate/> : 
                        hasMoreComments ? 
                        <button onClick={() => setNextCommentOffset(comments.length)}>Load more</button> : null
                        }
                        </div>
                    </div>
                </div>
            </PaddedBody>
        }
    </>
    )
}