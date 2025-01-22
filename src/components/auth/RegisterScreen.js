import React from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2';
import { startRegister } from '../../actions/auth'

export const RegisterScreen = () => {

    const dispatch = useDispatch();
    const [ formRegisterValues, handleRegisterInputChange ] = useForm({
        name: 'Antonio',
        email: 'antonio@gmail.com',
        password1: '123456',
        password2: '123456'
    });

    const { name, email, password1, password2 } = formRegisterValues;

    const handleRegister = (e) => {
        e.preventDefault();

        if ( password1 !== password2 ) {
            return Swal.fire('Error', 'Both passwords must match', 'error');
        }

        dispatch(startRegister(email, password1, name));
    }

    return (
        <div className='row'>
            <div className="col-md-6 login-form-2">
                <span>
                    <i className="fa-solid fa-lock"></i>&nbsp;&nbsp;Register
                </span>
                <form
                    className='animate__animated animate__fadeIn'
                    onSubmit={handleRegister}
                >
                    <div className="form-group mt-3 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="name"
                            value={name}
                            onChange={ handleRegisterInputChange }
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={ handleRegisterInputChange }
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password" 
                            name="password1"
                            value={password1}
                            onChange={ handleRegisterInputChange }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            name="password2"
                            value={password2}
                            onChange={ handleRegisterInputChange }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input 
                            type="submit" 
                            className="btnSubmit mb-4" 
                            value="Register" />
                        <span>
                        </span>
                        <Link to="/login" className="link">
                            Already registered?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
