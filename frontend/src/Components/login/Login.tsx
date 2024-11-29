import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/redux/features/users/userSlice';
import { useAppDispatch } from '../../redux/redux/hooks';
import { useLoginMutation } from '../../redux/redux/features/users/authApiSlice';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
    email: string;
}

const Login = () => {
    const [loginUser] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                // Decodificar el token JWT para obtener la información del usuario
                const decoded: DecodedToken = jwt_decode(credentialResponse.credential);
                const { email } = decoded;

                // Enviar el token al backend para verificarlo y obtener el token de tu aplicación
                const loginResult = await loginUser({ token: credentialResponse.credential }).unwrap();

                if (loginResult.accessToken) {
                    const loggedUser = {
                        accessToken: loginResult.accessToken,
                        user: { email },
                    };
                    dispatch(setUser(loggedUser));
                    navigate('/principal');
                } else {
                    console.error('El backend no devolvió un accessToken');
                }
            } catch (error) {
                console.error('Error durante el inicio de sesión con Google:', error);
            }
        }
    };

    const handleGoogleLoginFailure = (error: any) => {
        console.error('Error en el inicio de sesión con Google:', error);
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
