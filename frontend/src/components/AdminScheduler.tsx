import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuthContext } from "../context/AuthContext";
import axios from 'axios'
import { APIBASEURL } from "../utilities/ApiEndpoint";


type Event = {
    id: string;
    start: string;
    end: string;
    title: string;
    color: string;
    role: string;
};

type AvailabilitySlot = {
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    maxPeopleAvailable: number;
    role: string;
};

const generateColor = (numberOfPeople:number, maxPeopleAvailable:number): string => {
    const percentage = maxPeopleAvailable > 0 ? (numberOfPeople / maxPeopleAvailable) * 100 : 0;

    if (percentage < 40) {
        return "red";
    } else if (percentage < 70) {
        return "yellow";
    } else {
        return "green";
    }
}

// const generateAvailabilitySlots = (baseDate: Date = new Date()): AvailabilitySlot[] => {
//     const slots: AvailabilitySlot[] = [];
//     const Roles = ["Developer", "Volunteer", "President"];

//     for (let dayOffset = 0; dayOffset < 6; dayOffset++) {

//         const currentDay = new Date(baseDate);
//         currentDay.setDate(baseDate.getDate() + dayOffset);

//         for (let hour = 7; hour < 19; hour++) {
//             const startDate = new Date(currentDay);
//             startDate.setHours(hour, 0, 0, 0);

//             const endDate = new Date(currentDay);
//             endDate.setHours(hour + 1, 0, 0, 0);

//             const numberOfPeople = Math.floor(Math.random() * 10);
//             const maxPeopleAvailable = 10;
//             const role = Roles[Math.floor(Math.random() * Roles.length)];

//             slots.push({
//                 startDate,
//                 endDate,
//                 numberOfPeople,
//                 maxPeopleAvailable,
//                 role
//             });
//         }
//     }
//     return slots;
// };

export default function AdminScheduler() {

    const [events, setEvents] = useState<Event[] | []>([]);
    const [filterRole, setFilterRole] = useState<string>("All");
    const { user, token } = useAuthContext();
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);

    if (!user.user_roles || !(user.user_roles.length > 0) || !user.user_roles[0].roles?.includes("Admin")) {
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await axios.get(`${APIBASEURL}/admin${filterRole != "All" ? `?role=${filterRole}` : "/"}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data);
                setAvailabilitySlots(response.data);

            } catch (err) {
                console.log(err);
            }

        };

        fetchData();
        
    }, [token, filterRole]);

    useEffect(() => {
        // const availabilitySlots = generateAvailabilitySlots();
        const newEvents: Event[] = availabilitySlots.map((slot, i) => {
            return {
                id: i.toString(),
                start: slot.startDate,
                end: slot.endDate,
                title: `${slot.numberOfPeople}/${slot.maxPeopleAvailable}`,
                color: generateColor(slot.numberOfPeople, slot.maxPeopleAvailable),
                role: slot.role,
            };
        });
        setEvents(newEvents);
    }, [availabilitySlots]);

    const filteredEvents =
        filterRole === "All" ? events : events.filter((event: Event) => event.role === filterRole);

    return (
        <div className="w-full md:w-1/2 m-auto adminCalendar mt-16">
            <div className="flex flex-row gap-4 justify-center mb-5">
                <button
                    onClick={() => setFilterRole("All")}
                    className={`px-4 py-2 rounded-md ${filterRole === "All" ? "bg-[#F15A29]" : "bg-gray-500"
                        } hover:cursor-pointer`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterRole("Developer")}
                    className={`px-4 py-2 rounded-md ${filterRole === "Developer" ? "bg-[#F15A29]" : "bg-gray-500"
                        } hover:cursor-pointer`}
                >
                    Developer
                </button>
                <button
                    onClick={() => setFilterRole("Volunteer")}
                    className={`px-4 py-2 rounded-md ${filterRole === "Volunteer" ? "bg-[#F15A29]" : "bg-gray-500"
                        } hover:cursor-pointer`}
                >
                    Volunteer
                </button>
                <button
                    onClick={() => setFilterRole("President")}
                    className={`px-4 py-2 rounded-md ${filterRole === "President" ? "bg-[#F15A29]" : "bg-gray-500"
                        } hover:cursor-pointer`}
                >
                    President
                </button>
            </div>
            <FullCalendar
                timeZone="America/Vancouver"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={filteredEvents}
                slotMinTime="07:00:00"
                slotMaxTime="19:00:00"
                slotDuration="01:00:00"
                slotLabelInterval="01:00:00"
                eventMaxStack={1}
                slotEventOverlap={false}
                eventOverlap={false}
                selectOverlap={false}
                dayMaxEvents={1}
                allDaySlot={false}
                validRange={{
                    start: new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1)),
                    end: new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1))
                }}
                dayCellClassNames={"cells"}

            />
        </div>
    );
};
