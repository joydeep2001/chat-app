import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosWrapper from "../hooks/useAxiosWrapper";
import { AppContext } from "../context/AppContex";
import { Link,useNavigate } from "react-router-dom";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data, fetchData } = useAxiosWrapper(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
    method: "POST",
  });
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Here you can add your logic for authentication
    console.log("Submitted data:", data);
    fetchData(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
      method: "POST",
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        user_id: data.username
      },
    });
  };

  useEffect(() => {
    if (data && data.success) {
        alert("Account created successfully!! Now please Login to continue");
        navigate('/');
    }
  }, [data]);

  return (
    <div className="login-container">
      {" "}
      {/* Apply container style */}
      <h2>VartaalUp | Signup</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/*Name */}
        <div>
          <label htmlFor="username">Your Name:</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.name && (
            <span className="error-message">This field is required</span>
          )}
        </div>
        {/* username */}
        <div>
          <label htmlFor="username">Create an Username:</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.username && (
            <span className="error-message">This field is required</span>
          )}
        </div>
        {/* password */}
        <div>
          <label htmlFor="password">Set Password:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.password && (
            <span className="error-message">This field is required</span>
          )}
        </div>
        {/* email */}
        <div>
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="input-field" // Apply input field style
          />
          {errors.email && (
            <span className="error-message">This field is required</span>
          )}
        </div>
        <button type="submit" className="login-button">
          Signup
        </button>{" "}
        {/* Apply button style */}
      </form>
      <Link to="/">Already Have an account?</Link>
    </div>
  );
};

export default SignupPage;
