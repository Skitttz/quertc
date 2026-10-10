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
    title: "Conversas e Grupos",
    description:
      "Converse em privado ou crie um grupo com várias pessoas. Junte sua galera e mantenha as conversas organizadas.",
    icon: <Users className={featuresStyles().icon()} />,
  },
  {
    title: "Mensagens Não Lidas",
    description:
      "Veja a última mensagem de cada conversa e saiba na hora quais você ainda não leu.",
    icon: <Bell className={featuresStyles().icon()} />,
  },
];
