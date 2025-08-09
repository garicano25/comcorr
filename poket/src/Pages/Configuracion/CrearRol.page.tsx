import { useEffect, useState } from "react";
import AddRolSvg from "../../assets/icons/AddRol.svg";
import CloseSvg from "../../assets/icons/Close.svg";
import { useAlert } from "../../context/AlertProviderContext";
import { IPermissions } from "../../interfaces/permisos.interface";
import { listPermissionService } from "../../services/permisos.services";
import { createRolService } from "../../services/roles.servies";
import { Box, Button, Chip, CircularProgress, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const CrearRolPage = () => {
 

    const { setAlert } = useAlert();
    const [rol, setRol] = useState<string>("");
    const [permisos, setPermisos] = useState<IPermissions[]>([]);
    const [loadingPermission, setLoadingPermission] = useState<boolean>(true);
    const [loader, setLoader] = useState<boolean>(false);
    const [selectedPermission, setSelectedPermission] = useState<IPermissions[]>([]);

    // Función para agregar permisos
    const handleAddPermission = (permiso: IPermissions) => {
        setSelectedPermission((prev) => [...prev, permiso]);
    };

    // Función para eliminar permisos
    const handleRemovePermission = (permiso: IPermissions) => {
        setSelectedPermission((prev) => prev.filter((p) => p.id !== permiso.id));
    };

    useEffect(() => {
        const loadRoles = async () => {
            setLoadingPermission(true);
            try {
                const data = await listPermissionService();
                setPermisos(data);
            } finally {
                setLoadingPermission(false);
            }
        };

        loadRoles();
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);

        const form = e.currentTarget;
        const formData = new FormData(e.currentTarget);
        const name = formData.get("nombre") as string;
        
        const payload = {
            name,
            permissions: selectedPermission.map((permission) => permission.id),
        };


        // Validamos que existan permisos selecionado
        if (payload.permissions.length === 0) {
            setAlert({
                title: "Seleccione algún permiso disponible",
                text: "El Rol necesita de permisos para poder ser creado.",
                open: true,
                time: 1500,
                icon: "warning",
            });
            setLoader(false);
        } else {

            try {
                await createRolService(payload);
                
                // Limpiamos los campos
                form.reset();
                setRol("");
                setSelectedPermission([]);

                // Mostramos la alerta de exito
                setAlert({
                    title: "Rol Creando con éxito!",
                    text: "El Rol ya puede ser utilizado para su asignación a otros usuarios.",
                    open: true,
                    time: 2000,
                    icon: "success",
                });
            } finally {
                setLoader(false);
            }
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
                    Nombre
                </Typography>
                <TextField
                    fullWidth
                    required
                    name="nombre"
                    placeholder="Nombre del Rol"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    style={{ marginBottom: "20px" }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loader}
                    sx={{
                        backgroundColor: rol ? "info.main" : "text.disabled",
                    }}
                >
                    {loader ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body1" sx={{ marginRight: "10px" }}>
                                Creando...
                            </Typography>
                            <CircularProgress size={20} sx={{ color: "white" }} />
                        </div>
                    ) : (
                        "Crear Rol"
                    )}
                </Button>
            </form>

            {/* Permisos activos */}
            {selectedPermission.length > 0 && (
                <Box component="div">
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 2, mt: 5 }}>
                        Permisos activos
                    </Typography>
                    <Grid container spacing={2}>
                        {selectedPermission.map((permiso) => (
                            <Grid key={permiso.id}>
                                <Chip
                                    label={permiso.permission_name}
                                    onDelete={() => handleRemovePermission(permiso)}
                                    deleteIcon={<img src={CloseSvg} alt="Icon Delete Rol" />}
                                    sx={{
                                        backgroundColor: "#1E3A8A",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Permisos disponibles */}
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 3, mt: 5 }}>
                Permisos disponibles
            </Typography>
            {loadingPermission ? (
                <CircularProgress color="primary" />
            ) : (
                <Grid container spacing={2}>
                    {permisos
                        .filter((permiso) => !selectedPermission.some((selected) => selected.id === permiso.id))
                        .map((permiso) => (
                            <Grid key={permiso.id}>
                                <Chip
                                    label={permiso.permission_name}
                                    onClick={() => handleAddPermission(permiso)}
                                    icon={<img src={AddRolSvg} alt="Icon Add Rol"  />}
                                    sx={{
                                        backgroundColor: "white",
                                        color: "#1E3A8A",
                                        border: "1px solid #1E3A8A",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                />
                            </Grid>
                        ))}
                </Grid>
            )}
        </div>
    );
};