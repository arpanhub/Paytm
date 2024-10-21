import { useEffect, useState } from "react";
import { Button } from "./Button"
import { useNavigate } from "react-router-dom";
import axios from "axios";




export const Users = () => { 
    const [users,setusers] = useState([]);
    const [filter,setFilter] = useState("");
    const [error, seterror] = useState("");

    useEffect(()=>{
        fetchUser(filter);
    },[filter]);

    const handleclick=()=>{
        fetchUser(filter);
    }   

    async function fetchUser(filter){
        try{
            const response = await axios.get(
                'http://localhost:3000/api/v1/user/bulk',
                {
                    params:{filter}
                }
            );

            setusers(response.data);
            seterror(""); 
        }catch(err){
            if(err.response && err.response.status===404){
                setusers([]);
                seterror("No users Found:(")
            }
                      
        }
    }
    return (
    <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="mb-4 mt-2 flex flex-row w-24">
            <input 
            onChange={(e) => {
                setFilter(e.target.value);
                // console.log(e.target.value);
                // console.log(filter);
            }} 
            type="text"
            placeholder="Search users..." 
            className=" py-1 mr-4 rounded border-slate-200"/>
            <Button label={"Search"}
            onClick={handleclick}
            />
        </div>
        <div>
            {error && <div>{error}</div>}
            {users.length > 0 ? (
                users.map((user) => (
                    <User key={user._id} user={user} />
                ))
            ) : (
                !error && <div>No users to display</div> 
            )}
        </div>
    </>
    );
}

function User({user}) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-8 w-8 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstname[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full text-slate-700">
                <div>
                    {user.firstname} {user.lastname}
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate("/send?id=" + user._id + "&name=" + user.firstname);
            }} label={"Send Money"} />
        </div>
    </div>
}