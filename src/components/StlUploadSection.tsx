import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileBox, X } from "lucide-react";
import React from "react";

interface StlUploadSectionProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  scale: string;
  onScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  euler_number: string;
  use_euler_number: boolean;
  onEulerToggle: (checked: boolean) => void;
  onEulerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StlUploadSection: React.FC<StlUploadSectionProps> = ({
  selectedFile,
  onFileChange,
  onRemove,
  scale,
  onScaleChange,
  euler_number,
  use_euler_number,
  onEulerToggle,
  onEulerChange,
}) => {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-card/50 space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <FileBox className="w-4 h-4 text-primary" />
        Fichier STL
      </h3>
      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <input
            type="file"
            accept=".stl"
            onChange={onFileChange}
            className="hidden"
            id="stl-upload"
          />
          {!selectedFile ? (
            <label
              htmlFor="stl-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Cliquez pour charger un fichier STL
              </span>
              <span className="text-xs text-muted-foreground/70 mt-1">
                Les données géométriques seront extraites automatiquement
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <FileBox className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {/* Scale and Euler Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scale" className="text-sm text-muted-foreground">
              Échelle
            </Label>
            <Input
              id="scale"
              name="scale"
              type="number"
              step="any"
              min="0.01"
              placeholder="ex: 1"
              value={scale}
              onChange={onScaleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="euler_number" className="text-sm text-muted-foreground">
                Nombre d'Euler
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use_euler"
                  checked={use_euler_number}
                  onCheckedChange={(checked) => onEulerToggle(checked === true)}
                />
                <Label htmlFor="use_euler" className="text-xs text-muted-foreground cursor-pointer">
                  Utiliser
                </Label>
              </div>
            </div>
            <Input
              id="euler_number"
              name="euler_number"
              type="number"
              step="1"
              placeholder="ex: 2"
              value={euler_number}
              onChange={onEulerChange}
              disabled={!use_euler_number}
              className={!use_euler_number ? "opacity-50" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StlUploadSection;
