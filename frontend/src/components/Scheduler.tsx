import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
    const [id, setId] = useState(1);

    const handleEventClick = (info: any) => {
        if (window.confirm(`Delete event "${info.event.title}"?`)) {

            setEvents(events.filter(event => event.id !== info.event.id));
        }
    };

    const handleDateSelect = (info: any) => {
        if (!info) {
            return;
        }

        let eventStart: Date, eventEnd: Date;

        if (info.allDay) {
            eventStart = new Date(info.start);
            eventStart.setHours(7, 0, 0, 0);
            eventEnd = new Date(info.start);
            eventEnd.setHours(19, 0, 0, 0);
        } else {
            if (info.start.getDay() !== info.end.getDay()) {
                document.body.style.cursor = "not-allowed";
                setTimeout(() => {
                    document.body.style.cursor = "";
                }, 300);
                return;
            }
            eventStart = info.start;
            eventEnd = info.end;
        }

        let newEvent: Event;
        if (objectState === "Permanent") {
            newEvent = {
                id: String(id),
                title: "Permanent",
                daysOfWeek: [eventStart.getDay()],
                startTime: eventStart.toTimeString().slice(0, 8),
                endTime: eventEnd.toTimeString().slice(0, 8),
                color: "green",
                type: objectState,
            };
        } else {
            newEvent = {
                id: String(id),
                title: "Temporary",
                start: eventStart,
                end: eventEnd,
                color: "yellow",
                type: objectState,
            };
        }

        setEvents([...events, newEvent]);

        console.log(events)
        setId(id + 1);
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
                    
                    return {
                        ...event,
                        daysOfWeek: [info.event.start.getDay()],
                        startTime: info.event.start.toTimeString().slice(0,8),
                        endTime: info.event.end.toTimeString().slice(0,8)
                    }
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
        </div>
    );
};
