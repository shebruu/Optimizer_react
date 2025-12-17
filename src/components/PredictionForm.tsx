import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
import { Loader2, Calculator, FileBox } from "lucide-react";
import StlUploadSection from "./StlUploadSection";
import GeometryInputs from "./GeometryInputs";
import StlPreview3D from "./StlPreview3d.tsx";
import AnomalyButton from "./AnomalyButton";

export interface FormData {
  volume_mm3: string;
  surface_area_mm2: string;
  bounding_box_x: string;
  bounding_box_y: string;
  bounding_box_z: string;
  complexity_score: string;
  supports_volume: string;
  stl_filename: string;
  scale: string;
  euler_number: string;
  use_euler_number: boolean;
  manual_volume: boolean;
  manual_surface: boolean;
  manual_bbox_x: boolean;
  manual_bbox_y: boolean;
  manual_bbox_z: boolean;
  // champs ML optionnels
  predicted_resin_ml?: number;
  predicted_density?: number;
}

interface PredictionFormProps {
  onPredict: (data: FormData) => void;
  isLoading: boolean;
}

const API_BASE = "http://localhost:3000";

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({

    volume_mm3: "",
    surface_area_mm2: "",
    bounding_box_x: "",
    bounding_box_y: "",
    bounding_box_z: "",
    complexity_score: "",
    supports_volume: "",
    stl_filename: "",
    scale: "1",
    euler_number: "",
    use_euler_number: false,
    manual_volume: false,
    manual_surface: false,
    manual_bbox_x: false,
    manual_bbox_y: false,
    manual_bbox_z: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleToggleManual = (fieldKey: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".stl")) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        stl_filename: file.name,
      }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, stl_filename: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExtractStl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedFile) {
      setError("Aucun fichier STL sélectionné.");
      return;
    }

    const fd = new window.FormData();
    fd.append("stl", selectedFile);
    fd.append("scale", formData.scale);
    if (formData.use_euler_number && formData.euler_number) {
      fd.append("euler_number", formData.euler_number);
    }
      setIsExtracting(true);   

    try {
      const response = await fetch(`${API_BASE}/api/pieces/upload-stl`, {
        method: "POST",
        body: fd,
      });
      const json = await response.json();
      console.log("Réponse brute backend /api/pieces/upload-stl:", json);

      if (!response.ok) {
        setError(json.error || "Erreur lors de l'extraction STL.");
        return;
      }

      if (!json || (!json.data && typeof json.volume === "undefined")) {
        console.warn(
          "Réponse inattendue du backend, aucun champ exploitable pour le front :",
          json
        );
      }

      const piece = json.data || json;

      console.log("Champs extraits pour remplissage:", {
        volume: piece.volume,
        surface_area: piece.surface_area,
        bbox_x: piece.bbox_x,
        bbox_y: piece.bbox_y,
        bbox_z: piece.bbox_z,
        euler_number: piece.euler_number,
      });

      setFormData((prev) => {
        const updated: FormData = {
          ...prev,
          volume_mm3: prev.manual_volume
            ? prev.volume_mm3
            : piece.volume !== undefined
            ? String(piece.volume)
            : prev.volume_mm3,
          surface_area_mm2: prev.manual_surface
            ? prev.surface_area_mm2
            : piece.surface_area !== undefined
            ? String(piece.surface_area)
            : prev.surface_area_mm2,
          bounding_box_x: prev.manual_bbox_x
            ? prev.bounding_box_x
            : piece.bbox_x !== undefined
            ? String(piece.bbox_x)
            : prev.bounding_box_x,
          bounding_box_y: prev.manual_bbox_y
            ? prev.bounding_box_y
            : piece.bbox_y !== undefined
            ? String(piece.bbox_y)
            : prev.bounding_box_y,
          bounding_box_z: prev.manual_bbox_z
            ? prev.bounding_box_z
            : piece.bbox_z !== undefined
            ? String(piece.bbox_z)
            : prev.bounding_box_z,
          euler_number:
            piece.euler_number !== undefined
              ? String(piece.euler_number)
              : prev.euler_number,
        };
        console.log("formData after update:", updated);
        return updated;
      });

      setSuccess("Extraction STL terminée.");
    } catch (err) {
      setError("Erreur réseau ou serveur lors de l'extraction STL.");
      console.error("Extract STL error", err);
  } finally {
    setIsExtracting(false);      
  }
};

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

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
      const response = await fetch(`${API_BASE}/api/predictions/ml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log("Réponse /api/predictions/ml :", json);

      if (!response.ok) {
        setError(json.error || "Erreur lors de la prédiction.");
        return;
      }

      const { prediction, density } = json.data || {};

      setSuccess("Prédiction terminée.");

      onPredict({
        ...formData,
        predicted_resin_ml: prediction,
        predicted_density: density,
      });
    } catch (err) {
      setError("Erreur réseau ou serveur lors de la prédiction.");
      console.error("Erreur prédiction", err);
    }
  };

  const handleCreatePiece = async () => {
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        volume: Number(formData.volume_mm3),
        surface_area: Number(formData.surface_area_mm2),
        bbox_x: Number(formData.bounding_box_x),
        bbox_y: Number(formData.bounding_box_y),
        bbox_z: Number(formData.bounding_box_z),
        scale: Number(formData.scale),
        euler_number: formData.use_euler_number
          ? Number(formData.euler_number)
          : null,
      };
      const response = await fetch(`${API_BASE}/api/pieces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Erreur lors de la création de la pièce.");
        return;
      }
      setSuccess("Pièce créée avec succès.");
    } catch (err) {
      setError("Erreur réseau ou serveur lors de la création de la pièce.");
      console.error("Erreur création pièce", err);
    }
  };

  const inputFields = [
    {
      name: "volume_mm3",
      label: "Volume (mm³)",
      placeholder: "ex: 15000",
      manualKey: "manual_volume",
    },
    {
      name: "surface_area_mm2",
      label: "Surface (mm²)",
      placeholder: "ex: 8500",
      manualKey: "manual_surface",
    },
    {
      name: "bounding_box_x",
      label: "Dimension X (mm)",
      placeholder: "ex: 50",
      manualKey: "manual_bbox_x",
    },
    {
      name: "bounding_box_y",
      label: "Dimension Y (mm)",
      placeholder: "ex: 40",
      manualKey: "manual_bbox_y",
    },
    {
      name: "bounding_box_z",
      label: "Dimension Z (mm)",
      placeholder: "ex: 80",
      manualKey: "manual_bbox_z",
    },
  ];

  return (
    <Card variant="glow" className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Paramètres du modèle 3D
        </CardTitle>
        <CardDescription>
          Chargez un fichier STL ou entrez manuellement les caractéristiques
          géométriques
        </CardDescription>
      </CardHeader>
                
      <CardContent>
        <form className="space-y-6">
          <StlUploadSection
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            onRemove={handleRemoveFile}
            scale={formData.scale}
            onScaleChange={handleChange}
            euler_number={formData.euler_number}
            use_euler_number={formData.use_euler_number}
            onEulerToggle={(checked) =>
              setFormData((prev) => ({ ...prev, use_euler_number: checked }))
            }
            onEulerChange={handleChange}
          />
          
      <StlPreview3D
        file={selectedFile}
        scale={Number(formData.scale) || 1}
      />

          <GeometryInputs
            formData={formData}
            onChange={handleChange}
            onToggleManual={handleToggleManual}
            inputFields={inputFields}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Button
  type="button"
  variant="outline"
  size="lg"
  className="w-full"
  disabled={isExtracting || isLoading}
  onClick={handleExtractStl}
>
  {isExtracting ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" /> Extraction STL...
    </>
  ) : (
    <>
      <FileBox className="w-5 h-5" /> Extraire les caractéristiques
    </>
  )}
</Button>

            <Button
              type="button"
              variant="glow"
              size="lg"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Prédiction ML...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" /> Estimer la consommation
                </>
              )}
            </Button>
          </div>
          <div className="mt-4">
            <AnomalyButton
              formData={formData}
              apiBase={API_BASE}
              disabled={isLoading}
              onError={(msg) => msg && setError(msg)}
              onSuccess={(msg) => msg && setSuccess(msg)}
            />
          </div>
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isLoading}
              onClick={handleCreatePiece}
            >
              Enregistrer la pièce
            </Button>
          </div>
          {(error || success) && (
            <div className="mt-4">
              {error && (
                <div className="text-destructive text-sm font-semibold">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-success text-sm font-semibold">
                  {success}
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
