import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './auth/AuthContext';
import { GlobalStyle } from './styles';
import BottomNav from './components/Layouts/BottomNav';

const App = () => (
  <AuthProvider>
    <GlobalStyle />
    <AppRoutes />
  </AuthProvider>
);

export default App;
