import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios'; // import axios
import { FETCH_CACHE_HEADER } from 'next/dist/client/components/app-router-headers';
import {useRouter} from 'next/router';
import { parseISO, format } from 'date-fns';

export default function Admin() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [sqlResult, setSqlResult] = useState(null);
    const [sqlError, setSqlError] = useState(null);
    const [formState, setFormState] = useState({
        name: "",
        points: 0,
        hours: 0,
        datetime: "",
        address: "",
        description: "",
        code: ""  // Add this line
    });
    const [statuses, setStatuses] = useState({});

    // Fetch events on component mount
    useEffect(() => {
        const token=window.localStorage.getItem("auth_token");
        if(token!=null){
          axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', {token : token}).then(response => {if(!response.data.authenticated){router.push("/login")}})
        }
        else {
            router.push("/signup")
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchStatuses();
    }, [events]);

    const fetchEvents = () => {
        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/getall')
            .then(res => setEvents(res.data))
    }

    const fetchStatuses = async () => {
        const statusUpdates = {};
        for (let event of events) {
          statusUpdates[event.id] = await getEventStatus(event.id);
        }
        setStatuses(statusUpdates);
      };

    const getEventStatus = async (eventId) => {
        try {
          const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/checkfinished', {
            eventid: eventId,
          });
          return response.data.finished;
        } catch (error) {
          setError(error.message);
        }
    }

    const handleChange = (event) => {
        const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value
        });
    };

    const handleNewEvent = (event) => {
        event.preventDefault();
        const token=window.localStorage.getItem("auth_token");
        
        if (formState.datetime instanceof Date) {
            formState.datetime = formState.datetime.toISOString();
        }
        const name=formState.name
        const points=formState.points
        const hours=formState.hours
        const datetime=formState.datetime
        const address=formState.address
        const description=formState.description
        const code=formState.code

        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/addnew', {token: token, name: name, points: points, hours: hours, datetime: datetime, address: address, description: description, code:code})
            .then(() => fetchEvents());
    };

    const handleDeleteEvent = (id) => {
        const token=window.localStorage.getItem("auth_token");
        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/delete', { id:id, token: token })
            .then(() => fetchEvents());
    };

    const handleExecuteSql = (event) => {
        event.preventDefault();
        const token=window.localStorage.getItem("auth_token");

        const command = event.target.elements.command.value;

        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/admin/execute_sql', { query: command, token: token })
            .then(res => {
                setSqlResult(JSON.stringify(res.data.results, null, 2));
                setSqlError(null);
            })
            .catch(err => {
                setSqlResult(null);
                setSqlError(err.response.data.message);
            });
    };

    const handleMarkFinished = async (eventId) => {
        try {
          const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/markfinished', {
            token: window.localStorage.getItem("auth_token"), 
            eventid: eventId,
          });
          if (response.status === 200) {
            fetchEvents();
          } else {
            setError("Could not mark event as finished. Please try again.");
          }
        } catch (error) {
          setError(error.message);
        }
    }

    return (
        <div>
            <Navbar/>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="py-20">
                    <h1 className="text-4xl font-bold">Admin Panel</h1>

                    <h2 className="text-3xl font-bold mt-8">Event Management</h2>
                    <form className="mt-4" onSubmit={handleNewEvent}>
                        <input className="mt-2 w-full p-2 border rounded" name="name" placeholder="Event Name" onChange={handleChange} required />
                        <input className="mt-2 w-full p-2 border rounded" name="points" type="number" placeholder="Points" onChange={handleChange} required />
                        <input className="mt-2 w-full p-2 border rounded" name="hours" type="number" placeholder="Hours" onChange={handleChange} required />
                        <input className="mt-2 w-full p-2 border rounded" name="code" maxLength="6" placeholder="Event Code" onChange={handleChange} required />
                        <input className="mt-2 w-full p-2 border rounded" name="datetime" type="datetime-local" onChange={handleChange} required />
                        <input className="mt-2 w-full p-2 border rounded" name="address" placeholder="Address" onChange={handleChange} required />
                        <textarea className="mt-2 w-full p-2 border rounded" name="description" placeholder="Description" onChange={handleChange} required />
                        <button className="mt-2 w-full p-2 border rounded bg-blue-500 text-white" type="submit">Add Event</button>
                    </form>

                    <ul className="mt-8">
                        {events.map(event => (
                            <li key={event.id} className="mt-2 p-2 border rounded">
                                <p>{event.name} - {event.points} points, {event.hours} hours</p>
                                <p>{format(parseISO(event.datetime), 'yyyy-MM-dd HH:mm')}</p>
                                <p>Status: {statuses[event.id] ? 'Finished' : 'Not Finished'}</p>
                                <button className="ml-4 p-2 border rounded bg-red-500 text-white" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                                {!statuses[event.id] && <button className="ml-4 p-2 border rounded bg-yellow-500 text-white" onClick={() => handleMarkFinished(event.id)}>Mark as Finished</button>}
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-3xl font-bold mt-8">SQL Command Execution</h2>
                    <form className="mt-4" onSubmit={handleExecuteSql}>
                        <textarea className="mt-2 w-full p-2 border rounded" name="command" required />
                        <button className="mt-2 w-full p-2 border rounded bg-blue-500 text-white" type="submit">Execute</button>
                    </form>
                    {sqlResult && <pre className="mt-2 p-2 border rounded">{sqlResult}</pre>}
                    {sqlError && <p className="mt-2 p-2 border rounded bg-red-500 text-white">Error: {sqlError}</p>}
                </div>
            </div>
        </div>
    );
}