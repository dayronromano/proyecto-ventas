import './App.css';
import { AuthProvider } from './context/AuthProvider.jsx';
import { AppRouting } from './routes/AppRouting.jsx';

function App() {
  return (
    <div className={`App d-flex`}>
      <AuthProvider>
        <AppRouting />
      </AuthProvider>
    </div>
  );
}

export default App;
