import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { parseISO, format } from 'date-fns';
import Navbar from '../components/Navbar';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [signups, setSignups] = useState({});
  const [codes, setCodes] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);

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

  const eventsOnSelectedDate = events.filter(event => format(event.datetime, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

  const datesWithEvents = events.map(event => format(event.datetime, 'yyyy-MM-dd'));

  const checkIfUserIsLoggedIn = async () => {
    const token = window.localStorage.getItem("auth_token");
    if (token) {
        const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', { token });
        setUserLoggedIn(response.data.authenticated);
      }
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && datesWithEvents.includes(format(date, 'yyyy-MM-dd'))) {
      return 'event-day';
    }
  };

  const getEventStatus = async (eventId) => {
    try {
      const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/status', {
        token: window.localStorage.getItem("auth_token"), 
        eventid: eventId,
      });
      return response.data.status;
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center pt-24 px-4 py-8">
      <Navbar className="mb-4"/>
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Upcoming Events</h1>
      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl">
        <div className="mb-4 lg:mb-0 lg:w-1/2 lg:pr-8">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border rounded shadow p-4 mx-auto"
            tileClassName={tileClassName}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-1/2 lg:pl-8">
          {eventsOnSelectedDate.map(event => (
            <div key={event.id} className="p-4 bg-white shadow-md rounded">
              <h2 className="text-2xl font-semibold mb-2 text-blue-700">{event.name}</h2>
              <p className="mb-4 text-lg text-gray-700">Description: {event.description}</p>
              <p className="mb-4 text-lg text-gray-700">Date and Time: {format(event.datetime, 'yyyy-MM-dd HH:mm')}</p>
              <p className="mb-4 text-lg text-gray-700">Address: {event.address}</p>
              {userLoggedIn && <>
                {signups[event.id] === 'attended' || signups[event.id] === 'event finished' ?
                  <p className="text-lg text-gray-700">{signups[event.id]}</p> :
                  signups[event.id] === 'signed up' ?
                  <>
                    <input 
                      type="text" 
                      maxLength="6"
                      value={codes[event.id] || ''}
                      onChange={(e) => setCodes({...codes, [event.id]: e.target.value})}
                      className="px-2 py-1 text-lg bg-white border rounded mb-2 w-full"
                      placeholder="Enter code"
                    />
                    <button onClick={() => handleCodeSubmit(event.id)} className="px-6 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600 w-full">Mark as Attended</button>
                    <button onClick={() => deleteSignup(event.id)} className="px-6 py-2 text-lg text-white bg-red-500 rounded hover:bg-red-600 w-full mt-2">Delete Signup</button>
                  </> :
                  <button onClick={() => handleSignup(event.id)} className="px-6 py-2 text-lg text-white bg-green-500 rounded hover:bg-green-600 w-full">Sign up</button>
                }
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                </>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;