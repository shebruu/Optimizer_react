import { useEffect, useState } from "react";
import { CLUSTER_OPTIONS } from "./constants/clusters.js";

function ClusterBrowser() {
  const [selectedCluster, setSelectedCluster] = useState("");
  const [appliedCluster, setAppliedCluster] = useState("");
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
const loadPieces = async (clusterValue: string, page = 0) => {
  setLoading(true);
  try {
    const params = new URLSearchParams();

    if (clusterValue !== "") {
      params.append("cluster", clusterValue);
    }

    // pagination simple : 50 pièces par page
    params.append("limit", "50");
    params.append("offset", String(page * 50));

    const url = `http://localhost:3000/api/pieces?${params.toString()}`;

    const res = await fetch(url);
    const text = await res.text();
    console.log("RAW /api/pieces response:", text);

    if (!res.ok) {
      console.error("Réponse non OK :", res.status);
      setPieces([]);
      return;
    }

    const data = JSON.parse(text);
    console.log("Parsed JSON /api/pieces:", data);

    // backend renvoie { data: [...] }
    setPieces(Array.isArray(data.data) ? data.data : []);
  } catch (e) {
    console.error("Erreur chargement pièces", e);
    setPieces([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPieces("");
  }, []);

  const handleChange = (e) => {
    setSelectedCluster(e.target.value);
  };

  const handleApply = () => {
    setAppliedCluster(selectedCluster);
    loadPieces(selectedCluster);
  };

  return (
    <div className="bg-card/60 rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

        <label className="flex items-center gap-3 text-base font-medium">
          <span>Type de pièces :</span>
          <select
            value={selectedCluster}
            onChange={handleChange}
            className="border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les types</option>
            {CLUSTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            className="ml-2 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 transition"
            onClick={handleApply}
            type="button"
          >
            Appliquer
          </button>
        </label>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground animate-pulse">
          Chargement...
        </div>
      )}

      {!loading && pieces.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucune pièce pour ce type.
        </div>
      )}

      {!loading && pieces.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background rounded-lg shadow border">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-4 py-2 text-left">Volume</th>
                <th className="px-4 py-2 text-left">Surface</th>
                <th className="px-4 py-2 text-left">Dimensions (X×Y×Z)</th>
                <th className="px-4 py-2 text-left">Masse</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p) => (
                <tr
                  key={p.id}
                  className="even:bg-muted/30 hover:bg-accent/30 transition-colors"
                >
                  <td className="px-4 py-2">{p.volume?.toFixed?.(1)}</td>
                  <td className="px-4 py-2">{p.surface_area?.toFixed?.(1)}</td>
                  <td className="px-4 py-2">
                    {p.bbox_x?.toFixed?.(1)} × {p.bbox_y?.toFixed?.(1)} ×{" "}
                    {p.bbox_z?.toFixed?.(1)}
                  </td>
                  <td className="px-4 py-2">{p.mass?.toFixed?.(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClusterBrowser;
