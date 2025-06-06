import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import db from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

// This function is the log in page for the app 
const LogIn = () => {
    // everything we have to keep track of upon user login 
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [name, setName] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);
    const [authReady, setAuthReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // check if the user is already logged in 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthReady(true);
    });

    return () => unsubscribe();
    }, []);

    // set up the invisiblereCAPTCHA verified (REQUIRED for phone auth through Firebase!)
    useEffect(() => {
        if (!authReady) return;

        if (!window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response) => {
                console.log("reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
                console.log("reCAPTCHA expired");
                window.recaptchaVerifier = null; // Reset the verifier
                alert("reCAPTCHA expired. Please try again.");
            },
            });
        } catch (error) {
            console.error("Error creating RecaptchaVerifier:", error);
        }
        }
    }, [authReady]);

    // This function is called when the user clicks "Send Code" button
    const handleLogin = async () => {
        try {
        setLoading(true);
        
        // Format the phone number (and add +1 if not added)
        let formattedPhoneNumber = phoneNumber.trim();
        if (!formattedPhoneNumber.startsWith('+')) {
            formattedPhoneNumber = `+1${formattedPhoneNumber}`; // If no +1 is added, it adds +1 assuming US user
        }
        
        // Verify that the phone number entered is in the correct format and throw error otherwise
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(formattedPhoneNumber)) {
            throw new Error("Invalid phone number format. Please include country code (e.g. +1 for US)");
        }

        // Reset the reCAPTCHA if it was previously used
        if (window.recaptchaVerifier && window.recaptchaVerifier._reset) {
            window.recaptchaVerifier._reset();
        }

        // Firebase sends the verification code to user's entered phone number 
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(
            auth,
            formattedPhoneNumber,
            appVerifier
        );

        // Store confirmation result in state to compare with code sent 
        setConfirmationResult(confirmation);
        console.log("SMS sent to", formattedPhoneNumber);
        alert("Verification code sent! Please check your phone.");
        } catch (error) {
        console.error("SMS send failed:", error);
        let errorMessage = "Failed to send SMS. ";
        
        // Error checking 
        if (error.code === 'auth/invalid-phone-number') {
            errorMessage += "Please check the phone number format.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage += "Too many attempts. Please try again later.";
        } else if (error.code === 'auth/quota-exceeded') {
            errorMessage += "Service temporarily unavailable. Please try again later.";
        } else if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += "Please try again.";
        }
        
        alert(errorMessage);
        
        // Reset reCAPTCHA if an error was thrown
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier = null;
        }
        } finally {
        setLoading(false);
        }
    };

    // This function is called when the user clicks "Verify Code" button
    const handleVerifyCode = async () => {
        try {
        if (!confirmationResult) {
            console.error("No confirmation result available");
            alert("No confirmation result — did you send the code?");
            return;
        }

        console.log("Starting verification with code:", verificationCode);
        const result = await confirmationResult.confirm(verificationCode);
        console.log("Verification successful, user object:", result.user);
        
        // Check if user exists in database
        const userRef = ref(db, `users/${result.user.uid}`);
        console.log("Checking user in database at path:", `users/${result.user.uid}`);
        const snapshot = await get(userRef);
        
        // If the user is not in our database already, then they are a new user 
        // We need to ask for their name and store in database
        if (!snapshot.exists()) {
            console.log("New user detected, showing name input");
            setIsNewUser(true);
            setShowNameInput(true);
        } else {    // Otherwise, they are an existing user and we want to load their data
            console.log("Existing user found");
            const userData = snapshot.val();
            alert(`Welcome back, ${userData.name}!`);
            navigate("/");      // Redirect them to their homepage bucketlist
        }
        } catch (error) {
        console.error("Code verification failed - Full error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        let errorMessage = "Verification failed. ";
        if (error.code === 'auth/invalid-verification-code') {
            errorMessage += "The verification code is invalid.";
        } else if (error.code === 'auth/code-expired') {
            errorMessage += "The verification code has expired.";
        } else {
            errorMessage += "Please check the code and try again.";
        }
        alert(errorMessage);
        }
    };
    // Called when the user enters their name 
    const handleNameSubmit = async () => {
        try {
        if (!name.trim()) {
            alert("Please enter your name");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert("No authenticated user found");
            return;
        }

        const userRef = ref(db, `users/${user.uid}`);
        
        // Create a new user profile with all data stored in the database 
        await set(userRef, {
            name: name.trim(),
            phoneNumber: user.phoneNumber,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            avatar: `https://placecats.com/${100 + Math.floor(Math.random() * 10)}/${100 + Math.floor(Math.random() * 10)}`,
            connections: {},
            totalGoalsCreated: 0,
            totalNotificationsReceived: 0,
            items: {},
            notifications: {}
        });

        // Notify user of successful sign up 
        alert(`Welcome to Plotster, ${name}!`);
        navigate("/");
        } catch (error) {
        console.error("Failed to create user profile:", error);
        alert("Failed to create user profile. Please try again.");
        }
    };
    // This is the "landing page" where users are prompted to enter their phone number 
    // verify it, and then enter their name to complete sign up/login 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome to Plotster</h2>
            
            <div id="recaptcha-container"></div>

            {!showNameInput ? (
            <>
                <div className="mb-4">
                <input
                    type="tel"
                    placeholder="+1 831 254 5462"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                    Enter your phone number with country code (e.g. +1 for US)
                </p>
                </div>
                
                {confirmationResult ? (
                <>
                    <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    </div>
                    <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                    >
                    {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </>
                ) : (
                <button
                    onClick={handleLogin}
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                    {loading ? "Sending..." : "Send Code"}
                </button>
                )}
            </>
            ) : (
            <div className="mt-4">
                <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                </div>
                <button
                onClick={handleNameSubmit}
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
                >
                Complete Sign Up
                </button>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default LogIn;

