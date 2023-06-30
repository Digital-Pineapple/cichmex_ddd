import React from 'react'
import { Alert, Space } from 'antd';

const SuccesAlert = ({message}) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
                message={ ()=> (message) }
                type="success"
                showIcon
                closable
            />
        </Space>
    )
}

export default SuccesAlert
