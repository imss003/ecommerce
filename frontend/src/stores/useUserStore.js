import {create} from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user:null,
    loading: false,
    checkingAuth: true,
    signup: async({name, email, password, confirmPassword}) => {
        set({loading: true});
        if(password !== confirmPassword){
            set({loading: false});
            return toast.error("Password do not match");
        }
        try {
            const res = await axios.post("/auth/signup", {name, email, password});
            set({loading: false, user: res.data.user});
            return toast.success(res.data.message);
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred!!");
        }
    },
    login: async(email, password) => {
        set({loading: true});
        try {
            const res = await axios.post("/auth/login", {email, password});
            set({loading: false, user: res.data.user});
            return toast.success(res.data.message);
        }
        catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred!!");
        }
    },
    checkAuth: async() => {
        set({checkingAuth: true});
        try {
            const response = await axios.get("/auth/profile");7
            set({user: response.data, checkingAuth: false});
        } catch (error) {
            set({checkingAuth: false, user: null});
        }
    },
    logout: async() => {
        try {
            await axios.post("/auth/logout");
            set({user: null});
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    }
}))