import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';

export const Navbar = () => {

  const { name } = useSelector( state => state.auth );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch( startLogout() );
  }

  return (
    <div className='navbar navbar-dark bg-dark mb-4'>
        <span className='navbar-brand mx-3'>
          <i className="fa-solid fa-user"></i>&nbsp;&nbsp;{name}
        </span>

        <div className='ml-auto'>
            <button 
              className='btn btn-dark mx-3'
              onClick={ handleLogout }
            >
                <i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;
                <span>Logout</span>
            </button>
        </div>
    </div>
  )
}
