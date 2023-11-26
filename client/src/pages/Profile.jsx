import React, { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import ListItem from '../components/ListItem';

const Profile = () => {
  const [, , removeCookie] = useCookies("http://localhost:75173");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({ username: currentUser.username, email: currentUser.email });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [userListings, setUserListings] = useState([]);

  const imageInputRef = useRef()

  const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)
    try {
      dispatch(updateUserStart());
      const res = await fetch(API_URL + `/api/user/update/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // credentials: 'include' (for axios)
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      console.log(data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleFileChange = (e) => {
    const filename = e.target.value;
    setFile(filename);
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(API_URL + `/api/user/delete/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // credentials: 'include' (for axios)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(API_URL + '/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      removeCookie('access_token');
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  const handleCreateList = () => {
    navigate('/createlist')
  }

  const handleGetUserList = () => {
    //set query status

    fetch(API_URL + '/api/user/listing/' + currentUser.id)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setUserListings(result.data)
        } else {
          console.error('get userlist failed')
        }
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        //Todo: reset status
      });
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form id='profile-form' className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' ref={imageInputRef} hidden accept='image/*' onChange={handleFileChange} />
        <img src='/assets/avatar.png' art='avatar'
          className='h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2 border-2 p-0.5 border-slate-200'
          onClick={() => imageInputRef.current?.click()} />

        <input
          type="text"
          placeholder='Username'
          id='username'
          autoComplete='username'
          value={formData?.username}
          className='border rounded-lg p-3 max-w-lg'
          onChange={handleInputChange}
        />
        <input
          type="email"
          placeholder='Email'
          id='email'
          value={formData?.email}
          autoComplete='email'
          className='border rounded-lg p-3 max-w-lg'
          onChange={handleInputChange}
        />
        <input type="password" placeholder='Password' id='password'
          className='border rounded-lg p-3 max-w-lg'
          onChange={handleInputChange}
        />

        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opcaity-95 disabled:opacity-80 cursor-pointer flex justify-center items-center gap-2'
        >
          Update
          {loading && <svg height={16} width={16} viewBox='0 0 1024 1024' className='animate-spin'>
            <path d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 
            3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 
            13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 
            1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 
            0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 
            17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 
            0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 
            34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z 
            m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 
            36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 
            42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 
            48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 
            48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 
            17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 
            17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 
            68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z 
            m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 
            67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 
            23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 
            0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 
            0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 
            25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 
            61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
              fill="#ffffff"></path>
          </svg>}
        </button>

        <button
          type='button'
          onClick={handleCreateList}
          className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opcaity-95 disabled:opacity-80 cursor-pointer flex justify-center items-center gap-2'
        >
          Create List
        </button>
      </form>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>




      <div className='flex flex-row items-center justify-between mt-4'>
        <span className='text-red-400 font-semibold cursor-pointer hover:underline underline-offset-2' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-400 font-semibold cursor-pointer hover:underline underline-offset-2' onClick={handleSignOut}>Sign Out</span>
      </div>

      <div className='flex flex-col justify-center items-center my-7'>
        <button
          type='button'
          onClick={handleGetUserList}
          className='bg-transparent text-slate-700 font-semibold border rounded-xl w-[60%] px-4 py-3 underline-offset-1 hover:bg-slate-700 hover:text-white'
        >
          Show My List
        </button>
        <div className='mt-2 w-full'>
          {userListings.length > 0 &&
            <div className='flex flex-row justify-between items-end'>
              <h1 className='my-4 font-semibold'>My Listings:</h1>
              <button onClick={() => setUserListings([])}
                className='mr-4 mb-2 h-8 px-2 text-xs hover:underline'>Hidden</button>
            </div>
          }


          {userListings.map((item, index) => (
            <ListItem key={index} listingItem={item} setUserListings={setUserListings} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile