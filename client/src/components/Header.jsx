import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
// import { useCookies } from 'react-cookie';
// import { getCookie, setCookie, deleteCookie } from '../utils/cookie';
const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  // const [ cookies, setCookie, removeCookie] = useCookies('http://localhost:5173');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // do not refresh view.

    console.log(searchTerm)

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm)

    const searchQuery = urlParams.toString()

    navigate(`/search?${searchQuery}`);
  }

  // apply for browse url change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Calkwalk</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSearchSubmit} id='search-form' className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            id='search-box'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search...'
            className='bg-transparent outline-none w-24 sm:w-64'
          />
          <button type='submit'>
            <FaSearch className='text-slate-600' />
          </button>

        </form>
        <ul className='flex gap-4 justify-center items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser
              ? (
                <div className='flex flex-row items-end justify-center gap-2'>
                  <div className='h-10 w-10 rounded-full bg-slate-500 flex justify-center items-center shadow-md shadow-slate-400'>
                    <FaUser color='#f3f3f3' size={24} />
                  </div>
                  <div className='w-24 md:w-40'>
                    <p className='text-xs text-gray-500 font-semibold'>{currentUser.username}</p>
                    <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                  </div>

                </div>

              )
              : (
                <li className='text-slate-700 hover:underline'>Sign In</li>
              )}
          </Link>

        </ul>
      </div>

    </header>
  )
}

export default Header