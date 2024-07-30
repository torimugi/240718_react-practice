import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HOME from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline'; // CssBaselineをインポート

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HOME />}/>
            <Route path="/report" element={<Report />}/>
            <Route path="*" element={<NoMatch />}/>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;