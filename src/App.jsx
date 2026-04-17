import './i18n';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.jsx';
const App = () => {
  return (
    <ThemeProviderWrapper>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProviderWrapper>
  );
};

export default App;
