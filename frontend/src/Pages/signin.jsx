import axios from "axios"
import { BottomWarning } from "../Components/BottomWarning"
import { Button } from "../Components/Button"
import { Heading } from "../Components/Heading"
import { InputBox } from "../Components/InputBox"
import { SubHeading } from "../Components/SubHeading"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export const Signin = () => {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error, seterror] = useState("");

  const Navigate = useNavigate();
    return <div className="bg-black h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="username" label={"Usernmae"} 
        onChange={(e)=>{
          setUsername(e.target.value);
        }}
        />
        <InputBox placeholder="123456" label={"Password"} 
        onChange={(e)=>{
          setPassword(e.target.value);
        }}
        />
        {error && <div>{error}</div>}
        <div className="pt-4">
          <Button label={"Sign in"} 
          onClick={ async()=>{
            try{
              const response = await axios.post('http://localhost:3000/api/v1/user/signin',
                {
                  username:username,
                  password:password
                },
                {
                  headers:{
                    "Content-Type":"application/json",
                  },
                }
              );
              localStorage.setItem("token",response.data.token);
              Navigate("/dashboard")
            }catch(err){
              if(err.response && err.response.status===411){
                seterror(err.response.data.message);
              }
              console.log(err.response.data.message);
            }
          }}
          />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}