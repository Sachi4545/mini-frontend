import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  


  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      

      const res = await axios.post(
        "http://localhost:5000/users/register",
        formData
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
        "Register Failed"
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
        onSubmit={handleRegister}
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
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
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
            marginBottom: "15px",
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
          Register
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#1877f2",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Register;