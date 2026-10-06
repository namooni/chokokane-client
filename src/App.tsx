import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './auth/AuthContext';
import { GlobalStyle } from './styles';

const App = () => (
  <AuthProvider>
    <GlobalStyle />
    <AppRoutes />
  </AuthProvider>
);

export default App;
