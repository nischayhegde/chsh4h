import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO, format } from 'date-fns';
import Navbar from '../components/Navbar';

const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [signups, setSignups] = useState({});
  const [codes, setCodes] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    checkIfUserIsLoggedIn();
    const fetchEvents = async () => {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/getall');
      setEvents(response.data.map(event => ({...event, datetime: parseISO(event.datetime)})));
      const statusUpdates = {};
      for (let event of response.data) {
        statusUpdates[event.id] = await getEventStatus(event.id);
      }
      setSignups(statusUpdates);
    };
    fetchEvents();
  }, []);

  const checkIfUserIsLoggedIn = async () => {
    const token = window.localStorage.getItem("auth_token");
    if (token) {
        const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', { token });
        setUserLoggedIn(response.data.authenticated);
      }
  }

  const calendarEvents = events.map(event => ({
    title: event.name,
    start: event.datetime, // Assuming the event lasts for a day
    end: event.datetime,
    event // Include the original event object in the calendar event
  }));

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.event); // Save the original event object when a calendar event is clicked
  };

  const getEventStatus = async (eventId) => {
    try {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/status', {
        token: window.localStorage.getItem("auth_token"), 
        eventid: eventId,
      });
      return response.data.status;
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  const handleSignup = async (eventId) => {
    try {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/signup', {
        token: window.localStorage.getItem("auth_token"),
        eventid: eventId,
      });
      if (response.status === 200) {
        setSignups({...signups, [eventId]: 'signed up'}); // Update signup status immediately
      } else {
        setError("Could not sign up. Please try again.");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  const deleteSignup = async (eventId) => {
    try {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/delete_signup', {
        token: window.localStorage.getItem("auth_token"), 
        eventid: eventId,
      });
      if (response.status === 200) {
        setSignups({...signups, [eventId]: false});
      } else {
        setError("Could not delete signup. Please try again.");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  const handleCodeSubmit = async (eventId) => {
    try {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/attendevent', {
        token: window.localStorage.getItem("auth_token"), 
        eventid: eventId,
        code: codes[eventId],
      });
      if (response.status === 200) {
        setSignups({...signups, [eventId]: 'attended'});
      } else {
        setError(response.data.message);  // Handle error messages sent from the backend
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center pt-24 px-4 sm:px-8 py-8">
      <Navbar />
      <h1 className="text-4xl font-bold text-dark-green mb-8">Upcoming Events</h1>
      <div className="flex flex-col lg:flex-row items-start w-full max-w-6xl">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
          {selectedEvent && (
            <div key={selectedEvent.id} className="p-4 bg-white shadow-md rounded">
              <h2 className="text-2xl font-semibold mb-2 text-dark-gray">{selectedEvent.name}</h2>
              <p className="mb-2 text-lg text-dark-gray">Description: {selectedEvent.description}</p>
              <p className="mb-2 text-lg text-dark-gray">Date and Time: {format(selectedEvent.datetime, 'yyyy-MM-dd HH:mm')}</p>
              <p className="mb-2 text-lg text-dark-gray">Volunteer Hours: {selectedEvent.hours}</p>
              <p className="mb-2 text-lg text-dark-gray">Address: {selectedEvent.address}</p>
              {userLoggedIn && <>
                {signups[selectedEvent.id] === 'attended' || signups[selectedEvent.id] === 'event finished' ?
                  <p className="text-lg text-dark-gray">{signups[selectedEvent.id]}</p> :
                  signups[selectedEvent.id] === 'signed up' ?
                  <>
                    <input 
                      type="text" 
                      maxLength="6"
                      value={codes[selectedEvent.id] || ''}
                      onChange={(e) => setCodes({...codes, [selectedEvent.id]: e.target.value})}
                      className="px-2 py-1 text-lg bg-white border rounded mb-2 w-full"
                      placeholder="Enter code"
                    />
                    <button onClick={() => handleCodeSubmit(selectedEvent.id)} className="px-6 py-2 text-lg text-white bg-dark-green rounded hover:bg-dark-gray w-full">Mark as Attended</button>
                    <button onClick={() => deleteSignup(selectedEvent.id)} className="px-6 py-2 text-lg text-white bg-red-500 rounded hover:bg-red-600 w-full mt-2">Delete Signup</button>
                  </> :
                  <button onClick={() => handleSignup(selectedEvent.id)} className="px-6 py-2 text-lg text-white bg-primary-green rounded hover:bg-dark-green w-full">Sign up</button>
                }
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                </>
              }
            </div>
          )}
      </div>
    </div>
  );
};

export default Events;