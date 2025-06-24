import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import Backgrnd from './backgrnd';
import MemHir from './change_hirarchy';
import Splash from './splash';
import ThemeContext from './ThemeContext'

function App() {
  const [theme, setTheme] = useState(1);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Routes>
        <Route path="/background" element={<Backgrnd />} />
        <Route path="/change_hir" element={<MemHir />} />
        <Route path="/" element={<Splash set_theme={setTheme} />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default App;
