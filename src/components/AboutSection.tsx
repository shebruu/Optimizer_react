import { Card, CardContent } from "@/components/ui/card";
import { Brain, Database, Gauge, Users } from "lucide-react";

const features = [
	{
		icon: Brain,
		title: "IA",
		description:
			"Utilisation de modèle prédictif pour lier la géométrie des pièces aux besoins en matière",
	},
	{
		icon: Gauge,
		title: "Performance optimale",
		description:
			"Estimation rapide de la consommation de résine, en quelques secondes seulement",
	},
	{
		icon: Database,
		title: "Analyse des Données",
		description:
			"Suivi historique des estimations pour une analyse de performance et un retour d'expérience continu",
	},
	{
		icon: Users,
		title: "Utilisation",
		description:
			"Outil conçu pour l'aide à la décision et l'optimisation des ressources",
	},
];

const AboutSection = () => {
	return (
		<section id="about" className="py-20 bg-secondary/20">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
						<span className="text-gradient">Pourquoi ResinPredict ?</span>
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Une solution pour optimiser vos impressions 3D résine et
						maîtriser vos coûts
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<Card
							key={index}
							variant="glass"
							className="text-center hover:border-primary/50 transition-all duration-300"
						>
							<CardContent className="pt-8 pb-6 flex flex-col items-center">
								<div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
									<feature.icon className="w-10 h-10 text-primary" />
								</div>
								<h3 className="font-mono font-semibold mb-3 text-lg">
									{feature.title}
								</h3>
								<p className="text-base text-muted-foreground text-center leading-snug max-w-xs">
									{feature.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
