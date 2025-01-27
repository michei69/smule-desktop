import { useNavigate } from "react-router";
import { Arr } from "../../api/smule-types";
export default function ArrComponent({arr}: {arr: Arr}) {
    const navigate = useNavigate()
    return (
        <div className="flex flex-row gap-2">
            <img src={arr.coverUrl} />
            <p>{arr.compTitle} - {arr.artist}</p>
            <button onClick={() => {navigate("/song/" + arr.key)}}>play</button>
        </div>
    )
}