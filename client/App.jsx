import { h } from 'preact';
import { Router, Route } from 'wouter';
import HomePage from '@/presentation/pages/HomePage';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Route path="/">
          <HomePage />
        </Route>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
