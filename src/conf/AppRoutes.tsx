import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Suspense, lazy } from "react";
import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import PageHome from "../pages/home/PageHome";

const PageEditFld = lazy(() => import("../pages/edit/fld/PageEditFld"));
const PageEditLevel = lazy(() => import("../pages/edit/level/PageEditLevel"));
const PagePckExtractor = lazy(() => import("../pages/extract-pck/PagePckExtractor"));
const darkTheme = createTheme({ palette: { mode: "dark" } });

export const PROJECT_URL = "https://github.com/Morodar/InvasionEdit";
export const HOME = "/home";
export const EDIT_FLD = "/edit/fld";
export const EDIT_LVL = "/edit/level";
export const EXTRACT_PCK = "/extract/pck";

export const AppRoutes = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <HashRouter>
                <Suspense fallback={<LoadingBar />}>
                    <Routes>
                        <Route path={EXTRACT_PCK} element={<PagePckExtractor />} />
                        <Route path={EDIT_FLD} element={<PageEditFld />} />
                        <Route path={EDIT_LVL} element={<PageEditLevel />} />
                        <Route path={HOME} element={<PageHome />} />
                        <Route path="/*" element={<Navigate to={HOME} />} />
                    </Routes>
                </Suspense>
            </HashRouter>
        </ThemeProvider>
    );
};

const LoadingBar = () => {
    return (
        <Box sx={{ width: "100%" }} component="div">
            <LinearProgress />
        </Box>
    );
};
