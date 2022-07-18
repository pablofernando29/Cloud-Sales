import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { Link, useNavigate } from "react-router-dom";
import config from './../../helpers/config.json';

const UsersAdmin = () => {
    let navigate = useNavigate();
    const [rowsData, setRows] = useState(0);
    useEffect(() => {
        updateUsers();
    });

    const updateUsers = () => {
        const requestOptions = {
            method: 'GET', headers: { 'Content-Type': 'application/json'}
        };
        fetch(config.apiURL+"users/"+config.operatorId, requestOptions).then((response) => {
            return response.json();
        }).then((result) => {
            // this.setState({ userList: result.data.map((user) => { return user; }) });
            let userList = result.data.map((user) => { return user; });
            let rowData;
            if(userList.length === 0){
                rowData = (<tr><td colSpan="4" className="text-center">Usuarios inexistentes</td></tr>);
            } else {
                rowData = userList.map(p => {
                    let button;
                    if(p.active){
                        button = <button className="btn btn-secondary" onClick={() => disable(p)}><i className="fas fa-eye-slash"></i> Deshabilitar</button>;
                    } else {
                        button = <button className="btn btn-primary" onClick={() => enable(p)}><i className="fas fa-eye"></i> Habilitar</button>;
                    }
                    
                    return (<tr>
                        <td>{p.name}</td><td className="text-right">{p.nickname}</td><td className="text-right">{p.level}</td>
                        <td className="d-flex justify-content-between">
                            {button}
                            <button className="btn btn-warning" onClick={() => edit(p)}><i className="fas fa-pencil"></i> Editar</button>
                        </td>
                    </tr>); 
                });
            }
            setRows(rowData);
        });
    };

    const disable = (user) => {
        if(window.confirm("¿Está seguro/a de querer desactivar:\n"+user.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: user.name,
                    nickname: parseInt(user.nickname),
                    password: parseInt(user.password),
                    level: parseInt(user.level),
                    active: false
                })
            };
            fetch(config.apiURL+"users/"+user.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateUsers();
                window.alert("Desactivación completada");
            });   
        }
    }
    const enable = (user) => {
        if(window.confirm("¿Está seguro/a de querer volver a habilitar:\n"+user.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: user.name,
                    nickname: parseInt(user.nickname),
                    password: parseInt(user.password),
                    level: parseInt(user.level),
                    active: true
                })
            };
            fetch(config.apiURL+"users/"+user.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateUsers();
                window.alert("Habilitación completada")
            });   
        }
    }
    const edit = (user) => {
        let userData = JSON.stringify(user);
        sessionStorage.setItem("user", userData);
        navigate("/users/edit");
    }
    
    return (
        <div>
                <Topbar />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Panel de Usuarios</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Cloud Sales</a></li>
                                    <li className="breadcrumb-item active">Usuarios</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    </section>
                    <section className="content">
                        <div className="card">
                            <div className="card-header">
                                <Link to="/users/add" className="btn btn-success"><i className="fas fa-plus"></i> Nuevo</Link>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Usuarios</th>
                                                <th>Apodo</th>
                                                <th>Tipo de Usuario</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {rowsData}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
    );
}
export default UsersAdmin;