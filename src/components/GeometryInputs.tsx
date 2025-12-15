import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface GeometryInputsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleManual: (fieldKey: string, checked: boolean) => void;
  inputFields: Array<{
    name: string;
    label: string;
    placeholder: string;
    manualKey: string;
  }>;
}

const GeometryInputs: React.FC<GeometryInputsProps> = ({
  formData,
  onChange,
  onToggleManual,
  inputFields,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Paramètres géométriques 
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                {field.label}
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`manual-${field.name}`}
                  checked={formData[field.manualKey] as boolean}
                  onCheckedChange={(checked) =>
                    onToggleManual(field.manualKey, checked === true)
                  }
                />
                <Label htmlFor={`manual-${field.name}`} className="text-xs text-muted-foreground cursor-pointer">
                  Saisie manuelle
                </Label>
              </div>
            </div>
<Input
  id={field.name}
  name={field.name}
  type="number"
  step="any"
  placeholder={field.placeholder}
  value={formData[field.name] as string}
  onChange={onChange}
  required
  disabled={!formData[field.manualKey as string]}
  className={!formData[field.manualKey as string] ? "opacity-50" : ""}
/>

          </div>
        ))}
      </div>
    </div>
  );
};

export default GeometryInputs;
