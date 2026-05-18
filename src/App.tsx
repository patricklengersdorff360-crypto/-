import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Garden from './pages/Garden';
import PetPage from './pages/PetPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/pet/:id" element={<PetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
