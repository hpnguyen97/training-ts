import React, { useState } from 'react';
import './App.css';
import ModalProject from './components/Project/ModalProject';

function App() {

  const [openModalProject, setOpenModalProject] = useState(false)
  return (
    <div className="App">
      <button onClick={() => setOpenModalProject(true)}>Open Project</button>
      <ModalProject openModalProject={openModalProject} setOpenModalProject={setOpenModalProject} title="Project" />
    </div>
  );
}

export default App;
