import Breadcrumb from 'react-bootstrap/Breadcrumb'

import './Breadcrumbs.css'

function Breadcrumbs() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const substance_name = urlParams.get('substance_name')
    const name_pattern = urlParams.get('name_pattern')

    return (
        <Breadcrumb>
            <Breadcrumb.Item href="/One-pot-front/">Домашняя страница</Breadcrumb.Item>
            {window.location.pathname == '/One-pot-front/auth' &&
                <Breadcrumb.Item>Вход</Breadcrumb.Item>
            }
            {window.location.pathname == '/One-pot-front/account' &&
                <Breadcrumb.Item>Аккаунт</Breadcrumb.Item>
            }
            {window.location.pathname == '/One-pot-front/syntheses' &&
                <Breadcrumb.Item>Синтезы</Breadcrumb.Item>
            }
            {(substance_name != null && name_pattern === null) &&
                <>
                    <Breadcrumb.Item active> Субстанция </Breadcrumb.Item>
                    <Breadcrumb.Item href = {window.location.search}>{substance_name}</Breadcrumb.Item>
                </>
            }
            {(name_pattern != null && substance_name === null) &&
                <>
                    <Breadcrumb.Item active> Поиск </Breadcrumb.Item>
                    <Breadcrumb.Item href = {window.location.search}>{name_pattern}</Breadcrumb.Item>
                </>
            }
            {window.location.pathname == '/One-pot-front/order' &&
                <Breadcrumb.Item>Заказ</Breadcrumb.Item>
            }
        </Breadcrumb>
    );
}

export default Breadcrumbs;