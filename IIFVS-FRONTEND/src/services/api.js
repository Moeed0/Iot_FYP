import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.1.10:5000" // Kali Linux Backend
});

export default API;
