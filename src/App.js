import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonList from './Components/Person/PersonList';
// import EditPersonPage from './Components/Person/EditPersonPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PersonList />} />
          {/* <Route path="/edit-person/:personId" element={<EditPersonPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;