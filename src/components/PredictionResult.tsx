import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CheckCircle } from "lucide-react";



interface PredictionResultProps {
  resinMl: number | null | undefined;
  isVisible: boolean;
}

const PredictionResult = ({ resinMl, isVisible }: PredictionResultProps) => {
  if (!isVisible || resinMl == null || Number.isNaN(resinMl)) return null;

  return (
    <Card variant="glass" className="w-full max-w-2xl animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle className="w-5 h-5" />
          Résultat de l'estimation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Résine nécessaire
              </span>
            </div>
            <p className="text-4xl font-mono font-bold text-foreground">
              {resinMl.toFixed(2)}{" "}
              <span className="text-lg text-muted-foreground">g</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
