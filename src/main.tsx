import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import SubstancesPage from './SubstancesPage.tsx'
import SubstancePage from './SubstancePage.tsx'
import Navigation from './components/Navigation'
import Breadcrumbs from './components/Breadcrumbs';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage'
import store from './store/store';


import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Navigation />
                <Breadcrumbs />
                <Routes>
                    <Route path="/One-pot-front" Component={SubstancesPage} />
                    <Route path="/One-pot-front/syntheses" Component={SubstancePage} />
                    <Route path="/One-pot-front/auth" Component={AuthPage} />
                    <Route path="/One-pot-front/account" Component={AccountPage} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)