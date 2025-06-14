import { Route, Routes } from 'react-router-dom';
import MNISTRoutes from '../mnistApp/routes/mnistRoutes';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<MNISTRoutes />} />
    </Routes>
  );
};
