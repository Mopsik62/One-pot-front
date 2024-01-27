import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/One-pot-front/">One-pot синтезы</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/One-pot-front/syntheses">Заявки</Nav.Link>
                        <Nav.Link href="/One-pot-front/auth">Вход</Nav.Link>
                        <Nav.Link href="/One-pot-front/account">Аккаунт</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;