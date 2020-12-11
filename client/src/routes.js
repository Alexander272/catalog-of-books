import { Switch, Route, Redirect } from 'react-router-dom'
// import { LinksPage } from './pages/LinksPage'
// import { CreatePage } from './pages/CreatePage'
// import { DetailPage } from './pages/DetailPage'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { AddPage } from './pages/AddPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>
                <Route path="/add">
                    <AddPage />
                </Route>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
