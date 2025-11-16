import { Bell, MessageCircle, Users } from "lucide-react";
import { featuresStyles } from "./styles";

export const features = [
  {
    title: "Mensagens em Tempo Real",
    description:
      "Converse com qualquer pessoa instantaneamente. Envie e receba mensagens sem precisar atualizar a página.",
    icon: <MessageCircle className={featuresStyles().icon()} />,
  },
  {
    title: "Salas e Grupos",
    description:
      "Crie salas públicas ou privadas para diferentes assuntos. Junte sua galera e mantenha as conversas organizadas.",
    icon: <Users className={featuresStyles().icon()} />,
  },
  {
    title: "Notificações Inteligentes",
    description:
      "Receba alertas apenas quando alguém falar com você. Nada de barulho o tempo todo — só o que importa.",
    icon: <Bell className={featuresStyles().icon()} />,
  },
];
