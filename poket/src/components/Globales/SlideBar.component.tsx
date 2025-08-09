import { Listbox, ListboxItem} from "@nextui-org/listbox";
import { Avatar, Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import logoGs from "../../assets/gs.png";
import HomeIconSvg from "../../assets/icons/SlideBar/Home.svg";
import LogOutIconSvg from "../../assets/icons/SlideBar/LogOut.svg";
import InfoSvg from "../../assets/icons/SlideBar/info.svg";
import SettingSvg from "../../assets/icons/SlideBar/Settings.svg";
import DocsSvg from "../../assets/icons/SlideBar/Doc.svg";
import CreateFolioSvg from "../../assets/icons/SlideBar/CreateFolio.svg";
import BaseSvg from "../../assets/icons/SlideBar/Base.svg";
import ConciliadorSvg from "../../assets/icons/SlideBar/Conciliador.svg";
import AskSvg from "../../assets/icons/SlideBar/Ask.svg";
import CloseSvg from "../../assets/icons/SlideBar/Close.svg";
import { SlideBarProps } from "../../interfaces/components.interface";
import { useAuth } from "../../hooks/useAuth";
import { CustomNavLink } from "./NavLinkMenu.component";
import { decodeToken } from "../../utils/options.token";


export function SlideBarComponent({ isAsideVisible, toggleAside }: SlideBarProps) {

    const { logout } = useAuth();
    
    const asideRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                toggleAside(); // Detectamos si el click fue fuera del aside y cerramos el menu
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [toggleAside]);

 

    return (

      
            
        <aside
            ref={asideRef}
            className={`w-64 min-w-64 bg-white shadow h-full flex-col flex transition-transform duration-300 ease-in-out sm:relative absolute top-0 left-0 z-10 sm:z-auto ${isAsideVisible ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
            
            <div className="p-5">
                <img src={logoGs} alt="Grupo Sánchez" className="h-auto mb-4" />
            </div>

                <div className="p-3 border-t border-gray-200"></div>
            <nav className="flex-1 ml-5 mr-5  overflow-y-auto">

                        
                <CustomNavLink to="/dashboard" imageSrc={HomeIconSvg} text="Inicio" />
                <CustomNavLink to="/finiquitos" imageSrc={DocsSvg} text="Tabla de Finiquitos" />

                <Accordion selectionMode="multiple" className="w-auto">

                    <AccordionItem key="1" aria-label="Gestión de Folios" title="Gestión de Folios" className="font-semibold text-sm">
                        <CustomNavLink to="/crear-folio" imageSrc={CreateFolioSvg} text="Crear Folio" />
                        <CustomNavLink to="/consultar-folio" imageSrc={InfoSvg} text="Consultar Folio" />
                    </AccordionItem>

                    <AccordionItem key="2" aria-label="Base de Datos" title="Base de Datos" className="font-semibold text-sm">
                        <CustomNavLink to="/centros-de-costo" imageSrc={BaseSvg} text="Centro de Costo" />
                        <CustomNavLink to="/conciliador" imageSrc={ConciliadorSvg} text="Conciliador" />
                        <CustomNavLink to="/motivos-de-bajas" imageSrc={AskSvg} text="Motivos de bajas" />
                        <CustomNavLink to="/bajas-de-registro" imageSrc={CloseSvg} text="Bajas de Registro" />
                    </AccordionItem>
                </Accordion>

                <CustomNavLink to="/configuracion" imageSrc={SettingSvg} text="Configuración" />

    
            </nav>

            <div className="p-1 border-t border-gray-200"></div>
            <Listbox aria-label="CloseSession" className="w-auto ml-3 mr-5">
                <ListboxItem
                    key="CerrarSession"
                    color="primary"
                    startContent={<><><img src={LogOutIconSvg} alt="Cerrar Sesion" className="h-auto" /></></>}
                    onPress={() => {
                        logout();
                        }} >
                    Cerrar Sesión
                </ListboxItem>
            </Listbox>

            <div className="p-2 border-t border-gray-200 ">

                <div className="flex gap-4 items-center my-4 ">
                    <Avatar isBordered as={'button'} color="primary" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    <div>
                        <h5 className="text-sm text font-bold">
                            {decodeToken()?.username} 
                        </h5>
                        <h6 className="text-xs line-clamp-1 text-gray-600">Administrador</h6>
                    </div>
                </div>

            </div>

        </aside>
    )
}
