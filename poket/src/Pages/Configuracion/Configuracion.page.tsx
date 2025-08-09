// import { useNavigate } from "react-router";
// import { isValidPermission } from "../../utils/is.valid.permissions"
// import React, { useEffect, useState } from "react";
// import AddButtonSvg from '../../assets/icons/AddButton.svg'
// import EditSvg from '../../assets/icons/Edit.svg'
// import TrashSvg from '../../assets/icons/Trash.svg'
// import { useAuth } from "../../hooks/useAuth";
// import { useAlert } from "../../context/AlertProviderContext";
// import { IGruposRolesTable } from "../../interfaces/roles.interface";
// import { editUserPermissionsService, listUsersService } from "../../services/user.services";
// import { listRolService } from "../../services/roles.servies";
// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import { TabPanelProps } from "../../interfaces/components.interface";
// import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { esES } from "@mui/x-data-grid/locales";
// import { IPermissions } from "../../interfaces/permisos.interface";
// import { listPermissionService } from "../../services/permisos.services";



// function CustomTabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//         role="tabpanel"
//         hidden={value !== index}
//         id={`simple-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//         >
//         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </div>
//     );
// }

// function a11yProps(index: number) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }


// export const ConfiguracionPage = () => {
//     const [value, setValue] = React.useState(0);

//     const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//         console.log(event)
//         setValue(newValue);
//     };
    
//     const { setAlert } = useAlert();
//     const navigate = useNavigate();
    
//     const [open, setOpen] = useState<boolean>(false);
//     const [pending, setPending] = useState(true);
//     const [pendingListGroup, setListGroupPending] = useState(true);
//     const [rowsGroup, setGroupRows] = useState<IGruposRolesTable[]>([]);
//     const [permisos, setPermisos] = useState<IPermissions[]>([]);
//     const [rolesId, setRolesId] = useState<number[]>([]);
//     const [permisosId, setPermisosId] = useState<number[]>([]);
//     const [loader, setLoader] = useState<boolean>(false);	

//     const handleChangeRoles = (event: SelectChangeEvent<typeof rolesId>) => {
//         const { target: { value } } = event;
//         const selectedValues = typeof value === 'string' ? value.split(',').map(Number) : value;
//         setRolesId(selectedValues);
//     };

//     const handleChangePermisos = (event: SelectChangeEvent<typeof permisosId>) => {
//         const { target: { value } } = event;
//         const selectedValues = typeof value === 'string' ? value.split(',').map(Number) : value;
//         setPermisosId(selectedValues);
//     };

//     //==================== Start: Tabla Usuarios
//     const paginationModel = { page: 0, pageSize: 10 };

//     const columns: GridColDef[] = [
//         {
//             field: 'no_nomina',
//             headerName: 'ID',
//             width: 180,
//             headerClassName: '--header-table',
//         },
//         {
//             field: 'nombre',
//             headerName: 'Nombre del colaborador',
//             width: 350,
//             headerClassName: '--header-table'
//         },
//         {
//             field: 'centro_costo',
//             headerName: 'Username',
//             width: 280,
//             align: 'center',
//             headerClassName: '--header-table'
//         },
//         {
//             field: 'puesto',
//             headerName: 'Cargo',
//             width: 230,
//             align: 'center',
//             headerClassName: '--header-table'
//         },
//         {
//             field: 'Rol',
//             headerName: 'Rol',
//             width: 180,
//             align: 'center',
//             headerClassName: '--header-table'
//         },
//         {
//             field: 'acciones',
//             headerName: 'Acciones',
//             disableColumnMenu: true,
//             sortable: false,
//             width: 220,
//             align: 'center',
//             headerAlign: 'center',
//             headerClassName: '--header-table',
//             renderCell: (params) => (
//                 <Button
//                     variant="text"
//                     sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
//                     onClick={() => openModalEditUser(params.row)}
//                 >
//                     <img src={EditSvg} style={{ marginRight: 5 }} /> Editar Usuario
//                 </Button>
//             ),
//         },
//     ];
  

//     const loadUsuarios = async () => {
//         setPending(true);
//         try {

//             const data = await listUsersService();
//             setRows(data);

//         } finally {
//             setPending(false);
//         }
//     };
//     // ==================== End: Tabla Usuarios


//     //==================== Start: Tabla de Roles

//     const columnsGroup: GridColDef[] = [
//         {
//             headerName: 'Roles',
//             field: 'nombre',
//             width: 500,
//             headerClassName: '--header-table',
//         },
//         {
//             headerName: 'Permisos',
//             field: 'permisos',
//             width: 670,
//             headerClassName: '--header-table'
//         },
       
//         {
//             headerName: 'Acciones',
//             field: 'acciones',
//             disableColumnMenu: true,
//             sortable: false,
//             width: 270,
//             align: 'center',
//             headerAlign: 'center',
//             headerClassName: '--header-table',
//             renderCell: (params) => (
//                 <Stack direction="row" justifyContent="center">
//                     <Button
//                         variant="text"
//                         sx={{ color: 'black', ml: 1, boxShadow: 'none' }}>
//                         <img src={EditSvg} style={{ marginRight: 5 }} /> Editar Rol
//                     </Button>
//                     <Button
//                         variant="text"
//                         sx={{ color: 'black', ml: 1, boxShadow: 'none' }}
//                         onClick={() => showAlert(params.row.id)}
//                     >
//                         <img src={TrashSvg} style={{ marginRight: 5 }} /> Eliminar Rol
//                     </Button>
                
//                 </Stack>
//             ),
//         },
//     ];
   
//      const loadRoles = async () => {
//         const data = await listPermissionService();
//         setPermisos(data);
//     };
    
//     const listGroupPermission = async () => {
//         setListGroupPending(true);
//         try {

//             const data = await listRolService();
//             setGroupRows(data);

//         } finally {
//             setListGroupPending(false);
            
//         }
//     }
//     //==================== End: Table Roles

//     const handleDeleteGroup = async () => {
//         listGroupPermission()
//     };

//     //Acciones de la tabla de Roles
//     const showAlert = (id: number) => {
//         setAlert({
//             title: '¿Eliminar rol?',
//             text: 'Al confirmar, el Rol será eliminado permanentemente del sistema.',
//             open: true,
//             value: id,
//             icon: 'delete',
//             onConfirm: handleDeleteGroup,
//         });
//     };


//     //Acciones tabla de Usuarios
//     const closeModal = () => {
//         setOpen(false);
//         setInfoUser(undefined)
//     };


//     // Edicion de usuario
//     const onSubmitEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setLoader(true);

//         const form = e.currentTarget;
        
//         const payload = {
//             permissions: permisosId,
//             groups: rolesId,
//         };


//         try {
//             if (infoUser?.id !== undefined) {
//                 await editUserPermissionsService(infoUser.id, payload);
//             }
            
//             // Limpiamos los campos
//             form.reset();
//             setRolesId([])
//             setPermisosId([])
//             closeModal();

//             // Actualizamos la lista de los usuarios
//             loadUsuarios();

//             // Mostramos la alerta de exito
//             setAlert({
//                 title: "Usuario editado con exito!",
//                 text: "Los cambios fueron aplicados correctamente.",
//                 open: true,
//                 time: 2000,
//                 icon: "success",
//             }); 



//         } finally {
//             setLoader(false);
//         }
        
//     };

//     const openModalEditUser = (row: IUserTable) => {
//         setRolesId([])
//         setPermisosId([])
//         setOpen(true);
//         setInfoUser(row)
//     }



//     // Cargamos los servicios necesarios
//     useEffect(() => {
//         listGroupPermission()
//         loadUsuarios();
//         loadRoles();
//     }, []);


//     return (


//          <Box sx={{ width: '100%' }}>
//             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                 <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                     <Tab label="Asignar Rol" {...a11yProps(0)} />
//                     <Tab label="Roles" {...a11yProps(1)} />
//                 </Tabs>
//             </Box>
//             {/* TAB: ASIGNACION DE ROLES */}
//             <CustomTabPanel value={value} index={0}>
//                 <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
//                     <Box>
//                         <Typography variant="h5"  sx={{ color: 'primary.main', fontWeight: 'bold', marginTop: '20px', marginBottom: '15px' }}>
//                             Lista de Usuarios
//                         </Typography>
//                     </Box>
//                     <Box>
//                         <Button
//                             type="button"
//                             variant="contained"
//                             sx={{mt:2}}
//                             onClick={() => navigate("/crear-rol")}
//                         >
//                             <img src={AddButtonSvg} alt="Crear Usuario" style={{marginRight: '10px'}} /> Crear Usuario
//                         </Button>
//                     </Box>

//                 </Box>
//                 <Box component="div" sx={{
//                     mt: 5,
//                     width: '100%',
//                     '& .--header-table': {
//                         backgroundColor: 'primary.main',
//                         fontWeight: 900
//                     },
//                 }}>
//                     <DataGrid
//                         rows={rows}
//                         columns={columns}
//                         initialState={{ pagination: { paginationModel } }}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         loading={pending}
//                         localeText={esES.components.MuiDataGrid.defaultProps.localeText}
//                     />
//                 </Box>

//             </CustomTabPanel>
            
//             {/* TAB: ROLES */}
//             <CustomTabPanel value={value} index={1}>
//                  <Button
//                     type="button"
//                     variant="contained"
//                     sx={{mt:2}}
//                     onClick={() => navigate("/crear-rol")}
//                 >
//                     <img src={AddButtonSvg} alt="Agregar Rol" style={{marginRight: '10px'}} /> Agregar Rol
//                 </Button>

//                 <Box component="div" sx={{
//                     mt: 5,
//                     width: '100%',
//                     '& .--header-table': {
//                         backgroundColor: 'primary.main',
//                         fontWeight: 900
//                     },
//                 }}>
//                     <DataGrid
//                         rows={rowsGroup}
//                         columns={columnsGroup}
//                         initialState={{ pagination: { paginationModel } }}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         loading={pendingListGroup}
//                         localeText={esES.components.MuiDataGrid.defaultProps.localeText}
//                     />
//                 </Box>
//             </CustomTabPanel>

//               <Modal
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 aria-labelledby="edit-role-modal"
//                 aria-describedby="edit-role-modal-description"
//             >
//                 <Box
//                     sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         width: 650,
//                         bgcolor: "background.paper",
//                         boxShadow: 24,
//                         p: 3,
//                         borderRadius: 2,
//                     }}
//                 >
//                     {/* Modal Header */}
//                     <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
//                         Editar Rol
//                     </Typography>

//                     {/* Modal Body */}
//                     <form onSubmit={onSubmitEditUser}>
//                         <Box sx={{ mb: 3 }}>
//                                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                                     {infoUser?.no_nomina}
//                                 </Typography>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                     {infoUser?.nombre}
//                                 </Typography>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                     {infoUser?.puesto}
//                                 </Typography>

//                                 {/* Select Rol */}
//                                 <FormControl fullWidth sx={{ mt: 5 }}>
//                                     <InputLabel id="rol-label">Roles</InputLabel>
//                                     <Select
//                                         labelId="rol-label"
//                                         id="rol-select"
//                                         value={rolesId}
//                                         label="Roles"
//                                         name="groups"
//                                         multiple
//                                         required
//                                         onChange={handleChangeRoles}
//                                     >
//                                         {rowsGroup.map((grupo) => (
//                                             <MenuItem key={grupo.id} value={grupo.id}>
//                                                 {grupo.nombre}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                                 {/* Permisos adicionales */}
//                                 <FormControl fullWidth sx={{ mt: 2 }}>
//                                     <InputLabel id="rol-label">Permisos</InputLabel>
//                                     <Select
//                                         labelId="rol-label"
//                                         id="permiso-select"
//                                         name="permissions"
//                                         multiple
//                                         value={permisosId}
//                                         label="Permisos"
//                                         onChange={handleChangePermisos}
                                        
//                                     >
//                                         {permisos.map((permiso) => (
//                                             <MenuItem key={permiso.id} value={permiso.id}>
//                                                 {permiso.permission_name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                         </Box>

//                         {/* Modal Footer */}
//                         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
//                             <Button variant="outlined" color="primary" onClick={closeModal}>
//                                 Cancelar
//                             </Button>
//                             <Button variant="contained" color="primary" type="submit">
//                                 {loader ? (
//                                     <div style={{ display: "flex", alignItems: "center" }}>
//                                         <Typography variant="body1" sx={{ marginRight: "10px" }}>
//                                             Guardando...
//                                         </Typography>
//                                         <CircularProgress size={20} sx={{ color: "white" }} />
//                                     </div>
//                                 ) : (
//                                     "Guardar"
//                                 )}
//                             </Button>
//                         </Box>
//                     </form>
//                 </Box>
//             </Modal>

//         </Box>
        
//     )
// }








