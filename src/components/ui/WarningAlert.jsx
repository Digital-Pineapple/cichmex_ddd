import React from 'react'
import { DeleteTwoTone, EditTwoTone, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useNavigate } from 'react-router-dom';
import { redirectPages, alerConfirm } from '../../helpers/';
const { confirm } = Modal;


const showConfirm = (title) => {
    confirm({
        title,
        onOk() {
            alert("Ok")
        },
        onCancel() {
            console.log("Cancelar")
        }
    });
};


const WarningAlert = ({ route, title, callbackToDeleteItem}) => {

    const navigate = useNavigate();


    return (
        <Space wrap>
            <Button
                onClick={() => redirectPages(navigate, route)}
                icon={<EditTwoTone twoToneColor="#0000ff" />}
            />
            <Button
                icon={<DeleteTwoTone twoToneColor="#FF0000" />}
                onClick={() => alerConfirm(title, callbackToDeleteItem)}
            />
        </Space>
    )
}

export default WarningAlert
