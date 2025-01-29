export default function PaddedBody({children = null, className = ""}: {children?: React.ReactNode, className?: string}) {
    return (
        <div className={`mr-auto ml-auto p-4 ${className}`}>
            {children}
        </div>
    )
}