const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleAuth');
const { DateTime } = require('luxon');

class CalendarService {
    constructor() {
        // Set credentials using refresh token
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        this.timeZone = 'America/Chicago';
    }

    async getAvailableSlots(startDate, endDate) {
        try {
            // Verify auth is working
            if (!oauth2Client.credentials || !oauth2Client.credentials.refresh_token) {
                throw new Error('Google Calendar not authenticated. Missing credentials.');
            }

            // Ensure we're working with valid dates
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            // Validate date range
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date range provided');
            }

            const response = await this.calendar.freebusy.query({
                requestBody: {
                    timeMin: startDate.toISOString(),
                    timeMax: endDate.toISOString(),
                    items: [{ id: 'primary' }],
                    timeZone: this.timeZone
                }
            });

            if (!response.data || !response.data.calendars || !response.data.calendars.primary) {
                throw new Error('Invalid response from Google Calendar API');
            }

            const busySlots = response.data.calendars.primary.busy || [];
            
            
            const availableSlots = this.generateAvailableSlots(startDate, endDate, busySlots);
           
            return availableSlots;
        } catch (error) {
            console.error('Error fetching calendar slots:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });
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
        // Set working hours (9 AM to 5 PM)
        const workingHours = {
            start: 9,
            end: 17
        };

    
        const slots = [];
        let currentDate = DateTime.fromJSDate(startDate)
            .setZone(this.timeZone)
            .startOf('day');
        const endDateTime = DateTime.fromJSDate(endDate)
            .setZone(this.timeZone);
        const interval = 30;

        while (currentDate <= endDateTime) {
            if (currentDate.weekday !== 6 && currentDate.weekday !== 7) {
                for (let hour = workingHours.start; hour < workingHours.end; hour++) {
                    for (let minute = 0; minute < 60; minute += interval) {
                        const slotStart = currentDate.set({
                            hour,
                            minute,
                            second: 0,
                            millisecond: 0
                        });
                        
                        const slotEnd = slotStart.plus({ minutes: interval });

                        // Check if slot overlaps with any busy time
                        const isAvailable = !busySlots.some(busy => {
                            const busyStart = DateTime.fromISO(busy.start).setZone(this.timeZone);
                            const busyEnd = DateTime.fromISO(busy.end).setZone(this.timeZone);
                            return slotStart < busyEnd && slotEnd > busyStart;
                        });

                        if (isAvailable && slotStart > DateTime.now().setZone(this.timeZone)) {
                            slots.push(slotStart.toISO());
                        }
                    }
                }
            }
            currentDate = currentDate.plus({ days: 1 });
        }

        return slots;
    }

    calculateEndTime(date, time, duration) {
        const startDateTime = DateTime.fromFormat(`${date}T${time}`, "yyyy-MM-dd'T'HH:mm", {
            zone: this.timeZone
        });
        return startDateTime.plus({ minutes: duration }).toISO();
    }
}

module.exports = new CalendarService(); 