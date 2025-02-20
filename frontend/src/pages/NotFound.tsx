import { Link } from "react-router-dom"

export default function NotFound() {

    return (
        <div> 
            <h1 className="text-center text-2xl mt-20"> Oops! Seems like the thing you are looking for doesn't exist...yet.</h1>
            <p className="text-center text-2xl mt-10"> Return to <Link to="/" className="text-blue-400">home</Link></p>
        </div>
    )
}