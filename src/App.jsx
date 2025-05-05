import { useState } from 'react'
import { languages } from './languages'
import clsx from 'clsx';
import { getFarewellText } from './utils';
import { getRandomWord } from './utils';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';


function App() {

  //State values 
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const {width, height} = useWindowSize(); 

  //Derived values

  const numGuessesLeft = languages.length - 1; 
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
  
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft; 
  const isGameOver = isGameWon || isGameLost;  
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]; 
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  

  //Static values 
  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  const addGuessedLetter = (letter) => {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ? 
      prevLetters : 
      [...prevLetters, letter]);
  }

  const resetGame = () => {
    setCurrentWord(getRandomWord()); 
    setGuessedLetters([])
  }

  //Language Elements below
 
  const languagesElements = languages.map((language, index) => {

    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color
    }

    const clsxClass = clsx("chip", {
      lost: index < wrongGuessCount
    })
  
    return <span key={language.name} style={styles} className={clsxClass}>
              {language.name}
           </span>
  } 
  );

  //Letter elements below

  const letterElements = currentWord.split("").map((letter, index) => {
    const isCorrect = guessedLetters.includes(letter); 
    const missedLettersClass = clsx({
      missedLetters: isGameLost && !isCorrect 
    })

  return <span key={index} className={missedLettersClass}>
    {isCorrect ? letter.toUpperCase() : isGameLost ? letter.toUpperCase() : ""}
    </span>
})

//Keyboard elements below

  const keyboardElements = alphabet.split("").map(letter => {
    
    const hasBeenGuessed = guessedLetters.includes(letter); 
    const isCorrect = currentWord.includes(letter); 

    const keyBtnClass = clsx({
      right: hasBeenGuessed && isCorrect,
      wrong: hasBeenGuessed && !isCorrect
    })


    return <button 
    className={keyBtnClass} 
    key={letter} 
    disabled={isGameOver}
    aria-disabled={guessedLetters.includes(letter)}
    aria-label={`Letter ${letter}`}
    onClick={() => addGuessedLetter(letter)}
    >
      {letter.toUpperCase()}
    </button>

})

//Game status conditionally rendering 

const gameStatusClass = clsx("game-status", {
  win: isGameWon,
  lose: isGameLost,
  farewell: !isGameOver && isLastGuessIncorrect
})

const renderStatusText = () => {

  if (!isGameOver && isLastGuessIncorrect) {  
    return (
      <p>
      {getFarewellText(languages[wrongGuessCount - 1].name)}
      </p>
      )
  }

  if (isGameWon) {
    return <> 
    <h2>You win!</h2>
    <p>Well done!🎉</p>
    </>
  } 
  if (isGameLost){
    return <>
    <h2>Game over!</h2>
    <p>You lose! Better start learning Assembly 😭</p>
    </>
  }

}

//Rendering below finally xexe😂

  return (
   <main>
      {
        isGameWon && <ReactConfetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={1000}/>
      }
      <header>
        <h1>Assembly: EndGame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section 
      aria-live='polite' 
      role='status'
      className={gameStatusClass}>
        {renderStatusText()}
      </section>

      <section className='language-chips'>
        {languagesElements}
      </section>

      <section className='random-word'>
        {letterElements}
      </section>

       {/* Combined visually-hidden aria-live region for status updates */}
      <section 
      className="sr-only"
      aria-live='polite'
      role='status'>
        <p>
          {currentWord.includes(lastGuessedLetter) ?
          `Correct! The letter ${lastGuessedLetter} is in the word.` :
          `Sorry, the letter ${lastGuessedLetter} is not in the word`}
        </p>
        <p>Current word: {currentWord.split("").map(letter => guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}</p>
        You have {numGuessesLeft} attempts left. 
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>

      {isGameOver && <button onClick={resetGame} className='new-game-btn'>New Game</button>}
   </main> 
  )
}

export default App
