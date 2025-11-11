import './App.css';
import { TanstackQueryDemo } from './components/TanstackQueryDemo/TanstackQueryDemo.tsx';
import { ErrorBoundary } from './components/ErrorBoundary/ErroBoundary.tsx';
import { BigFrontendPlayground } from './components/BigFrontendPlayground/BigFrontendPlayground.tsx';

function App() {
  return (
    <div>
      <ErrorBoundary>
        {Math.random() ? null : <BigFrontendPlayground />}
        <TanstackQueryDemo />
      </ErrorBoundary>
    </div>
  );
}

export default App;
