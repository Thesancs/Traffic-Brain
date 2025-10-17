
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Facebook } from "lucide-react";

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z"/>
    </svg>
  );

const integrationPlatforms = [
    {
        name: "Meta Ads (Facebook)",
        description: "Sincronize suas campanhas, conjuntos de anúncios e métricas do Facebook e Instagram.",
        icon: <Facebook className="w-8 h-8 text-blue-600" />,
        status: "Conectar",
    },
    {
        name: "Google Ads & Analytics",
        description: "Importe dados de performance do Google Ads e insights do Google Analytics.",
        icon: <Chrome className="w-8 h-8 text-red-500" />,
        status: "Conectar",
    },
    {
        name: "Tiktok Ads",
        description: "Analise o desempenho dos seus anúncios e campanhas no TikTok.",
        icon: <TikTokIcon />,
        status: "Conectar",
    }
]

export default function IntegrationsPage() {
  return (
    <div className="text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Integrações</h1>
          <p className="text-muted-foreground">Conecte suas contas de anúncios para centralizar seus dados.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {integrationPlatforms.map(platform => (
             <Card key={platform.name} className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-2 rounded-lg bg-background">
                     {platform.icon}
                    </div>
                    <div>
                        <CardTitle className="font-headline text-lg">{platform.name}</CardTitle>
                        <CardDescription>{platform.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">
                        {platform.status}
                    </Button>
                </CardContent>
             </Card>
        ))}
      </div>
    </div>
  );
}
