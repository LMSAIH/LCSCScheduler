import Scheduler from "../components/Scheduler"
import AdminScheduler from "../components/AdminScheduler"
import { Lightbulb } from "lucide-react"
export default function Home() {

    return (

        <div className="min-h-screen text-white">
            <main className="mx-auto p-6">

                <div className="w-fit max-w-3/4 m-auto my-5 flex flex-col  p-4 bg-yellow-300 border-black border-2 text-black rounded-md">

                    <div className="flex justify-center flex-row">
                        <p className="font-semibold text-xl my-auto"> Use Guide</p>
                        <Lightbulb className="size-10 my-auto " />
                    </div>
                    <div className="font-semibold text-lg text-center">
                        <p className="mb-2">Before registering your availability, go to Settings and select your role(s). Then, return to the homepage to enter your schedule.
                            Please mark the hours when you are busy, not when you are free. Use:</p>
                            <ul className="list-disc list-inside ">
                                <li className="mt-2">Recurrent events for regular commitments (e.g., class schedule).</li>
                                <li className="mt-2">Temporary events for one-time commitments.</li>
                                <li className="mt-2">On mobile: Hold a box to select a single hour or multiple boxes for a range.</li>
                                <li className="mt-2">On computer: Click to select one hour or drag to select a range.</li>
                            </ul>
                            <p className="mt-2"> To delete a timeslot click on it, remember to save your changes before leaving</p>
                    </div>
                </div>
                <Scheduler />
                <AdminScheduler />

            </main>
        </div>

    )
}