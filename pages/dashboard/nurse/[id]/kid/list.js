import {privateRoute} from "../../../../../components/privateRoute";
import {Table} from "@mantine/core";
import {useEffect, useState} from "react";

function KidList({auth}) {
    const [data, setData] = useState(null);
    let rows = null;
    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/nurse/${auth.decodedToken.id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }})
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setData(data)
            })
    }, [])

    if(data) {
        rows = data.map((element) => (
            <tr key={element.id}>
                <td>{element.firstname}</td>
                <td>{element.lastname}</td>
                <td>{element.birthday}</td>
                <td>{element.activated.toString()}</td>
                <td>{element.archived.toString()}</td>
            </tr>
        ));
    }

    return (
        <>
            <Table>
                <thead>
                <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Date d'anniversaire</th>
                    <th>Activated</th>
                    <th>Archived</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default privateRoute(KidList);