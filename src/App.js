import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';

// Pages
import SpeedTest from './pages/SpeedTest';
import TimeCalculator from './pages/TimeCalculator';

// Styles
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/Theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<SpeedTest />} />
            <Route path="/calculator" element={<TimeCalculator />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;