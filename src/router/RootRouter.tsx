import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomeScreen } from '../screens/HomeScreen'

export const RootRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
            </Routes>
        </BrowserRouter>
    )
}
