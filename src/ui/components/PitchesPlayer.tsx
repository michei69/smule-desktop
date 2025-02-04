import { SmuleMIDI } from "@/api/smule";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";

export default function PitchesPlayer({ pitches, audioTime, length, isPlaying, part, preview = false }: { pitches: SmuleMIDI.SmulePitchesData, audioTime: number, length: number, isPlaying: boolean, part: number, preview?: boolean }) {
    const VHPerMilisecond = 10
    // const totalLength = pitches.pitches[pitches.pitches.length - 1].endTime * VHPerMilisecond

    // const speed = totalLength / length * 2;
    const numberOfNotes = pitches.largestNote - pitches.smallestNote + 1

    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentNote = useRef(-1)
    
    useEffect(() => {
        if (!containerRef.current) return
        const totalLength = containerRef.current.scrollWidth
        const scrollPosition = audioTime / length * totalLength
        
        containerRef.current.scrollLeft = scrollPosition - 25;

        for (let i = 0; i < pitches.pitches.length; i++) {
            if (pitches.pitches[i].startTime <= audioTime) currentNote.current = i
        }
    }, [audioTime])

    return (
        <div className="pitches-player" ref={containerRef}>
            <>
            <div className="pitches-arrow" style={{
                top: currentNote.current ? Math.floor((pitches.largestNote - pitches.pitches[currentNote.current].noteNumber) / numberOfNotes * 100 * 4.5) + "%" : "50%"
            }}>
                <Play className="h-full"/>
            </div>
            {pitches.pitches.map((pitch, i) => {
                let clsName = pitch.part == part || pitch.part == 3 ? "bg-blue-500" : pitch.part == 0 ? "bg-yellow-500" : "bg-gray-500"
                let marginBefore = pitches.pitches[i - 1] ? (pitch.startTime - pitches.pitches[i - 1].endTime) * VHPerMilisecond : (pitch.startTime) * VHPerMilisecond
                let brightenedClass = i == currentNote.current ? "brightness-100" : "brightness-50"

                return (
                    <div key={i} className={`${clsName} rounded-xl ${brightenedClass}`} style={{
                        width: `${(pitch.endTime - pitch.startTime) * VHPerMilisecond}vh`,
                        height: VHPerMilisecond/8 + "vh", // TEMP
                        marginLeft: marginBefore + "vh",
                        flex: "0 0 auto",
                        marginTop: Math.floor((pitches.largestNote - pitch.noteNumber) / numberOfNotes * 50 * 5) + "%",
                        marginRight: i == pitches.pitches.length - 1 ? (length - pitch.endTime) * VHPerMilisecond + "vh" : "0"
                    }} />
                )
            })}
            </>
        </div>
    )
}