import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import PaddedBody from "../components/PaddedBody";

export default function SongOrPerformanceQuestion() {
    const params = useParams() as {id: string}

    return (
    <>
        <Navbar/>
        <PaddedBody className="flex flex-col justify-center items-center h-full min-h-fit">
            <h1>is this a song or a performance?</h1>
            <Link to={"/song/" + params.id}>song</Link>    
            <Link to={"/performance/" + params.id}>performance</Link>    
        </PaddedBody>  
    </>
    )
}