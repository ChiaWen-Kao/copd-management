// To run MUI material, run: npm install @mui/material@5.16.7 @emotion/react @emotion/styled
import { createTheme } from "@mui/material/styles";

// Keeping this file first but still need customisation here
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#6F7F6B",
      dark: "#B5D5AE",
    },
    secondary: {
      main: "#E8F6E5",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
  },
});

export default customTheme;
