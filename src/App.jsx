import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.jsx';

const App = () => {
  return (
    <ThemeProviderWrapper>
      <RouterProvider router={router} />
    </ThemeProviderWrapper>
  );
};

export default App;
