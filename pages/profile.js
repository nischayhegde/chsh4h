import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router'
import { parseISO, format } from 'date-fns';
import Link from 'next/link';

const ProfilePage = (props) => {
    const [user, setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [signups, setSignups] = useState({});
    const [codes, setCodes] = useState({});
    const router = useRouter();

    const getEventStatus = async (eventId) => {
        try {
            const token = window.localStorage.getItem("auth_token");
            const response = await axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/status', {
                token: token, 
                eventid: eventId,
            });
            return response.data.status;
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        const token=window.localStorage.getItem("auth_token");
        if(token!=null){
            axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', {token : token}).then(response => {if(!response.data.authenticated){router.push("/login")}})
        }
        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/getuserdata', {
            token: token
        })
        .then(response => {
            setUser(response.data.userdata[0]);
        }).catch((err) => {
            setError(err.response.data.message);
        });

        axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/events/getall', {
            token: token
        })
        .then(async response => {
            const statusUpdates = {};
            for (let event of response.data) {
                statusUpdates[event.id] = await getEventStatus(event.id);
            }
            setEvents(response.data.map(event => ({...event, datetime: parseISO(event.datetime)})));
            setSignups(statusUpdates);
        }).catch((err) => {
            setError(err.response.data.message);
        });

    }, []);

    const handleLogout = () => {
        const token = localStorage.getItem('auth_token');
        axios.post("https://h4api-9d2bafe7d30a.herokuapp.com/api/logout", {
            token: token
        })
        .then( response => {
            localStorage.removeItem("token");
            router.push("/");
            setError(response.data.message);
        })
        .catch((err) => {
            setError(err.response.data.message);
        });
    }

    const handleDeleteSignup = (eventId) => {
        const token = localStorage.getItem('auth_token');
        axios.post("https://h4api-9d2bafe7d30a.herokuapp.com/api/events/delete_signup", {
            token: token,
            eventid: eventId
        })
        .then(response => {
            setSignups({...signups, [eventId]: false});
        })
        .catch(err => {
            setError(err.response.data.message);
        });
    }

    const handleAttendEvent = (eventId, code) => {
        const token = localStorage.getItem('auth_token');
        axios.post("https://h4api-9d2bafe7d30a.herokuapp.com/api/events/attendevent", {
            token: token,
            eventid: eventId,
            code: code
        })
        .then(response => {
            setSignups({...signups, [eventId]: 'attended'});
        })
        .catch(err => {
            setError(err.response.data.message);
        });
    }

    const signedUpEvents = events.filter(event => (signups[event.id] === 'signed up') || (signups[event.id] === 'attended'));

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
                <h2 className="text-2xl font-semibold text-dark-gray">-User Profile-</h2>
                <div className="mt-4 text-lg text-gray-600">
                    <div className="mb-2"><span className="font-medium text-dark-green">Name: </span>{user.name}</div>
                    <div className="mb-2"><span className="font-medium text-dark-green">Email: </span>{user.email}</div>
                    <div className="mb-4"><span className="font-medium text-dark-green">Officer: </span>{String(user.admin)}</div>
                    <div className="mb-2"><span className="font-medium text-dark-green">Points: </span>{user.points}</div>
                    <div className="mb-4"><span className="font-medium text-dark-green">Volunteer Hours: </span>{user.hours}</div>
                    <div className="flex flex-col">
                        {user.admin &&
                            <Link href="/adminpanel">
                                <button
                                    className="w-full sm:w-auto bg-dark-gray hover:bg-black text-white font-medium py-2 px-4 rounded">
                                    Admin Panel
                                </button>
                            </Link>
                        }
                        <div>
                            <button 
                                onClick={handleLogout} 
                                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded mt-4">
                                Logout
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                </div>

                <h2 className="text-2xl font-semibold text-dark-gray mt-8">My Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {signedUpEvents.map(event => (
                        <div key={event.id} className="p-4 bg-white shadow-md mt-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2 text-dark-gray">{event.name}</h2>
                            <p className="mb-2 text-lg text-dark-gray">Description: {event.description}</p>
                            <p className="mb-2 text-lg text-dark-gray">Date and Time: {format(event.datetime, 'yyyy-MM-dd HH:mm')}</p>
                            <p className="mb-2 text-lg text-dark-gray">Volunteer Hours: {event.hours}</p>
                            <p className="mb-2 text-lg text-dark-gray">Address: {event.address}</p>

                            {signups[event.id] === 'attended' || signups[event.id] === 'event finished' ?
                                <p className="text-lg text-dark-gray">{signups[event.id]}</p> :
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
                                    <button onClick={() => handleAttendEvent(event.id, codes[event.id])} className="px-6 py-2 text-lg text-white bg-dark-green rounded hover:bg-dark-gray w-full">Mark as Attended</button>
                                    <button onClick={() => handleDeleteSignup(event.id)} className="px-6 py-2 text-lg text-white bg-red-500 rounded hover:bg-red-600 w-full mt-2">Delete Signup</button>
                                </> :
                                null
                            }
                            {error && <p className="text-red-500 text-xs italic">{error}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;