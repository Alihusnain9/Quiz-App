import React from 'react'
import FlashCard from './flashcard'
import "../App.css";

export default function flashCardList({flashcard}) {
  return (
    <div className='card-grid'>
      {flashcard.map(flashcar=>{
        return <FlashCard flashcard={flashcar} key={flashcar.id}/>
      })}
    </div>
  )
}
