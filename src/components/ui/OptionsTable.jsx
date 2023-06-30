import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button } from "antd";

import { alerConfirm } from "../../helpers/helpers";

const OptionsTable = ({ title }) => {
    return (
        <Box display="flex" justifyContent="space-evenly">
            <Button
                icon={<EditTwoTone twoToneColor="#0000ff" />}
            />
            <Button
                icon={<DeleteTwoTone twoToneColor="#FF0000" />}
                onClick={() => alerConfirm(title)}
            />
        </Box>
    )
}

export default OptionsTable