import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import store, { useAppDispatch } from './store/store'
import { logoutUser } from './modules/authActions'

const AccountPage: FC = () => {
    const [userRoleString, setUserRoleString] = useState('')

    const { userToken, userName, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const isUserPresent = userToken !== undefined && userToken != ''

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const sendLogout = async() => {
        if (userToken != null) {
            dispatch(logoutUser(userToken))
            navigate('/One-pot-front/')
        }
    }

    useEffect(() => {

        if (userRole == 'User') {
            setUserRoleString('Пользователь')
        } else if (userRole == 'Moderator') {
            setUserRoleString('Модератор')
        } else if (userRole == 'Admin') {
            setUserRoleString('Администратор')
        }
    })

    return (
        <>
            {!isUserPresent &&
                <h1>Вы не зашли в систему!</h1>
            }
            {isUserPresent &&
                <>
                    <h1>Аккаунт</h1>
                    <p>Имя пользователя: { userName }</p>
                    <p>Роль: { userRoleString }</p>
                    <Button onClick={ sendLogout }>Выйти из системы</Button>
                </>
            }
        </>
    )
}

export default AccountPage