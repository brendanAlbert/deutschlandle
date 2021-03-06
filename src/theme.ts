import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        }
    },
    spacing: 6,
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    maxWidth: '460px',
                }
            }
        }
    }
})