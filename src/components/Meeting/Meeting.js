import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Meeting.css';
import { DateTime } from 'luxon';

const API_URL = process.env.REACT_APP_API_URL;

function Meeting() {
    const [meetingCount, setMeetingCount] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        time: '',
        topic: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slotsForDay, setSlotsForDay] = useState([]);
    const maxTopicLength = 200;
    const [isLoadingSlots, setIsLoadingSlots] = useState(true);

    // Email validation regex
    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        fetchMeetingCount();
        fetchAvailableSlots();
    }, []);

    const fetchMeetingCount = async () => {
        try {
            const response = await fetch(`${API_URL}/api/analytics/meetings`);
            const data = await response.json();
            setMeetingCount(data.totalMeetings);
        } catch (error) {
            console.error('Error fetching meeting count:', error);
        }
    };

    const fetchAvailableSlots = async () => {
        setIsLoadingSlots(true);
        try {
            const response = await fetch(`${API_URL}/api/calendar/slots`);
            const data = await response.json();
            if (data.slots) {
                setAvailableSlots(data.slots.map(slot => new Date(slot)));
                // Set initial slots for today
                const todaySlots = data.slots.filter(slot => 
                    new Date(slot).toDateString() === new Date().toDateString()
                );
                setSlotsForDay(todaySlots);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setStatus('Failed to load available slots');
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');

        // Validate form data
        if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.topic) {
            setErrors({
                name: !formData.name && 'Name is required',
                email: !formData.email && 'Email is required',
                date: !formData.date && 'Date is required',
                time: !formData.time && 'Time is required',
                topic: !formData.topic && 'Topic is required'
            });
            setIsLoading(false);
            return;
        }

        // Combine date and time into a single DateTime
        const [hours, minutes] = formData.time.split(':');
        const startDateTime = new Date(formData.date);
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        
        // Add 30 minutes for end time
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        const meetingData = {
            name: formData.name,
            email: formData.email,
            topic: formData.topic,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: "America/Chicago"
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: "America/Chicago"
            }
        };

        try {
            const response = await fetch(`${API_URL}/api/calendar/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(meetingData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('Meeting scheduled successfully! Check your email for details.');
                setFormData({
                    name: '',
                    email: '',
                    date: '',
                    time: '',
                    topic: ''
                });
                setMeetingCount(prev => prev + 1);
                // Refresh available slots
                fetchAvailableSlots();
            } else {
                throw new Error(data.error || 'Failed to schedule meeting');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Failed to schedule meeting. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Filter slots for the selected date
        const newSlots = availableSlots.filter(slot => 
            slot.toDateString() === date.toDateString()
        );
        setSlotsForDay(newSlots);
        setFormData(prev => ({
            ...prev,
            date: date.toISOString().split('T')[0]
        }));
    };

    const TimeSlots = () => {
        if (isLoadingSlots) {
            return <div className="loading-slots">Loading available times...</div>;
        }

        if (slotsForDay.length === 0) {
            return (
                <div className="no-slots-message">
                    <p>No available slots for this date.</p>
                    <p>Please select another date.</p>
                </div>
            );
        }

        return (
            <div className="time-slots-grid">
                {slotsForDay.map((slot, index) => {
                    // Convert the ISO string to a formatted time in Chicago timezone
                    const slotTime = DateTime
                        .fromISO(slot)
                        .setZone('America/Chicago')
                        .toLocaleString(DateTime.TIME_SIMPLE);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                const time = DateTime
                                    .fromISO(slot)
                                    .setZone('America/Chicago')
                                    .toFormat('HH:mm');
                                    
                                setFormData(prev => ({
                                    ...prev,
                                    time
                                }));
                            }}
                            className={`time-slot ${
                                formData.time === DateTime
                                    .fromISO(slot)
                                    .setZone('America/Chicago')
                                    .toFormat('HH:mm')
                                    ? 'selected'
                                    : ''
                            }`}
                        >
                            {slotTime}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.section 
            className="meeting-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="meeting-header">
                <h1>Schedule a Meeting</h1>
                <p>Select a date and time slot below</p>
                <div className="meeting-stats">
                    <span>{meetingCount} meetings scheduled</span>
                </div>
            </div>

            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                    tileDisabled={({ date }) => {
                        return date.getDay() === 0 || 
                               date.getDay() === 6 || 
                               !availableSlots.some(slot => 
                                   slot.toDateString() === date.toDateString()
                               );
                    }}
                    className="meeting-calendar"
                />

                <div className="time-slots">
                    <h3>Available Times for {selectedDate.toLocaleDateString()}</h3>
                    <TimeSlots />
                </div>
            </div>

            <div className="form-container">
                <div className="form-header">
                    <h2>Meeting Details</h2>
                    <p className="form-subtitle">Enter your information for the Google Meet invitation</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                    </div>
                    
                    <div className="form-group subject">
                        <label htmlFor="topic">Meeting Subject</label>
                        <textarea
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="What would you like to discuss?"
                            maxLength={maxTopicLength}
                        />
                        {errors.topic && <p className="error">{errors.topic}</p>}
                    </div>

                    <div className="submit-container">
                        <div className="submit-info">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"/>
                            </svg>
                            You'll receive a Google Meet link via email
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
                        </button>
                        {status && <p className="status">{status}</p>}
                    </div>
                </form>
            </div>
        </motion.section>
    );
}

export default Meeting; 