import db from "$lib/db";

export async function scheduleJobEvents(workerId: string, workerName: string, jobId: string, jobName: string, jobTotalHours: number, jobStartDate: Date, maxDailyHours: number): Promise<Event[]> {
    const events: Event[] = [];
    const startHour = 8;
    const lunchStart = 12;
    const lunchEnd = 13;
    const currentDate = new Date(jobStartDate);

    while (jobTotalHours > 0) {
        // Check if currentDate is a weekday (Monday to Friday)
        if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
            const existingEvents = await getExistingWorkerEvents(workerId, currentDate);
            const availableSlots = await getAvailableTimeSlots(existingEvents, currentDate, startHour, lunchStart, lunchEnd, maxDailyHours);

            for (const slot of availableSlots) {
                const slotDuration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60); // convert ms to hours

                if (slotDuration > 0) {
                    const hoursToSchedule = Math.min(jobTotalHours, slotDuration);
                    const eventStart = new Date(slot.start);
                    const eventEnd = new Date(slot.start);
                    eventEnd.setHours(eventEnd.getHours() + hoursToSchedule);

                    events.push({
                        workerId,
                        jobId,
                        start: eventStart,
                        end: eventEnd,
                        title: `${workerName} - ${jobName}`
                    });

                    jobTotalHours -= hoursToSchedule;

                    if (jobTotalHours <= 0) break;
                }
            }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
}

async function getExistingWorkerEvents(workerId: string, date: Date): Promise<Event[]> {
    // Get all other events for the worker
    const workerEvents = await db.event.findMany({
        where: {
            employeeId: workerId
        }
    })

    // Filter the events for the current date
    const filtered = workerEvents.filter(event => {
        return event.start.toDateString() === date.toDateString();
    })

    return filtered.map(event => {
        return {
            workerId: event.employeeId,
            jobId: event.jobId,
            start: event.start,
            end: event.end,
            title: event.title
        }
    }
    )
}

async function getAvailableTimeSlots(existingEvents: Event[], currentDate: Date, startHour: number, lunchStartHour: number, lunchEndHour: number, maxDailyHours: number): Promise<{ start: Date, end: Date }[]> {
    const slots: { start: Date, end: Date }[] = [];
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(startHour, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(startHour + (maxDailyHours + 1), 0, 0, 0);

    let lastEnd = startOfDay;

    const lunchStart = new Date(currentDate);
    lunchStart.setHours(lunchStartHour, 0, 0, 0);
    const lunchEnd = new Date(currentDate);
    lunchEnd.setHours(lunchEndHour, 0, 0, 0);

    for (const event of existingEvents) {
        // Get the current timezone offset for the local system
        const localOffset = new Date().getTimezoneOffset();

        // Create a date object for 'America/New_York' timezone
        const easternDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

        // Get the timezone offset for Eastern Time by comparing it to UTC
        const easternOffset = easternDate.getTimezoneOffset();

        // Calculate the difference in offsets
        const timezoneOffset = localOffset - easternOffset;

        // Convert start and end times to Eastern Time
        const startInEastern = new Date(event.start.getTime() + timezoneOffset * 60000 - 4 * 60 * 60 * 1000);
        const endInEastern = new Date(event.end.getTime() + timezoneOffset * 60000 - 4 * 60 * 60 * 1000);
        if (startInEastern >= lunchStart && startInEastern < lunchEnd) {
            // If event starts during lunch, skip to next event
            continue;
        }

        if (endInEastern > lastEnd && lastEnd < lunchStart && startInEastern < lunchStart) {
            // If there's a gap before lunch, add slot before lunch
            const endBeforeLunch = startInEastern < lunchStart ? startInEastern : lunchStart;
            slots.push({ start: lastEnd, end: endBeforeLunch });
        } else if (lastEnd >= lunchEnd && startInEastern > lastEnd) {
            // If last event ended after lunch and there's a gap, add slot after lunch
            slots.push({ start: lastEnd, end: startInEastern });
        }

        // Update lastEnd considering the event's end time and lunch time
        if (endInEastern > lastEnd) {
            if (endInEastern <= lunchStart || startInEastern >= lunchEnd) {
                // Update lastEnd if the event ends before lunch starts or starts after lunch ends
                lastEnd = endInEastern;
            } else if (lastEnd < lunchStart && endInEastern > lunchStart) {
                // If the event ends after lunch starts but the last event ended before lunch, set lastEnd to lunchEnd
                lastEnd = lunchEnd;
            }
        }
    }

    // After all events, if there's time left in the day, add final slot
    if (lastEnd < endOfDay) {
        if (lastEnd < lunchStart) {
            // If last event ends before lunch, add slot up to lunch and then after lunch to end of day
            slots.push({ start: lastEnd, end: lunchStart });
            if (lunchEnd < endOfDay) {
                slots.push({ start: lunchEnd, end: endOfDay });
            }
        } else if (lastEnd >= lunchEnd && lastEnd < endOfDay) {
            // If last event ends after lunch but before end of day, add slot from last event end to end of day
            slots.push({ start: lastEnd, end: endOfDay });
        }
    }

    return slots;
}


interface Event {
    workerId: string;
    jobId: string;
    start: Date;
    end: Date;
    title: string;
}