import logo from './logo.svg';
import './App.css';
import Tracker from './Tracker';
import Settings from './Settings';
import About from './About';
import { useState } from 'react';


function App() {
  const [page, setPage] = useState(0);

  const displayPage = () => {
    switch (page) {
      case 0: // Tracker Page
        return (<Tracker />)
        break;
      case 1: // Settings Page
        return (<Settings />)
        break;
      case 2: // About Page
        return (<About />)
        break;
    }
  }


  return (
    <div>
      
      {displayPage()}
    
    </div>
  );
}

export default App;
