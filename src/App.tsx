
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Index from "@/pages/Index";
import Dishes from "@/pages/Dishes";
import Inventory from "@/pages/Inventory";
import Staff from "@/pages/Staff";
import NotFound from "@/pages/NotFound";
import { Toaster } from "sonner";
import Counter from '@/pages/Counter';
import KitchenDisplay from '@/pages/KitchenDisplay';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/kitchen-display" element={<KitchenDisplay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}
