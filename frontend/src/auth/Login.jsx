import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Login(){
    const navigate = useNavigate()
    const [formData, setFormData]=useState({
        email: "",
        password: "",
        role: ""
    });

    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin=async(e)=>{
        e.preventDefault()
        setError("");
        setLoading(true);
        try{
            //backend api call
            const response = await axios.post(
                "http://localhost:8000/auth/login",
                {
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                }
            )

            const data = response.data.accessToken;
            

        }catch(err){

        }
    }

    return (
        <form onSubmit={handleLogin}>
            <button type="submit">Login</button>
        </form>
    )
}
