import React, { useState, useEffect, useRef } from "react";
import "../App.css";
export default function flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");
  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(setMaxHeight, [
    flashcard.question,
    flashcard.answer,
    flashcard.options,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => {
      window.removeEventListener("resize", setMaxHeight);
    };
  });
  return (
    <div
      style={{ padding: ".5rem", backgroundColor: "white" }}
      onClick={() => setFlip(!flip)}
      className={`card-sec ${flip ? "flip" : ""}`}
    >
      <div className="card" style={{ height: height }}>
        <div className="front" ref={frontEl}>
          {flashcard.question}
          <div className="options">
            {flashcard.options.map((option) => {
              return <div className="option" key={option}>{option}</div>;
            })}
          </div>
        </div>
        <div className="back" ref={backEl}>
          {flashcard.answer}
        </div>
      </div>
    </div>
  );
}
