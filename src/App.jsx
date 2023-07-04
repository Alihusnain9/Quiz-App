import { useState, useEffect, useRef } from "react";
import "./App.css";
import FlashCardList from "./components/flashCardList";
import axios from "axios";

export default function App() {
  const [flashcard, setFlashCard] = useState([]);
  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  // axios.get("https://opentdb.com/api.php?amount=10").then((res) => {
  //   setFlashCard(
  //     res.data.results.map((questionItem, index) => {
  //       const answer = questionItem.correct_answer;
  //       const option = [...questionItem.incorrect_answers, answer];
  //       return {
  //         id: index - Date.now(),
  //         question: decode(questionItem.question),
  //         answer: answer,
  //         options: option.sort(() => Math.random() - 0.5),
  //       };
  //     })
  //   );
  // });
  // }, []);

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      console.log(res.data.trivia_categories);
      setCategories(res.data.trivia_categories);
    });
  }, []);

  const categoryEl = useRef();
  const amountEl = useRef();

  function decode(str) {
    let textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }

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
        setFlashCard(
          res.data.results.map((questionItem, index) => {
            const answer = questionItem.correct_answer;
            const option = [...questionItem.incorrect_answers, answer];
            return {
              id: index - Date.now(),
              question: decode(questionItem.question),
              answer: answer,
              options: option.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }
  return (
    <>
      <form onSubmit={submitMe} className="header">
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
        <br />

        <div className="row">
          <div className="form-group">
            <label htmlFor="number">Number Of Questions</label>
            <input
              type="number"
              id="number"
              placeholder="Type a number..."
              ref={amountEl}
            />
          </div>
          <div className="">
            <button className="btn">Generate</button>
          </div>
        </div>
      </form>
      <div className="container">
        <FlashCardList flashcard={flashcard} />
      </div>
    </>
  );
}
