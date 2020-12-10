import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/AuthHook'
import { AuthContext } from './context/AuthContext'
import { Loader } from './components/Loader/Loader'

function App() {
    const { token, userId, ready, login, logout } = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) return <Loader />
    return (
        <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated }}>
            <BrowserRouter>
                <div className="wrapper">{routes}</div>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
