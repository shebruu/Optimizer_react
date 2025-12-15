import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import HistorySection from "@/components/HistorySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface Prediction {
  id: string;
  date: Date;
  volume_mm3: number;
  resin_ml: number;
}

interface FormDataFromForm {
  volume_mm3: string;
  surface_area_mm2: string;
  bounding_box_x: string;
  bounding_box_y: string;
  bounding_box_z: string;
  complexity_score: string;
  supports_volume: string;
  predicted_resin_ml?: number;
  predicted_density?: number;
}

const STORAGE_KEY = "resin_predictions_history";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ resinMl: number } | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Lecture au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        id: string;
        date: string;
        volume_mm3: number;
        resin_ml: number;
      }[];

      const restored: Prediction[] = parsed.map((p) => ({
        ...p,
        date: new Date(p.date),
      }));

      setPredictions(restored);
    } catch (e) {
      console.error("Erreur de lecture de l'historique :", e);
    }
  }, []);

  // Sauvegarde de l'historique 
  useEffect(() => {
    try {
      const toStore = predictions.map((p) => ({
        ...p,
        date: p.date.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error("Erreur de sauvegarde de l'historique :", e);
    }
  }, [predictions]);

  const handlePredict = async (data: FormDataFromForm) => {
    const resinMl = data.predicted_resin_ml;

    if (typeof resinMl !== "number") {
      toast({
        title: "Erreur",
        description: "Aucune prédiction ML reçue du backend.",
        variant: "destructive",
      });
      return;
    }

    setResult({ resinMl });

    const newPrediction: Prediction = {
      id: Date.now().toString(),
      date: new Date(),
      volume_mm3: parseFloat(data.volume_mm3),
      resin_ml: resinMl,
    };

    setPredictions((prev) => [newPrediction, ...prev]);

    toast({
      title: "Estimation terminée",
      description: `Résine: ${resinMl.toFixed(2)} ml`,
    });
  };

  const handleClearHistory = () => {
    setPredictions([]);
    toast({
      title: "Historique effacé",
      description: "Toutes les prédictions ont été supprimées",
    });
  };






  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

      
        <section id="calculator" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
                <span className="text-gradient">Calculateur de résine</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Renseignez les paramètres géométriques de votre modèle 3D et obtenez une estimation
              </p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
              {result && (
                <PredictionResult
                  resinMl={result.resinMl}
                  isVisible={!!result}
                />
              )}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section id="history" className="py-20 bg-card/30">
          <div className="container mx-auto px-4 flex justify-center">
            <HistorySection
              predictions={predictions}
              onClear={handleClearHistory}
            />
          </div>
        </section>

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
