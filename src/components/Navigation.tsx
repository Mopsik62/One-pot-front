import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import store from '../store/store'

const Navigation: FC = () => {
    const {userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/One-pot-front/">One-pot синтезы</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/One-pot-front/syntheses">Синтезы</Nav.Link>
                        {!userToken &&
                            <Nav.Link href="/One-pot-front/auth">Вход</Nav.Link>
                        }
                        {userToken &&
                            <>
                                <Nav.Link href="/One-pot-front/account">Аккаунт</Nav.Link>
                                <Nav.Link href="/One-pot-front/order">Заказ</Nav.Link>
                            </>                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;