import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import SubstancesPage from './SubstancesPage.tsx'
import SubstancePage from './SubstancePage.tsx'
import SynthesesPage from './SynthesesPage.tsx'
import Navigation from './components/Navigation'
import Breadcrumbs from './components/Breadcrumbs';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage'
import OrderPage from './OrderPage.tsx';
import SynthesisPage from './SynthesisPage.tsx';
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
                    <Route path="/One-pot-front/substance" Component={SubstancePage} />
                    <Route path="/One-pot-front/auth" Component={AuthPage} />
                    <Route path="/One-pot-front/account" Component={AccountPage} />
                    <Route path="/One-pot-front/syntheses" Component={SynthesesPage} />
                    <Route path="/One-pot-front/order" Component={OrderPage} />
                    <Route path="/One-pot-front/synthesis" Component={SynthesisPage} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)