import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import SubstancesPage from './SubstancesPage.tsx'
import SubstancePage from './SubstancePage.tsx'
import SynthesesPage from './SynthesesPage.tsx'
import SynthesisPage from "./SynthesisPage.tsx";
import Navigation from './components/Navigation'
import Breadcrumbs from './components/Breadcrumbs';
import AuthPage from './AuthPage';
import SynthesisEditPage from './SynthesisEditPage.tsx';
import SubstanceEditPage from './SubstanceEditPage';
import store from './store/store';
import ModSubstancesPage from './ModSubstancesPage';
import RegisterPage from './RegisterPage';


import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

import { Provider } from 'react-redux';




ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Navigation />
                <Breadcrumbs />
                <Routes>

                    <Route path="/One-pot-front" Component={SubstancesPage} />
                    <Route path="/One-pot-front/mod_substances" Component={ModSubstancesPage} />
                    <Route path="/One-pot-front/substance" Component={SubstancePage} />
                    <Route path="/One-pot-front/synthesis" Component={SynthesisPage} />
                    <Route path="/One-pot-front/auth" Component={AuthPage} />
                    <Route path="/One-pot-front/register" Component={RegisterPage} />
                    <Route path="/One-pot-front/syntheses" Component={SynthesesPage} />
                    <Route path="/One-pot-front/synthesis_edit" Component={SynthesisEditPage} />
                    <Route path="/One-pot-front/substance_edit" Component={SubstanceEditPage} />

                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)