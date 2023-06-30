import { instanceApi } from "../../apis/configAxios"
import { loadService, loadServices, deleteService, editService } from "../reducer/servicesReducer"

export const startLoadServices = () => {
    return async dispatch => {
        try {
            const { data } = await instanceApi.get('/services')
            dispatch(loadServices(data.data))
        } catch (error) {
            console.log(error)
        }
    }
}

export const getOneService = service_id =>
    async dispatch => {
        try {
            const { data } = await instanceApi.get(`/services/${service_id}`)
            dispatch(loadService(data.data));
        } catch (error) {
            console.log(error);
        }
    }

export const deleteOneServices = (service_id) =>
    async dispatch => {
        try {
            await instanceApi.delete(`/services/${service_id}`)
            dispatch(deleteService(service_id));
        } catch (error) {
            console.log(error);
        }
    }

    export const editOneService = service_id =>
        async dispatch =>{
            try {
                const{ data } = await instanceApi.patch(`/services/${service_id}`)
                dispatch(editService(service_id))
            } catch (error) {
                console.log(error);
            }
        }
    
    