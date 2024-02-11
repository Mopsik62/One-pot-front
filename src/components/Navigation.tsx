import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import store from '../store/store'

import { Button } from 'react-bootstrap';

import { logoutUser } from '../modules/authActions';
import { useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Navigation: FC = () => {

    const {userToken, userName, userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const {draftID} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const sendLogout = async() => {
        if (userToken != null) {
            dispatch(logoutUser(userToken))
            navigate('/One-pot-front/')
        }
    }
    const goToCar = async() => {
            navigate('/One-pot-front/synthesis?synthesis_id=' + String(draftID))

    }

    return (
        <Navbar expand="lg" >
            <Container>
                <Nav.Link href="/One-pot-front/">Субстанции</Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {userRole?.toString() == 'Moderator' &&
                    <Nav className="me-auto">
                        <Nav.Link href="/One-pot-front/mod_substances">Таблица субстанций</Nav.Link>
                    </Nav>
                }
                <Navbar.Collapse id="basic-navbar-nav">
                    {userToken &&
                        <Nav className="me-auto">
                            <Nav.Link href="/One-pot-front/syntheses">Синтезы</Nav.Link>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Container>
            {userToken &&
                <Navbar.Collapse className='justify-content-end'>
                    {userToken &&
                        <Button variant="primary" onClick={draftID !== null ? goToCar : undefined} disabled={draftID === null}>
                            Корзина
                        </Button>
                    }


                    <Nav.Item style={{marginLeft: '10px', marginRight: '10px', width: '170px'}}>Пользователь: {userName}</Nav.Item>
                    <Button onClick={sendLogout}>Выход</Button>
                </Navbar.Collapse>
            }
            {!userToken &&
                <Navbar.Collapse className='justify-content-end'>
                    <Nav.Link href="/One-pot-front/auth" style={{marginRight: '20px'}}>Вход</Nav.Link>
                    <Nav.Link href="/One-pot-front/register" style={{marginRight: '20px'}}>Регистрация</Nav.Link>


                </Navbar.Collapse>
            }
        </Navbar>
    );
}

export default Navigation;