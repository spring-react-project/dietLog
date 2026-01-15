import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout"
import MealsPage from "../pages/meals/MealsPage";
import Notfound from "../pages/Notfound";
import HomePage from "../pages/HomePage";
import MealsNewPage from "../pages/meals/MealsNewPage";
import MealsDetailPage from "../pages/meals/MealsDetailPage";
export const router = createBrowserRouter([
    {
        path:'/',
        element:<RootLayout/>,
        errorElement:<Notfound/>,
        children:[
            {index:true, element:<HomePage/>},
            {path:'meals', element:<MealsPage/>},
            {path:'meals/all', element:<MealsPage/>},
            {path:'meals/new', element:<MealsNewPage/>},
            {path:'meals/:id', element:<MealsDetailPage/>}
        ]
    }       

])