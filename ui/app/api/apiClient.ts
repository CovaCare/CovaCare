import axios from "axios";

<<<<<<< HEAD
const API_BASE_URL = "http://localhost:5001";
=======
const API_BASE_URL = "https://172.16.1.63:5001";
>>>>>>> origin/main

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
