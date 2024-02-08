import Breadcrumb from 'react-bootstrap/Breadcrumb'

import './Breadcrumbs.css'

function Breadcrumbs() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const substance_name = urlParams.get('substance_name')
    const name = urlParams.get('name')
    let synthesis_id = urlParams.get('synthesis_id')
    if (!synthesis_id) {
        synthesis_id = '-'
    }

    return (
        <Breadcrumb>
            {(window.location.pathname == "/One-pot-front/"
                    || window.location.pathname == "/One-pot-front/mod_substances"
                    || window.location.pathname == "/One-pot-front/substance"
                    || window.location.pathname == "/One-pot-front/substance_edit") &&
                <Breadcrumb.Item href="/One-pot-front/">Субстанции</Breadcrumb.Item>
            }
            {(window.location.pathname == "/One-pot-front/substance"
                    || window.location.pathname == "/One-pot-front/substance_edit") &&
                <Breadcrumb.Item active>{substance_name ? substance_name : name}</Breadcrumb.Item>
            }

            {window.location.pathname == '/One-pot-front/auth' &&
                <Breadcrumb.Item>Вход</Breadcrumb.Item>
            }
            {window.location.pathname == '/One-pot-front/register' &&
                <Breadcrumb.Item>Регистрация</Breadcrumb.Item>
            }
            {window.location.pathname == '/One-pot-front/account' &&
                <Breadcrumb.Item>Аккаунт</Breadcrumb.Item>
            }
            {(window.location.pathname == '/One-pot-front/syntheses'
                    || window.location.pathname == '/One-pot-front/synthesis'
                    || window.location.pathname == '/One-pot-front/synthesis_edit') &&
                <Breadcrumb.Item href="/One-pot-front/syntheses">Синтезы</Breadcrumb.Item>
            }
            {(window.location.pathname == '/One-pot-front/synthesis'
                    || window.location.pathname == '/One-pot-front/synthesis_edit') &&
                <Breadcrumb.Item active>{parseInt(synthesis_id, 10) ? synthesis_id : '-'}</Breadcrumb.Item>
            }
            {window.location.pathname == '/One-pot-front/order' &&
                <Breadcrumb.Item>Корзина</Breadcrumb.Item>
            }
        </Breadcrumb>
    );
}

export default Breadcrumbs;