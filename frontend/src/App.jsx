  import {
    BrowserRouter,
    Route,
    Routes,
    Navigate
  } from "react-router-dom";
  import { Signup } from "./Pages/Signup";
  import { Signin } from "./Pages/Signin";
  import { Dashboard } from "./Pages/DashBoard"
  import { SendMoney } from "./pages/SendMoney";

  function App() {
    const isAuthenticated = !!localStorage.getItem("token");
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path ="/" element={<Navigate to="/dashboard"/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" 
            element = {isAuthenticated?<SendMoney/>:<Navigate to = "/signin"/>}
             />
          </Routes>
        </BrowserRouter>
      </>
    )
  }

  export default App