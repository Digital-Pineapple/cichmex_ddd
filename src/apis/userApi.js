import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables()

const userApi = axios.create({
baseURL: "http://192.168.100.35:3001/api"
})



export default userApi;