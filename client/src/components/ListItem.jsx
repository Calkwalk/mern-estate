import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import { Modal } from 'antd';

const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL
const ListItem = ({ listingItem, setUserListings }) => {
    const [coverImageUrl, setCoverImageUrl] = useState('/assets/avatar.png');
    const [isShowModal, setIsShowModal] = useState(false);

    useEffect(() => {
        const getCoverImageUrl = () => {
            if (listingItem.images !== null) {
                const images = JSON.parse(listingItem.images)
                if (images.length > 0) {
                    const coverImageName = images[0].filename
                    setCoverImageUrl(API_URL + '/assets/upload/' + coverImageName)
                }

            }
        };
        getCoverImageUrl()

    }, []);

    const handleDeleteListing = () => {
        fetch(API_URL + '/api/listing/delete/' + listingItem.id, {
            method: 'DELETE',
            credentials: 'include'
        }).then(res => res.json()).then(result => {
            if (result.success) {
                setUserListings(prev => prev.filter(item => item.id != listingItem.id));
            }
        });
        setIsShowModal(false);
    };

    const handleEditListing = () => {

    };

    return (

        <div className='mb-2 px-4 py-2 border border-gray-100 rounded-md w-full bg-gary-50 flex flex-row gap-4 items-center justify-between'>
            <Link to={`/listing/${listingItem.id}`} >
                <img src={coverImageUrl} alt='image' className='w-12 h-12' />
            </Link>
            <Link to={`/listing/${listingItem.id}`} className='flex-1' >
                <p className='text-sm font-semibold hover:underline truncate'>{listingItem.listName}</p>
                <p className='text-xs text-gray-500 mt-2'>
                    {listingItem.beds} Beds, {listingItem.baths} Baths,
                    <span className='ml-3 text-red-400'>{listingItem.price} $/month</span>
                </p>
            </Link>
            <div className='flex flex-row gap-2'>

                <Link to={`/updatelist/${listingItem.id}`}>
                    <button type='button' onClick={handleEditListing}
                        className='bg-green-400 text-white text-xs p-2 w-16 rounded-md hover:opacity-75'>Edit</button>
                </Link>
                <button onClick={() => setIsShowModal(true)}
                    className='bg-red-500 text-white text-xs p-2 w-16 rounded-md  hover:opacity-75'>Delete</button>
            </div>

            <Modal title='Delete Listing' open={isShowModal} onOk={handleDeleteListing} onCancel={() => setIsShowModal(false)}>
                <p>Are you sure to DELETE the listing?</p>
            </Modal>
        </div>
    )
}

export default ListItem