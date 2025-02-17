import {Routes, Route} from 'react-router-dom'
import './App.css';
import LobyScreen from './screens/Loby';
import RoomPage from './screens/Room';

function App() {
  return (
   <Routes>
    <Route path="/" element={<LobyScreen />} />
    <Route path="/room/:roomId" element={<RoomPage />} />
   </Routes>
  );
}

export default App;
