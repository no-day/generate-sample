import React, { useState } from "react";
import { YourComponent } from "./Sketch";
import * as G from "@no-day/fp-ts-generators";

function App() {
  const [seed, setSeed] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seed = parseInt(e.target.value);
    setSeed(seed);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const seed = Math.round(Math.random() * G.seedMax);
    setSeed(seed);
  };

  return (
    <div>
      Seed: <input type="text" onChange={handleChange} value={seed} />
      <button onClick={handleClick}>Random Seed!</button>
      <YourComponent seed={seed} />
    </div>
  );
}

export default App;
