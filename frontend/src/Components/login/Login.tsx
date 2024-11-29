import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/redux/features/users/userSlice';
import { useAppDispatch } from '../../redux/redux/hooks';
import { useGoogleLoginMutation } from '../../redux/redux/features/users/authApiSlice';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    email: string;
}

const Login = () => {
    const [googleLogin] = useGoogleLoginMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const decoded: DecodedToken = jwtDecode(credentialResponse.credential);
                const { email } = decoded;

                const loginResult = await googleLogin({ token: credentialResponse.credential }).unwrap();

                if (loginResult.access) {
                    const loggedUser = {
                        accessToken: loginResult.access,
                        user: { email },
                    };
                    dispatch(setUser(loggedUser));
                    navigate('/principal');
                } else {
                    console.error('El backend no devolvió un access token');
                }
            } catch (error) {
                console.error('Error durante el inicio de sesión con Google:', error);
            }
        }
    };

    const handleGoogleLoginFailure = () => { 
        console.error('Error en el inicio de sesión con Google.');
    };

    return (
        <div className="wrapper">
            <h1>Login</h1>
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
            />
        </div>
    );
};

export default Login;
