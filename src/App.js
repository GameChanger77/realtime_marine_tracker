import logo from "./logo.svg";
import "./App.css";
import Tracker from "./Tracker";
import Settings from "./Settings";
import About from "./About";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(0);

  const displayPage = () => {
    switch (page) {
      case 0: // Tracker Page
        return <Tracker />;
      case 1: // Settings Page
        return <Settings />;
      case 2: // About Page
        return <About />;
    }
  };

  return (
    <div>
      <header>
        <h1>Realtime Marine Tracker</h1>
        <p>
          <button id="about-button" class="about-button">
            About
          </button>
          <button id="settings-button" class="settings-button">
            Settings
          </button>
        </p>
      </header>

      {displayPage()}

      <footer>
        <div>
          <p>© 2023 Timothy Kuehn & Jacob Schulmeister V</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
