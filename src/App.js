import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonList from './Components/Person/PersonList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PersonList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;