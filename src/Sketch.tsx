import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import p5 from "p5";
import { Gen, generate, mkSeed } from "@no-day/fp-ts-generators";
import * as G from "@no-day/fp-ts-generators";
import { pipe } from "fp-ts/lib/function";
import { Slider } from "primereact/slider";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import * as A from "fp-ts/Array";

interface ComponentProps {
  seed: number;
}

type Vec2 = [number, number];

type Vec3 = [number, number, number];

type Stripe = {
  y: number;
  color: Vec3;
};

type Dot = {
  pos: Vec2;
};

type Model = {
  stripes: Stripe[];
  dots: Dot[];
};

const genDot: Gen<Dot> = G.recordOf({
  pos: G.vectorOf(3)(G.float({ min: 0, max: 1 })) as Gen<Vec2>,
});

const genStripe: Gen<Stripe> = G.recordOf({
  y: G.float({ min: 0, max: 1 }),
  color: G.vectorOf(3)(G.float({ min: 0, max: 255 })) as Gen<Vec3>,
});

const genModel: Gen<Model> = G.recordOf({
  stripes: G.arrayOf(genStripe),
  dots: G.vectorOf(30)(genDot),
});

export const YourComponent: React.FC<ComponentProps> = (
  props: ComponentProps
) => {
  const [pct, setPct] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    requestAnimationFrame(setTime);
  }, [time]);

  const seed = mkSeed(props.seed);
  const model = generate({ seed })(genModel);

  console.log(model, pct);

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const drawDot = (p5: p5) => (dot: Dot) => {
    p5.stroke(255, 255, 255);
    p5.fill(255, 255, 255);
    p5.circle(dot.pos[0] * p5.width, dot.pos[1] * p5.height, 10);
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

    pipe(model.dots, A.takeLeft(pct), (dots) => dots.forEach(drawDot(p5)));
  };

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div style={{ width: "200px", marginTop: "20px" }}>
        <pre>{time}</pre>
        <Slider
          min={0}
          max={30}
          value={pct}
          onChange={(e) => setPct(e.value as number)}
        />
      </div>
    </div>
  );
};
