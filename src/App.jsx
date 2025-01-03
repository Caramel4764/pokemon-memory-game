import { useEffect, useState } from 'react'
import Card from "./components/Card"
import pokeball from "./assets/pokeball.png"
import { VscDebugRestart } from "react-icons/vsc";

function App() {
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  //max card is 151 because 151 pokemons
  const [maxCard, setMaxCard] = useState(151);
  const [cardList, setCardList] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAllCardLoaded, setIsAllCardLoaded] = useState(false);
  const pokeAPI = "https://pokeapi.co/api/v2/pokemon/";
  function restart() {
    if (score > highScore) {
      setHighScore(score);
    }
    setIsGameOver(false);
    setScore(0);
    shuffleCard();
    cardList.forEach((card)=>(card.hasClicked=false));
  }
  function shuffleCard () {
    let newIndexList = [];
    let newCardList = [];
    for (let i = 0; i < cardList.length; i++) {
      let ranNum = Math.floor(Math.random()*cardList.length);
      while(checkDupId(newIndexList, ranNum)) {
        ranNum = Math.floor(Math.random()*cardList.length);
      }
      newIndexList.push(ranNum);
    }
    for (let i = 0; i < newIndexList.length; i++) {
      newCardList.push(cardList[newIndexList[i]]);
    }
    setCardList(newCardList);
  }
  function selectCard (card) {
    if (card.hasClicked && isGameOver == false) {
      setIsGameOver(true);
      alert(`Game Over! You've collected ${score} pokemons`);
    } else if (!card.hasClicked && isGameOver == false) {
      card.hasClicked = true;
      setScore(score+1);
      //reenable this later
      shuffleCard();
    }
  }
  function checkDupId(list, id) {
    for (let j = 0; j < list.length; j++) {
      if (list[j] == id) {
        return true;
      }
    }
    return false;
  }
  function addPokeCard(pokeIdList) {
    let ranNum = Math.floor(Math.random()*151+1);
    while (checkDupId(pokeIdList, ranNum)) {
      ranNum = Math.floor(Math.random()*151+1);
    }
    pokeIdList.push(ranNum);
  }
  async function getPokeCard(pokeIdList, newCards) {
    for (let i = 0; i<pokeIdList.length; i++) {
    let pokeData = await fetch(pokeAPI+pokeIdList[i])
      .then(response => response.json())
      .then(data => {
        let newCard = {
          cardId: i,
          hasClicked: false,
          name: data.name.slice(0,1).toUpperCase()+data.name.slice(1, data.name.length),
          src: data.sprites.front_default,
          type: data.types, //type.name for type
        }
        newCards.push(newCard);
      })
      .then(()=>{
        if (newCards.length==pokeIdList.length) {
          setCardList(newCards);
          setIsAllCardLoaded(true);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  }
  useEffect(()=>{
    let newCards = [];
    let pokeIdList = [];
    for (let i = 0; i<maxCard;i++) {
      addPokeCard(pokeIdList);
    } 
    getPokeCard(pokeIdList, newCards);
  }, [])
  return (
    <>
      <div className="headerDiv">
        <div className="title">
          <img className={"icon"} src={pokeball}></img>
          <h1>Pokemon Memory Game</h1>
        </div>
        {isGameOver&&<div className="gameOverDiv">
            <button className="restart" onClick={restart}><VscDebugRestart></VscDebugRestart>Restart</button>
        </div>}
        <div className="score">
          <p>Score: {score}/{maxCard} ({(score/maxCard*100).toFixed(2)}%)</p>
          <p>Highscore: {highScore}/{maxCard} ({(highScore/maxCard*100).toFixed(2)}%)</p>
        </div>
      </div>
      <div className="cardDiv">{
        isAllCardLoaded ? cardList.map((card, index)=>(
          <Card key={card.name} className={`test ${isGameOver&&card.hasClicked?"gameOverCard": "card"}`} isGameOver={isGameOver} onClick={selectCard} card={card}></Card>
        )):
          <p>Gathering all gen 1 pokemons, please wait...</p>
      }</div>
    </>
  )
}

export default App
