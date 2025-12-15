import { Droplets, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono text-sm text-muted-foreground text-center block">
              ResinPredict © 2025 — Ebru Sahin
            </span>
          </div>
          
       
        </div>
      </div>
    </footer>
  );
};

export default Footer;
