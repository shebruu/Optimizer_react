import { Box, Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-sans font-bold text-gradient" style={{ fontFamily: 'Inter, sans-serif' }}>ResinPredict</h1>

          </div>
        </div>
        <nav className="flex items-center gap-10 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Link to="/" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">
    Accueil
  </Link>
          <a href="#calculator" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">
            Calculateur
          </a>
          <a href="#history" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">
            Historique
          </a>
          <a href="#about" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">
            À propos
          </a>

  <Link to="/clusters" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">
    Pièces 
  </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
