// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBKiyluRRzKamxd8NgFmYduWxerInedvR0",
  authDomain: "datify-49ddc.firebaseapp.com",
  projectId: "datify-49ddc",
  storageBucket: "datify-49ddc.appspot.com",
  messagingSenderId: "426040737519",
  appId: "1:426040737519:web:68c4717f117fff6344651a",
  measurementId: "G-2D806J8GZC",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://ec2-3-144-103-133.us-east-2.compute.amazonaws.com:8000";
export const frontendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://youdate.s3-website.us-east-2.amazonaws.com";
