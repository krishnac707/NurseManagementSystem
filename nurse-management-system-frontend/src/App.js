import { Route, Routes } from 'react-router-dom';
import './App.css';
import NurseDetail from './Components/nurse-folder/NurseDetail';

function App() {

  return (
    <div>
      <Routes>
        <Route exact path='/' element={<NurseDetail />}/>
      </Routes>
    </div>
  );
}

export default App;
