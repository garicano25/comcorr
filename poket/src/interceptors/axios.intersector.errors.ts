import { AxiosError } from "axios";
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router";

export const errorAxiosIntersector = (error: AxiosError) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    if (error.response && error.response.status === 403) {
        const data: any = error.response.data;
        enqueueSnackbar(data.detail, { variant: 'warning' });

    }
    if (error.response && error.response.status === 400) {
          
        const data: any = error.response.data;
         enqueueSnackbar(data.detail, { variant: "error" });
    }

    if (error.response && error.response.status === 401) {
        navigate("/login");
    }
    if (error.response && error.response.status === 502) {
        enqueueSnackbar('Sin respuesta del servidor!', { variant: 'error' });
        
    }
    if (error.response && error.response.status === 500) {
        enqueueSnackbar('Hubo un problema al consultar!', { variant: 'error' });
    }
    if (error.response && error.response.status === 503 && error.response.data) {

        const data: any = error.response.data;
        enqueueSnackbar(data.detail, { variant: 'error' });

    }
    return Promise.reject(error);
}