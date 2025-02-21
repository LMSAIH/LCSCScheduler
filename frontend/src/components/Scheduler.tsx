import { useState, useEffect } from "react";
import axios from 'axios'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { APIBASEURL, SCHEDULEPREFIX } from "../utilities/ApiEndpoint";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon } from "lucide-react";
import {DateTime} from 'luxon'


type Event = {
    id: string;
    title: string;
    start?: Date;
    end?: Date;
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
    color: string;
    type: string;
};


export default function Scheduler() {
    const [events, setEvents] = useState<Event[]>([]);
    const [objectState, setObjectState] = useState<"Permanent" | "Temporary">("Permanent");
    const { token } = useAuthContext();


    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await axios.get(`${APIBASEURL}${SCHEDULEPREFIX}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data)
                setEvents(response.data);

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [token]);

    const handleSend = async () => {
        try {
            const response = await axios.post(
                `${APIBASEURL}${SCHEDULEPREFIX}/`,
                events,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleReset = async () => {
        try {
            const response = await axios.post(
                `${APIBASEURL}${SCHEDULEPREFIX}/`,
                [],
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEventClick = (info: any) => {
        if (window.confirm(`Delete event "${info.event.title}"?`)) {
            setEvents(events.filter(event => event.id !== info.event.id));
        }
    };

    const handleDateSelect = (info: any) => {
        if (!info) {
            return;
        }

        console.log(info)

        let eventStart: Date, eventEnd: Date;

        if (info.allDay) {
            eventStart = new Date(info.end);
            eventStart.setHours(7, 0, 0, 0);
            eventEnd = new Date(info.end);
            eventEnd.setHours(19, 0, 0, 0);
        } else {
            eventStart = new Date(info.startStr);
            eventEnd = new Date(info.endStr);
        
            if (eventStart.getDay() !== eventEnd.getDay()) {
              document.body.style.cursor = "not-allowed";
              setTimeout(() => {
                document.body.style.cursor = "";
              }, 300);
              return;
            }
            console.log(eventStart, eventEnd);
        }

        let newEvent: Event;
        if (objectState === "Permanent") {
            
            newEvent = {
                id: uuidv4(),
                title: "Permanent",
                daysOfWeek: [eventStart.getDay()],
                startTime: eventStart.toTimeString().slice(0, 8),
                endTime: eventEnd.toTimeString().slice(0, 8),
                color: "green",
                type: objectState,
            };
            console.log("Here new event:", newEvent)
        } else {
            
            newEvent = {
                id: uuidv4(),
                title: "Temporary",
                start: info.start,
                end: info.end,
                color: "yellow",
                type: objectState,
            };
        }

        setEvents((prevEvents) => [...prevEvents, newEvent]);
        console.log(events)

    };

    const handleEventDrop = (info: any) => {
        if (info.event.allDay) {
            info.revert();
            return;
        }

        const updatedEvents = events.map((event) => {


            if (event.id === info.event.id) {

                if (event.type === "Temporary") {
                    return {
                        ...event,
                        start: info.event.start,
                        end: info.event.end,
                    };
                } else {

                    //TODO: Make this work properly
                    const vancouverStart = DateTime.fromJSDate(info.event.start).setZone("America/Vancouver");
                    const vancouverEnd = DateTime.fromJSDate(info.event.end).setZone("America/Vancouver").toFormat("HH:mm:ss");

                    console.log(vancouverStart,vancouverEnd);
            
                    return {
                      ...event,
                      daysOfWeek: [vancouverStart.weekday % 7],
                      startTime: vancouverStart.toFormat("HH:mm:ss"),
                      endTime: vancouverEnd
                    };
                }
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    return (
        <div className="w-full sm:w-1/2 m-auto">
            <div className="flex flex-row gap-10 justify-center mb-5">
                <button
                    onClick={() => setObjectState("Permanent")}
                    className={`${objectState === "Permanent" ? "bg-[#F15A29]" : "bg-gray-500"} hover:cursor-pointer rounded-md px-6 py-2`}
                >
                    Permanent Object
                </button>
                <button
                    onClick={() => setObjectState("Temporary")}
                    className={`${objectState === "Temporary" ? "bg-[#F15A29]" : "bg-gray-500"} hover:cursor-pointer rounded-md px-6 py-2`}
                >
                    Temporary Object
                </button>
            </div>
            <FullCalendar
                timeZone="America/Vancouver"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                editable
                selectable
                events={events}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                slotMinTime="07:00:00"
                slotMaxTime="19:00:00"
                slotDuration="01:00:00"
                slotLabelInterval="01:00:00"
                eventMaxStack={1}
                slotEventOverlap={false}
                eventOverlap={false}
                selectOverlap={false}
                dayMaxEvents={1}
                allDaySlot={true}
                allDayText="All day"
                businessHours={{
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: "07:00",
                    endTime: "19:00",
                }}
                eventConstraint="businessHours"
                validRange={{
                    start: new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1)),
                    end: new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1))
                }}
                longPressDelay={100}
                eventLongPressDelay={200}
                selectLongPressDelay={100}
                aspectRatio={1}

            />

            <div className="mt-8 flex justify-center flex-row gap-x-5">
                <button onClick={handleSend}
                    className="px-6 py-2 bg-[#F15A29] hover:bg-[#D14918] 
                       rounded-md transition-colors font-medium"
                >
                    Send Schedule
                </button>
                <TrashIcon className="my-auto hover:text-red-500 duration-300" onClick={handleReset} />
            </div>
        </div>
    );
};
