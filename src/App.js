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
      case 1: // Settings Page
        return (<Settings />)
      case 2: // About Page
        return (<About />)
    }
  }


  return (
    <div>
      <header>
        This is a header that is in all of the veiws but is only programmed in the app.js
        <h1>Realtime Marine Tracker</h1>
        <button id="about-button" class="about-button">About</button>
      </header>
      
      {displayPage()}
    
    <footer>
      This is a footer that is in all of the veiws but is only programmed in the app.js
    </footer>
    </div>
  );
}

export default App;
