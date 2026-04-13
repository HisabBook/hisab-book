import MainLayout from './components/layout/MainLayout';
import AppRouter from './routes/AppRouter';
import './App.css';

function App() {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
}

export default App;