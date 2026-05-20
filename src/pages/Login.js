import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "https://mini-n54f.onrender.com/users/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");

    } catch(error){

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };



  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #1877f2, #42a5f5)"
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "40px",
          width: "350px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#1877f2",
            marginBottom: "30px"
          }}
        >
          LOGIN
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/register"
            style={{
              color: "#1877f2",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Register
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;