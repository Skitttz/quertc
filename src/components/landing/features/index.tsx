import { Card, CardContent } from "@/components/ui/card";
import { LANDING_IDS } from "../constants";
import { features } from "./constants";
import { featuresStyles } from "./styles";

export function Features() {
  const { container, card, content, iconWrapper, title, description } =
    featuresStyles();
  return (
    <section className={"px-0 md:px-6 py-6 lg:py-12 max-w-7xl mx-auto"}>
      <div className="max-w-3xl mb-6 space-y-2" id={LANDING_IDS.FEATURES}>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Da ideia à prática
        </h2>
        <p className="text-muted-foreground">
          Se nossa missão é deixar a conversa brilhar, estes são os recursos que
          tornam a experiência leve, familiar e confiável.
        </p>
      </div>
      <div className={container()}>
        {features.map((feature) => (
          <Card key={feature.title} className={card()}>
            <CardContent className={content()}>
              <div className={iconWrapper()}>{feature.icon}</div>

              <h3 className={title()}>{feature.title}</h3>

              <p className={description()}>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
