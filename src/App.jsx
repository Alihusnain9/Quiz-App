import React, { useEffect, useRef, useState } from "react";
import FlashCardList from "./components/flashCardList";
import axios from "axios";
import "./App.css";

export default function App() {
  const [flashcard, setFlashcard] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api.php?amount=10").then((res) => {
      return setFlashcard(
        res.data.results.map((a, b) => {
          const answer = a.correct_answer;
          const option = [...a.incorrect_answers.map(x=>decodestring(x)), answer];
          return {
            id: crypto.randomUUID(),
            question: decodestring(a.question),
            answer: decodestring(answer),
            options: option.sort(() => Math.random() - 0.5),
          };
        })
      );
    });
  }, []);

  function decodestring(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setCategories(res.data.trivia_categories);
    });
  });

  function submitMe(e) {
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php?", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        return setFlashcard(
          res.data.results.map((a, b) => {
            const answer = a.correct_answer;
            const option = [
              ...a.incorrect_answers.map((x) => decodestring(x)),
              decodestring(answer),
            ];
            return {
              id: crypto.randomUUID(),
              question: decodestring(a.question),
              answer: answer,
              options: option.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }

  return (
    <>
      <div className="header">
        <form onSubmit={submitMe} className="form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" ref={categoryEl}>
              {categories &&
                categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form-group form-group2">
            <label htmlFor="number">No. Of Questions</label>
            <input
              defaultValue={10}
              type="number"
              id="number"
              placeholder="Type Any Number..."
              ref={amountEl}
              min={1}
            />
          </div>

          <button type="submit" className="btn">
            Generate
          </button>
        </form>
      </div>
      <div>
        <FlashCardList flashcard={flashcard} />
      </div>
    </>
  );
}
