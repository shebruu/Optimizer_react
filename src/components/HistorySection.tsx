import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Droplets, Euro, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prediction {
  id: string;
  date: Date;
  volume_mm3: number;
  resin_ml: number;
}

interface HistorySectionProps {
  predictions: Prediction[];
  onClear: () => void;
}

const HistorySection = ({ predictions, onClear }: HistorySectionProps) => {
  if (predictions.length === 0) {
    return (
      <Card variant="default" className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Historique des prédictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucune prédiction pour le moment</p>
            <p className="text-sm">Vos estimations apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default" className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <History className="w-8 h-8 text-primary" />
          Historique des prédictions
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear} className="flex items-center">
          <Trash2 className="w-5 h-5 mr-2" />
          Effacer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-base font-semibold text-muted-foreground">Date</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-muted-foreground">Volume</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-muted-foreground">
                  <Droplets className="w-5 h-5 inline mr-1" />
                  Résine
                </th>
                <th className="text-left py-4 px-4 text-base font-semibold text-muted-foreground">
                  <Euro className="w-5 h-5 inline mr-1" />
                  Coût
                </th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred) => (
                <tr key={pred.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4 text-base font-mono">
                    {pred.date.toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4 text-base font-mono">{pred.volume_mm3.toLocaleString()} mm³</td>
                  <td className="py-4 px-4 text-base font-mono text-primary">{pred.resin_ml.toFixed(2)} g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistorySection;
