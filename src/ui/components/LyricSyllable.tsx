import { memo } from "react"

export default memo(function LyricSyllable({ text, isSyllable, isActive }: { text: string, isSyllable: boolean, isActive: boolean }) {
    const classes = isSyllable && isActive ? "underline" : "brightness-75"
    return (
        <span className={classes}>{text}</span>
    )
})