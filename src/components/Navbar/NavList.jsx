import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
function NavListDrawer({ navArrayLinks}) {
  return (
    <>
      <List>
        {navArrayLinks.map((item) => (
          <ListItem sx={{ display: "block" }} disablePadding key={item.title}>
            <NavLink to={item.path} style={{ color: "white", textDecoration:'none' }} >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  backgroundColor: "inherit",
                  "&:hover": {
                    backgroundColor: "#95C8FF",
                  },
                  px: 3,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#0D2B6B",
                  }}
                >
                  {item.Icon}
                </ListItemIcon>
                <ListItemText  sx={{ color: "white", textUnderlineOffset:"" }}>
                  {item.title}
                </ListItemText>
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default NavListDrawer;
