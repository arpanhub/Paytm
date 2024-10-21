import { Navbar } from "../Components/Navbar";
import { Balance } from "../Components/Balance";
import { useEffect, useState } from "react"
import {Users} from '../Components/Users'
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import { User } from "../../../backend/db";


export const Dashboard = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState("");
    const [balance,setbalance] = useState(0);

    
    
    useEffect(function(){
        const token = localStorage.getItem("token");
        console.log(token);
        if(!token){
            navigate('/signin');
            return;
        }
        async function fetchuser(token){
            try {
            const response = await axios.get(
                'http://localhost:3000/api/v1/user/userprofile',
                {
                    headers:{
                      "authorization":`Bearer ${token}`,
                    },
                  }
            )
            setUser(response.data.firstname);
            setbalance(response.data.balance);
        }catch(err){
            console.error("Error fetching user data", error);
        }
    }
        fetchuser(token);
    },[navigate]);
    return <div>
        <Navbar user={user}/>
        <div className="m-8">
            <Balance balance={balance} />
            <Users/>
        </div>
    </div>
}
