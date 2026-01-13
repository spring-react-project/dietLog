import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout"
import Meals from "../pages/Meals";
import Notfound from "../pages/Notfound";
import Home from "../pages/Home";
export const router = createBrowserRouter([
    {
        path:'/',
        element:<RootLayout/>,
        errorElement:<Notfound/>,
        children:[
            {index:true, element:<Home/>},
            {path:'meals', element:<Meals/>}
        ]
    }       

])