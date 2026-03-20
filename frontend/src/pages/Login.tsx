import { useState } from "react"
import { useNavigate } from "react-router-dom"


const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!result.success) {
                return console.log(result.message);
            };
            console.log(result.message, "token: " + result.token);
            localStorage.setItem("token", result.token);
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex flex-row justify-center items-center w-full h-screen bg-black text-white">
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-2 p-5 border">
                <h1>Login</h1>
                <div className="flex flex-col ">
                    <label htmlFor="">Username</label>
                    <input id="" type="text" name="username" value={formData.username} onChange={(e) => handleChange(e)} className="border" />
                    <label htmlFor="">Passowrd</label>
                    <input type="password" name="password" value={formData.password} onChange={(e) => handleChange(e)} className="border" />
                </div>
                <button className="p-2 border cursor-pointer">Login</button>
            </form>
        </div>
    )
}

export default Login