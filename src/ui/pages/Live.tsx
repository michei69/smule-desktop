import { useParams } from "react-router";

export default function LivePage() {
    const { liveId } = useParams() as { liveId: string }
    
    return (
        <></>
    )
}