import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Timer } from './assignments/timer/timer.tsx';
// import { UserSearch } from './assignments/users-search/user-search.tsx';
import { UserSearchSimple } from './assignments/users-search/user-search-simple';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/users-search" element={<UserSearchSimple />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
