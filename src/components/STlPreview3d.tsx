
import { useEffect, useState } from "react";
import { StlViewer } from "react-stl-viewer";

interface StlPreview3DProps {
  file: File | null;
  scale?: number;
}

const StlPreview3D = ({ file, scale = 1 }: StlPreview3DProps) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) {
    return (
      <div className="text-sm text-muted-foreground">
        Aucune prévisualisation disponible.
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md p-2 bg-muted">
      <div className="h-72">
        <StlViewer
          url={url}
          style={{ width: "100%", height: "100%" }}
          orbitControls
          shadows
          showAxes
          modelProps={{ scale }}
        />
      </div>
    </div>
  );
};

export default StlPreview3D;
