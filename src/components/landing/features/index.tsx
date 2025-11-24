import { Card, CardContent } from "@/components/ui/card";
import { LANDING_IDS } from "../constants";
import { features } from "./constants";
import { featuresStyles } from "./styles";

export function Features() {
  const { container, card, content, iconWrapper, title, description } =
    featuresStyles();
  return (
    <section
      className={"px-6 py-8 max-w-7xl mx-auto"}
      id={LANDING_IDS.FEATURES}
    >
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
