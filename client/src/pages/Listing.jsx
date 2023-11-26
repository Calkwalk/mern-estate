import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Spin, Carousel } from 'antd';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

const Listing = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState();
    const [listTypes, setListTypes] = useState(['rent']);
    const [images, setImages] = useState([])
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.id;
            setLoading(true)
            try {
                const res = await fetch(API_URL + '/api/listing/' + listingId, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const result = await res.json();

                console.log(result);


                if (result.success) {
                    const listing = result.data
                    setListTypes(JSON.parse(listing.types));

                    setImages(JSON.parse(listing.images));
                    setListing(listing)
                } else {
                    setError(true)
                }
            } catch (error) {
                setError(true)
                console.log(error)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 100);

            }


        };

        fetchListing();
    }, []);

    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    return (
        <main>
            {loading &&

                <Spin tip="Loading" size="large" className='text-gray-600'>
                    <div className='h-48'></div>
                </Spin>

            }

            {!loading && images.length > 0 &&
                <>
                    <Carousel autoplay autoplaySpeed={5000} >
                        {images.map((image, index) => (
                            <div key={index} className='w-full h-[550px] bg-slate-700 flex items-center justify-center'>
                                <img src={`${API_URL}/assets/upload/${image.filename}`} className='w-full h-[550px] object-contain' />


                            </div>
                        ))}

                    </Carousel>
                    <div className='fixed top-[11%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                </>
            }

            {!loading && listing &&
                <div className='mt-7 max-w-6xl bg-red-50 mx-auto p-3'>
                    <h3 className='text-gray-700 font-semibold text-2xl'>
                        {listing.listName} - <span className='font-normal text-xl text-red-400'>$ {listing.price} /month</span>
                    </h3>

                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>

                    <div className='flex gap-4 py-3'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                ${+listing.regularPrice - +listing.discountPrice} OFF
                            </p>
                        )}
                    </div>

                    <p className='text-slate-800'>
                        <span className='font-semibold text-black'>Description - </span>
                        {listing.description}
                    </p>

                    <ul className='text-green-900 font-semibold text-sm mt-2 flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg' />
                            {listing.beds> 1
                                ? `${listing.beds} beds `
                                : `${listing.beds} bed `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            {listing.baths > 1
                                ? `${listing.baths} baths `
                                : `${listing.baths} bath `}
                        </li>
                        {/* <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                            {listing.parking ? 'Parking spot' : 'No Parking'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg' />
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </li> */}
                    </ul>
                </div>
            }


        </main >
    )
}

export default Listing