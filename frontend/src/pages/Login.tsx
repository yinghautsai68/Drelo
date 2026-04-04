import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput";
import { Title, Label } from "../components/Typography";
import Button from "../components/Button";
import Footer from "../components/Footer";


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
        <div className="flex flex-col justify-between items-center w-full h-screen bg-neutral-900 text-white">
            <div className="flex flex-col justify-center items-center gap-10 w-full h-[80%]">
                <Title>Drelo</Title>
                <form onSubmit={handleLogin} className="flex flex-col items-center gap-5 px-10 pt-8 pb-10 md:bg-zinc-800 rounded-lg">
                    <Label className="w-full text-center">登入以繼續</Label>
                    <div className="flex flex-col ">
                        <FormInput label="使用者" type="text" name="username" value={formData.username} handleChange={handleChange}></FormInput>
                        <FormInput label="密碼" type="password" name="password" value={formData.password} handleChange={handleChange}></FormInput>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-800 rounded-sm">登入</Button>

                    <NavLink to='/register' className="text-blue-400 hover:text-blue-600 underline underline-offset-4 cursor-pointer transition-all ">沒有帳號？建立帳號</NavLink>
                </form>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Login