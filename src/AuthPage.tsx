import { FC, useEffect, useState } from 'react'
// import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, Spinner, Modal } from 'react-bootstrap'

import store, { useAppDispatch } from './store/store'
import { loginUser, registerUser } from './modules/authActions'

interface InputChangeInterface {
    target: HTMLInputElement
}

const AuthPage: FC = () => {
    const {userToken, loading, userName, error, success} = useSelector(
        (state: ReturnType<typeof store.getState>) => state.auth
    )

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [showRegisterModal, setShowRegisterModal] = useState(true)


    const handleRegisterModalClose = () => {
        setShowRegisterModal(false)
    }

    const handleLoginChange = (event: InputChangeInterface) => {
        setLogin(event.target.value)
    }

    const handlePasswordChange = (event: InputChangeInterface) => {
        setPassword(event.target.value)
    }

    const sendLogin = async () => {
        setShowRegisterModal(false)
        await dispatch(loginUser({login: login, password: password}))
        window.location.reload()
    }

    const sendRegister = async () => {
        setShowRegisterModal(true)
        dispatch(registerUser({login: login, password: password}))
    }

    useEffect(() => {
        if (userToken && userName) {
            navigate('/One-pot-front/account')
        }
    }, [navigate, userToken, userName])



    return (
        <>
            <Modal show = {success && showRegisterModal && !loading} onHide={handleRegisterModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Регистрация прошла успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRegisterModalClose}>Закрыть</Button>
                </Modal.Footer>
            </Modal>

            <h1>Вход</h1>
            <p>Логин:</p>
            <input
                value={login}
                onChange={handleLoginChange}
            />
            <p>Пароль:</p>
            <input
                type='password'
                value={password}
                onChange={handlePasswordChange}
            />
            <p></p>
            <Button onClick={sendLogin} disabled={loading}>Войти</Button>
            <p></p>
            <Button onClick={sendRegister} disabled={loading}>Регистрация</Button>
            <p></p>
            {loading ? <Spinner /> : ''}
        </>
    )
}

export default AuthPage