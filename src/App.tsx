import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Timer } from './assignments/timer/timer.tsx';

function App() {
  return (
    <ErrorBoundary>
      <Timer />
    </ErrorBoundary>
  );
}

export default App;
