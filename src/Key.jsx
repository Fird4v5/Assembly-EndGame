import clsx from "clsx";

const Key = ({ letter, guessedLetters, currentWord, addGuessedLetters}) => {

    const hasBeenGuessed = guessedLetters.includes(letter); 
    const isCorrect = currentWord.includes(letter); 

    const keyButtonClass = clsx("key", {
        right: hasBeenGuessed && isCorrect,
        wrong: hasBeenGuessed && !isCorrect
    })

  return (
    <button className={keyButtonClass} onClick={addGuessedLetters}>
        {letter.toUpperCase()}
    </button>
  )
}

export default Key; 