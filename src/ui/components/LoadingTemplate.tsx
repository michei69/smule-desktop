import { Loader2 } from "lucide-react";

export default function LoadingTemplate() {
    return (
        <div className="w-full h-full flex flex-row gap-2 items-center justify-center">
            <Loader2 className="animate-spin"/>
            Loading...
        </div>
    )
}