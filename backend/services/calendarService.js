const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleAuth');

class CalendarService {
    constructor() {
        // Set credentials using refresh token
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    async getAvailableSlots(startDate, endDate) {
        try {
            const response = await this.calendar.freebusy.query({
                requestBody: {
                    timeMin: startDate.toISOString(),
                    timeMax: endDate.toISOString(),
                    items: [{ id: 'primary' }]
                }
            });

            const busySlots = response.data.calendars.primary.busy;
            return this.generateAvailableSlots(startDate, endDate, busySlots);
        } catch (error) {
            console.error('Error fetching calendar slots:', error);
            throw error;
        }
    }

    async createMeeting(meetingDetails) {
        try {
            const event = {
                summary: `Meeting with ${meetingDetails.name}`,
                description: meetingDetails.topic,
                start: {
                    dateTime: meetingDetails.start.dateTime,
                    timeZone: meetingDetails.start.timeZone
                },
                end: {
                    dateTime: meetingDetails.end.dateTime,
                    timeZone: meetingDetails.end.timeZone
                },
                attendees: [
                    { email: meetingDetails.email }
                ],
                conferenceData: {
                    createRequest: {
                        requestId: Math.random().toString(),
                        conferenceSolutionKey: { type: 'hangoutsMeet' }
                    }
                }
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all'
            });

            return response.data;
        } catch (error) {
            console.error('Error creating meeting:', error);
            throw error;
        }
    }

    generateAvailableSlots(startDate, endDate, busySlots) {
        // Define your working hours
        const workingHours = {
            start: 9, // 9 AM
            end: 17   // 5 PM
        };

        const slots = [];
        const currentDate = new Date(startDate);
        const interval = 30; // 30-minute slots

        while (currentDate <= endDate) {
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
                for (let hour = workingHours.start; hour < workingHours.end; hour++) {
                    for (let minute = 0; minute < 60; minute += interval) {
                        const slotStart = new Date(currentDate);
                        slotStart.setHours(hour, minute, 0, 0);

                        const slotEnd = new Date(slotStart);
                        slotEnd.setMinutes(slotStart.getMinutes() + interval);

                        // Check if slot overlaps with any busy time
                        const isAvailable = !busySlots.some(busy => {
                            const busyStart = new Date(busy.start);
                            const busyEnd = new Date(busy.end);
                            return slotStart < busyEnd && slotEnd > busyStart;
                        });

                        if (isAvailable && slotStart > new Date()) {
                            slots.push(slotStart.toISOString());
                        }
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return slots;
    }

    calculateEndTime(date, time, duration) {
        const startDateTime = new Date(date + 'T' + time);
        return new Date(startDateTime.getTime() + duration * 60000);
    }
}

module.exports = new CalendarService(); 