import { SmuleMIDI } from "../../api/smule";

export default function Lyrics({ lyrics, audioTime }: { lyrics: SmuleMIDI.SmuleLyrics[], audioTime: number }) {
    let lastIdx = -1
    return (
        <div>
            {lyrics.map((lyric, index) => {
                let clsName = lyric.startTime <= audioTime && lyric.endTime >= audioTime ? "text-red-500" : "text-gray-500"
                
                return (
                    <p key={index} className={clsName}>{lyric.text}</p>
                )
            })}
        </div>
    )
}
