import { Navigate, Route, Routes} from "react-router-dom"
import Home from "../pages/Home"


export const MNISTRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>

        {/* Default entry */}
        <Route path="/*" element={<Navigate to="/" /> }/>

    </Routes>

  )
}

export default MNISTRoutes
