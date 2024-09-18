import { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {setUser} from '../../redux/redux/features/users/userSlice';
import { useAppDispatch } from '../../redux/redux/hooks';
import { useLoginMutation } from '../../redux/redux/features/users/authApiSlice';

const Login = () => {
  const [loginUser, {data: loginData, isError: isLoginError, isSuccess: isLoginSuccess}] = useLoginMutation()
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (email: string, password: string, event: any) => {
    try {
      event.preventDefault()
      const loginResult = await loginUser({ email: email, password });

      if ('data' in loginResult && 'accessToken' in loginResult.data) {
        console.log('entro handle Login');
        console.log('isLoginSuccess', isLoginSuccess);

        const data = loginResult.data as any;
        if (data.accessToken) {
          console.log('Login Request', data);
          const loggedUser = {
            accessToken: data.accessToken,
            user: { email },
          };
          dispatch(setUser(loggedUser));
          navigate('/principal');
        } else {
          console.error('Login response does not contain token')
        }
      } else {
        console.error('Login error:', loginResult);
      }
    } catch (error) {
      console.error('Other error:', error);
    }
  }

    return (
        <div className="wrapper">
            <form>
            <h1>Login</h1>
            <div className="input-box">
                <input type="text" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)} />
                <FaUser className='icon'/>
            </div>
            <div className="input-box">
                <input type="password" placeholder="Password" required onChange={(e)=>setPassword(e.target.value)} />
                <FaLock className='icon'/>
            </div>
            <button type="submit" onClick={(event)=>handleSubmit(email, password, event)}>Login</button>
            </form>
        </div>
    );
};

export default Login;
