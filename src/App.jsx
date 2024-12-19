import { useContext } from 'react';
import { router } from './routes/router';
import './style/main.css';
import { RouterProvider } from 'react-router-dom';
import UserContext from './context/UserContext';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const { isLoading } = useContext(UserContext);

  if (isLoading) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}

export default App;
