import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionForm from "./components/PredictionForm";
import HistorySection from "./components/HistorySection";
import PiecesPage from "./pages/PiecesPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/predict" element={<PredictionForm onPredict={() => {}} isLoading={false} />} />
            <Route path="/history" element={<HistorySection predictions={[]} onClear={() => {}} />} />
            <Route path="/clusters" element={<PiecesPage />} />
            <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
