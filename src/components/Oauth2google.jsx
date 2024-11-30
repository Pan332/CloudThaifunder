import React, { useState, useEffect } from 'react';
import googleButton from '/btn_google_signin_dark_pressed_web.png';

const API_URL = import.meta.env.VITE_API_URL;

function navigate(url) {
    window.location.href = url;
}

async function auth() {
    try {
        const response = await fetch(`${API_URL}/Oauth2/google/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            navigate(data.url); // Redirect user to Google authentication URL
        } else {
            console.error("Failed to initiate Google login:", data.message);
        }
    } catch (err) {
        console.error("Error during Google login request:", err);
    }
}

async function handleGoogleCallback() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('token1');  // Updated to match query parameter from backend
    const refreshToken = params.get('token2');  // Updated to match query parameter from backend

    if (accessToken && refreshToken) {
        // Save tokens to localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Optionally, fetch user info using the access token and display in UI
        console.log("Logged in with Google successfully");

        // Redirect to the main app page (or dashboard)
        navigate("/");  // Example redirect after successful login
    } else {
        console.error("Google callback did not return tokens");
    }
}

handleGoogleCallback()

function GoogleLogin() {
    useEffect(() => {
        // Handle callback after Google redirects back
        handleGoogleCallback();
    }, []);

    return (
        <>
          
             <a onClick={() => auth()} alt= "google sign in"> 
             <img className="btn-auth-img" src={googleButton} alt="google sign in" />
             </a>
        </>
    );
} 

export default GoogleLogin;