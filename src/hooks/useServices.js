import { useDispatch, useSelector } from "react-redux"
import { startLoadServices, deleteOneServices, getOneService, editOneService } from "../store/actions/servicesActions";

export const useServices = () => {

    const dispatch = useDispatch();

    const { services, service } = useSelector(state => state.services);

    const loadServices = async () => dispatch(startLoadServices());

    const loadService = async service_id => dispatch(getOneService(service_id));

    const deleteService = async service_id => dispatch(deleteOneServices(service_id))

    const editService = async service_id => dispatch(editOneService(service_id))

    return { loadServices, services, deleteService, loadService, service }
}