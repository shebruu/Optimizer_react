
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

import type { FormData as PredictionFormData } from "./PredictionForm";


interface Props {
  formData: PredictionFormData;
  apiBase: string;
  disabled?: boolean;
  onError?: (msg: string) => void;
  onSuccess?: (msg: string) => void;
}

const DetectAnomalyButton = ({
  formData,
  apiBase,
  disabled,
  onError,
  onSuccess,
}: Props) => {
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || localLoading) return;
    setLocalLoading(true);
    onError?.("");
    onSuccess?.("");

const payload = {
  volume: Number(formData.volume_mm3),
  surface_area: Number(formData.surface_area_mm2),
  bbox_x: Number(formData.bounding_box_x),
  bbox_y: Number(formData.bounding_box_y),
  bbox_z: Number(formData.bounding_box_z),
  scale: Number(formData.scale),
  euler_number: formData.use_euler_number
    ? Number(formData.euler_number)
    : 0,
};


    try {
      const res = await fetch(`${apiBase}/api/anomaly`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        onError?.(json.error || "Impossible de calculer l'anomalie.");
        return;
      }

      const { is_anomaly, score } = json.data || {};
      onSuccess?.(
        is_anomaly
          ? `Détectée (score: ${score ?? "n/a"})`
          : `Pièce normale (score: ${score ?? "n/a"})`
      );
    } catch (e) {
      console.error("Erreur anomalie", e);
      onError?.("Erreur de service");
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = disabled || localLoading;

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" /> Détection ...
        </>
      ) : (
        <>
          <AlertTriangle className="w-5 h-5" /> Détecter une anomalie
        </>
      )}
    </Button>
  );
};

export default DetectAnomalyButton;
