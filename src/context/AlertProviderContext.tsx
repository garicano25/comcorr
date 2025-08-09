import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    Button,
    Typography,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Icon,
} from '@mui/material';
import CloseSvg from '../assets/icons/Alert/Close.svg'
import CheckSvg from '../assets/icons/Alert/Check.svg'

// Definir el contexto
interface AlertContextProps {
    title: string;
    text: string;
    open: boolean;
    value: number;
    setAlert: (config: {
        title: string;
        text?: string;
        open: boolean;
        value?: number;
        time?: number;
        icon: 'success' | 'delete' | 'warning' | 'question';
        onConfirm?: () => void;
    }) => void;
    time?: number;
    icon: 'success' | 'delete' | 'warning' | 'question';
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// Proveedor del contexto
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [value, setValue] = useState<number>(0);
    const [time, setTime] = useState<number | undefined>(undefined);
    const [icon, setIcon] = useState<'success' | 'delete' | 'warning' | 'question'>('success');
    const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);

    const setAlert = ({
        title,
        text = '',
        open,
        value = 0,
        time = 0,
        icon,
        onConfirm,
    }: {
        title: string;
        text?: string;
        open: boolean;
        value?: number;
        time?: number;
        icon: 'success' | 'delete' | 'warning' | 'question';
        onConfirm?: () => void;
    }) => {
        setTitle(title);
        setText(text);
        setOpen(open);
        setValue(value);
        setIcon(icon);
        setTime(time);
        setOnConfirm(() => onConfirm);
    };

    const closeModal = () => {
        setOpen(false);
        setValue(0);
    };

    const handleConfirm = async () => {
        setLoader(true);
        if (onConfirm) {
            await onConfirm();
        }
        setLoader(false);
        closeModal();
    };

    const closeModalTime = (time: number) => {
        setTimeout(() => {
            setOpen(false);
        }, time);
    };

    if (time !== 0 && time) {
        closeModalTime(time);
    }

    return (
        <AlertContext.Provider value={{ title, text, open, value, setAlert, time, icon }}>
            <Dialog open={open} onClose={closeModal}>
                {icon === 'question' ? (
                
                     <DialogTitle>
                        <Box display="flex" justifyContent="center" alignItems="center">
                           <Icon color='primary' sx={{fontSize: 70}}>help</Icon>
                        </Box>
                    </DialogTitle>

                ) : (

                    <DialogTitle>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            {icon === 'success' ? (
                                <img src={CheckSvg} className='w-20' />
                            ) : (
                                <img src={CloseSvg} className='w-20' />
                            )}
                        </Box>
                    </DialogTitle>

                )}
                <DialogContent>
                    <Typography variant="h4" align="center" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        {icon === 'delete' || icon === 'warning'
                            ? title || '¿Desea eliminar este registro?'
                            : title || 'Registro guardado con éxito'}
                    </Typography>
                    <DialogContentText align="center">{text}</DialogContentText>
                    <input type="hidden" name="value" value={value} />
                </DialogContent>
                {icon === 'delete' || icon === 'question' && (
                    <DialogActions style={{ justifyContent: 'space-between', padding: '20px' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={loader}
                            onClick={handleConfirm}
                        >
                            {loader ? <CircularProgress size={20} /> : 'Confirmar'}
                        </Button>
                        <Button variant="contained" color="primary" onClick={closeModal}>
                            Cancelar
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
            {children}
        </AlertContext.Provider>
    );
};

// Hook para usar el contexto
export const useAlert = (): AlertContextProps => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert debe estar dentro del AlertProvider');
    }
    return context;
};