import { NavLink, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { Label, Title } from "../components/Typography"
import { useState } from "react"


const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    })
    const isPasswordMatch = formData.password === formData.confirmPassword;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isPasswordMatch) {
            return alert("密碼不一致");
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!result.success) {
                return console.log(result.message);
            }
            alert(result.message);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex flex-col justify-start items-center gap-5 w-full h-screen pt-10 bg-neutral-900 text-white">

            <div className="flex flex-col justify-center items-center gap-10 w-full h-[80%]">
                <Title className="">Drelo</Title>
                <form onSubmit={handleRegister} className="flex flex-col items-center  gap-5 md:px-10 md:pt-8 md:pb-10 md:bg-zinc-800 rounded-lg">
                    <Label className="w-full text-center">註冊以繼續</Label>
                    <div className="flex flex-col ">
                        <FormInput label="使用者" type="text" name="username" value={formData.username} handleChange={handleChange}></FormInput>
                        <FormInput label="密碼" type="password" name="password" value={formData.password} handleChange={handleChange}></FormInput>
                        {
                            formData.confirmPassword && !isPasswordMatch &&
                            <p className="text-xs text-rose-400">
                                密碼不一致
                            </p>
                        }
                        <FormInput label="確認密碼" type="password" name="confirmPassword" value={formData.confirmPassword} handleChange={handleChange}></FormInput>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-800 rounded-sm">註冊</Button>
                    <NavLink to='/login' className="text-blue-400 hover:text-blue-600 underline underline-offset-4 cursor-pointer transition-all ">已經有帳號？登入帳號</NavLink>
                </form>
            </div>
            <div className="relative flex flex-col  gap-2 w-full h-[20%] pl-4 lg:pl-80 xl:pl-100 pt-5 pb-2 border-t border-white/30">
                {/* <div className="absolute left-2 w-[150px] h-[100px] bg-rose-500 rounded-lg">

                </div>*/}
                <Title>蔡英豪</Title>
                <div className="flex flex-col">
                    <span className="text-xs font-medium">Drelo: Task Manager</span>
                    <span className="text-xs">Inspired by Trello</span>
                </div>



            </div>
        </div>
    )
}

export default Register