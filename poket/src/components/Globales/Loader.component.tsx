import CircularProgress from '@mui/material/CircularProgress';
import { LoaderProps } from "../../interfaces/components.interface";
import { Box, Typography } from '@mui/material';


export function LoaderComponent({ color = "primary", size = "md", textInfo = null}: LoaderProps) {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{mt:3}} >
            <CircularProgress color={color} size={size} />
            {textInfo ? <Typography component="h3" sx={{fontWeight: 600, mt:1, mb:3}}> {textInfo} </Typography> : null}
        </Box>
    );
}
