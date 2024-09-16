import React from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Previene que la página se recargue al enviar el formulario
        // Lógica de autenticación aquí (si es necesario)
        navigate('/principal'); // Redirige a la página deseada, como por ejemplo "/home"
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required />
                    <FaUser className='icon'/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <FaLock className='icon'/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
