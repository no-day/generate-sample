import React from "react";
import Sketch from "react-p5";
import p5 from "p5";
import { Gen, generate, mkSeed } from "@no-day/fp-ts-generators";
import * as G from "@no-day/fp-ts-generators";

interface ComponentProps {
  seed: number;
}

type Vec3 = [number, number, number];

type Stripe = {
  y: number;
  color: Vec3;
};

type Model = {
  stripes: Stripe[];
};

const genStripe: Gen<Stripe> = G.recordOf({
  y: G.float({ min: 0, max: 1 }),
  color: G.vectorOf(3)(G.float({ min: 0, max: 255 })) as Gen<Vec3>,
});

const genModel: Gen<Model> = G.recordOf({
  stripes: G.arrayOf(genStripe),
});

export const YourComponent: React.FC<ComponentProps> = (
  props: ComponentProps
) => {
  const seed = mkSeed(props.seed);
  const model = generate({ seed })(genModel);

  console.log(model);

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const drawStripe =
    (p5: p5) =>
    ({ y, color }: Stripe) => {
      p5.stroke(color[0], color[1], color[2]);
      p5.line(0, y * p5.height, p5.width, y * p5.height);
    };

  const draw = (p5: p5) => {
    p5.background(200);
    model.stripes.forEach(drawStripe(p5));
  };

  return <Sketch setup={setup} draw={draw} />;
};
