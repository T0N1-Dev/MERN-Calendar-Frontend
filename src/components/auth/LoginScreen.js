import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useDispatch } from 'react-redux';
import { startLogin } from '../../actions/auth';
import Swal from 'sweetalert2';

export const LoginScreen = () => {

    const dispatch = useDispatch();
    const [ formLoginValues, handleLoginInputChange ] = useForm({
        email: 'antonio@gmail.com',
        password: '123456',
    });

    const { email, password } = formLoginValues;
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await dispatch(startLogin(email, password));
        } catch (error) {
            return Swal.fire('Error', 'Login Error!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container login-container">
            <div className="col-md-12 login-form-1">
                <span>
                    <i className="fa-solid fa-lock"></i>&nbsp;&nbsp;Login
                </span>
                <form
                    className='animate__animated animate__fadeIn'
                    onSubmit={ handleLogin }
                >
                    <div className="form-group mb-2">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={ handleLoginInputChange }
                        />
                    </div>
                    <div className="form-group mb-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={ handleLoginInputChange }
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className={`btnSubmit ${loading ? 'btn-disabled' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div class="spinner-border spinner-border-sm" role="status"></div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                    <br></br>

                    <Link to="/register" className='link'>
                        Create a new account
                    </Link>
                </form>
            </div>
        </div>
    )
}