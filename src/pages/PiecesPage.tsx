import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClusterBrowser from "../components/ClusterBrowser";

function PiecesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-36 pb-20"> 
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
                <span className="text-gradient">          Profils géométriques des pièces</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Analysez la répartition des types de pièces détectés par le
                clustering.
              </p>
            </div>
            <ClusterBrowser />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PiecesPage;