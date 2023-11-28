import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = () => {
            fetch(API_URL + '/api/user/id/' + listing.userId, {
                method: 'GET',
                credentials: 'include'
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    setLandlord(result.data);
                } else {
                    console.log(result.message);
                }

            });
        };
        fetchLandlord();
    }, [listing.userId])
    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2 max-w-4xl'>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span>{' '}
                        for{' '}
                        <span className='font-semibold'>{listing.listName}</span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows='4'
                        value={message}
                        onChange={onChange}
                        placeholder='Enter your message here...'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.listName}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 max-w-sm uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

export default Contact