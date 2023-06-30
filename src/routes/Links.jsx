import Inbox from "@mui/icons-material/Inbox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import CategoryIcon from '@mui/icons-material/Category';

export const Links = [
  {
    title: "Usuarios",
    path: "/auth/usuarios",
    Icon: <Inbox />,
  },
  {
    title: "Servicios",
    path: "/auth/servicios",
    Icon: <PeopleAltIcon />,
  },
  {
    title: "Tipo de automovil",
    path: "/auth/typesCar",
    Icon: <DriveEtaIcon />,
  },
  {
    title: "Categoria de servicios",
    path: "/auth/CategoriaServicios",
    Icon: <CategoryIcon />,
  },
];
