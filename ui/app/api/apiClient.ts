import axios from "axios";

const API_BASE_URL = "http://172.16.1.63:5001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
