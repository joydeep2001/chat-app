import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosWrapper from '../hooks/useAxiosWrapper';
import { AppContext } from '../context/AppContex';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
    const { data, fetchData} = useAxiosWrapper("/auth/login", {
        method: "POST",
    })
  const {dispatch} = useContext(AppContext);

  const onSubmit = (data) => {
    // Here you can add your logic for authentication
    console.log('Submitted data:', data);
    fetchData("/auth/login", {
        method: "POST",
        data: {
            id: data.username,
            password: data.password
        },
        
    })
  };

  useEffect(() => {
    if(data && data.success) {
      dispatch({type: "LOGIN_STATUS", value: true});
      dispatch({type: "UID", value: data.user_id});
    }
  }, [data])


  return (
    <div className="login-container"> {/* Apply container style */}
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}> {/* Apply form style */}
        <div>
          <label htmlFor="username">Username or email:</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.username && <span className="error-message">This field is required</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.password && <span className="error-message">This field is required</span>}
        </div>
        <button type="submit" className="login-button">Login</button> {/* Apply button style */}
      </form>
    </div>
  );
};

export default LoginPage;
