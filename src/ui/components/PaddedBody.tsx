import { CSSProperties } from "react";

export default function PaddedBody({children = null, className = "", style = null}: {children?: React.ReactNode, className?: string, style?: CSSProperties}) {
    return (
        <div className={`mr-auto ml-auto p-4 ${className}`} style={style}>
            {children}
        </div>
    )
}