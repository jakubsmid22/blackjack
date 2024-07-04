const pot = document.getElementById("pot");
const tokens = document.querySelectorAll(".token");
const playerMoneyE = document.getElementById("playerMoney");
const potMoneyE = document.getElementById("potMoney");
const maxBetBtn = document.getElementById("maxBet");
const minBetBtn = document.getElementById("minBet");
const doubleBtn = document.getElementById("double");
const standBtn = document.getElementById("stand");
const hitPlayBtn = document.getElementById("hitPlay");
const playerCardsOnTable = document.getElementById("playerCardsOnTable");
const dealerCardsOnTable = document.getElementById("dealerCardsOnTable");
const playerScoreE = document.getElementById("playerScore");
const dealerScoreE = document.getElementById("dealerScore");
const tokensE = document.getElementById("tokens");
const scoreE = document.getElementById("score");
const messageE = document.getElementById("message");
const messageText = document.getElementById("text");
const restartBtn = document.getElementById("restart");
const tokensOnPot = [];

let playerCardsValue = 0;
let dealerCardsValue = 0;
let potMoney = 0;
let playerMoney = localStorage.getItem("playerMoney") || 2000;
let gameIsRunning = false;
let cardsCount = 0;
let currentHand = 1;
let hand = 1;
let upsideDownCardvalue = 0;
let playerHand1 = [];
let playerHand2 = [];
let playerHand1Value = 0;
let playerHand2Value = 0;
let activeHand = 1;

playerMoneyE.textContent = playerMoney;
potMoneyE.textContent = potMoney;
hitPlayBtn.disabled = false;

const hand1Container = document.createElement('div');
const hand2Container = document.createElement('div');

const checkScreenSize = () => {
  window.innerWidth <= 1600 && alert("For the best experience, play on a screen with a minimum width of 1600px.");
}

checkScreenSize();

const updateElements = () => {
  playerMoneyE.textContent = parseInt(playerMoney);
  potMoneyE.textContent = parseInt(potMoney);
  checkButtons();
};



const handleWrongInput = () => {
  alert("Zadej prosím platné číslo.");
  return 0;
};

const setPlayerMoney = () => {
  localStorage.setItem("playerMoney", playerMoney);
};

const noTokensAlert = () => {
  if (playerMoney === 0) {
    let input = prompt(
      "Nemáš dostatek tokenů! Zadej kolik tokenů chceš přidat"
    );
    if (input) {
      playerMoney = parseInt(input) || handleWrongInput();
      setPlayerMoney();
    }
  } else {
    alert("Nemáš dostatek tokenů!");
  }
  updateElements();
};

const noBetAlert = () => {
  alert("Musíš vsadit alespoň jeden token!");
};

const enableBtns = () => {
  doubleBtn.disabled = false;
  standBtn.disabled = false;
  hitPlayBtn.disabled = false;
};

const disableBetBtns = () => {
  minBetBtn.disabled = true;
  maxBetBtn.disabled = true;
  tokensOnPot.forEach((tokenToAppend) => {
    tokenToAppend.style.pointerEvents = "none";
  });
};

const controlBtnsUpdate = (button, text) => {
  button.disabled ? (button.textContent = "") : (button.textContent = text);
};

const hitPlayBtnUpdate = () => {
  gameIsRunning
    ? (hitPlayBtn.textContent = "TÁHNOUT")
    : (hitPlayBtn.textContent = "HRÁT");
};

controlBtnsUpdate(doubleBtn, "ZDVOJNÁSOBIT");
controlBtnsUpdate(standBtn, "STÁT");
hitPlayBtnUpdate();

const checkButtons = () => {
  minBetBtn.disabled = potMoney !== 0;
  maxBetBtn.disabled = potMoney === 200 || playerMoney === 0;
};

const makeRandomPlaceForToken = (token) => {
  const top = Math.floor(Math.random() * 20) + 1;
  const left = Math.floor(Math.random() * 20) + 1;
  token.style.top = top + "rem";
  token.style.left = left + "rem";
};

const appendTokenOnPot = (borderColor, number) => {
  if (number + potMoney <= 200) {
    playerMoney -= number;
    potMoney += number;
    const tokenToAppend = document.createElement("div");
    makeRandomPlaceForToken(tokenToAppend);
    tokenToAppend.classList.add("token", "tokenToAppend");
    tokenToAppend.classList.add(borderColor);
    tokenToAppend.textContent = number;
    tokensOnPot.push(tokenToAppend);
    pot.appendChild(tokenToAppend);

    tokenToAppend.addEventListener("click", () => {
      potMoney -= parseInt(tokenToAppend.textContent);
      playerMoney += parseInt(tokenToAppend.textContent);
      pot.removeChild(tokenToAppend);
      const index = tokensOnPot.indexOf(tokenToAppend);
      if (index > -1) {
        tokensOnPot.splice(index, 1);
      }
      updateElements();
    });
    updateElements();
  }
};

const checkBorderColor = (token) => {
  if (token.classList.contains("pink")) {
    return "pink";
  } else if (token.classList.contains("green")) {
    return "green";
  } else if (token.classList.contains("blue")) {
    return "blue";
  } else if (token.classList.contains("red")) {
    return "red";
  } else {
    return "black";
  }
};

tokens.forEach((token) => {
  token.addEventListener("click", () => {
    const borderColor = checkBorderColor(token);
    const number = token.textContent;
    playerMoney >= parseInt(number)
      ? appendTokenOnPot(borderColor, parseInt(number))
      : noTokensAlert();
  });
});

const addMaxTokens = (money) => {
  while (potMoney < money) {
    if (potMoney + 100 <= money && playerMoney >= 100) {
      appendTokenOnPot("red", 100);
    } else if (potMoney + 25 <= money && playerMoney >= 25) {
      appendTokenOnPot("blue", 25);
    } else if (potMoney + 10 <= money && playerMoney >= 10) {
      appendTokenOnPot("black", 10);
    } else if (potMoney + 5 <= money && playerMoney >= 5) {
      appendTokenOnPot("green", 5);
    } else if (potMoney + 1 <= money && playerMoney >= 1) {
      appendTokenOnPot("pink", 1);
    } else {
      break;
    }
  }
};

maxBetBtn.addEventListener("click", () => {
  if (playerMoney > 200) {
    addMaxTokens(200);
    updateElements();
  } else {
    addMaxTokens(playerMoney);
  }
});

minBetBtn.addEventListener("click", () => {
  potMoney < 200 && playerMoney >= 1
    ? appendTokenOnPot("pink", 1)
    : noTokensAlert();
  updateElements();
});

const updateNumberClasses = (number, colorClass) => {
  number.className = "";
  number.classList.add(colorClass, "number");
};

const colorRandomIndex = Math.floor(Math.random() * cardsArray.length);
const cardsRandomIndex = Math.floor(Math.random() * cardsArray[0].cards.length);

const addCardValue = (value, player, isUpsideDown) => {
    if (value === "A") {
      if (player === "player") {
        playerCardsValue + 10 <= 21
          ? (playerCardsValue += 10)
          : playerCardsValue++;
      } else {
        if (isUpsideDown) {
          upsideDownCardvalue = 10;
        } else {
          dealerCardsValue + 10 <= 21
            ? (dealerCardsValue += 10)
            : dealerCardsValue++;
        }
      }
    }
    else if (value === "J" || value === "Q" || value === "K") {
      player === "player" ? playerCardsValue += 10 : dealerCardsValue += 10;
    }
    else {
      if (player === "player") {
        playerCardsValue += value;
      } else {
        if (isUpsideDown) {
          upsideDownCardvalue = value;
        } else {
          dealerCardsValue += value;
        }
      }
    }
};



const apendCard = (player, repeat, isUpsideDown) => {
  disableControlsButtons();
  return new Promise((resolve) => {
    for (let index = 0; index < repeat; index++) {
      let colorRandomIndex;
      do {
        colorRandomIndex = Math.floor(Math.random() * cardsArray.length);
      } while (cardsArray[colorRandomIndex].cards.length === 0);

      const cardsRandomIndex = Math.floor(
        Math.random() * cardsArray[colorRandomIndex].cards.length
      );

      const cardData = cardsArray[colorRandomIndex].cards[cardsRandomIndex];

      const template = cardData.template;

      const cardNums = template.querySelectorAll("[data-card-num]");
      const cardSymbolsSmall = template.querySelectorAll("[data-symbol-small]");
      const cardSymbolBig = template.querySelectorAll("[data-symbol-big]");
      const cardDiv = template.querySelector(".card");

      cardSymbolsSmall.forEach((symbol) => {
        symbol.src = cardData.symbol;
      });
      cardSymbolBig.forEach((symbol) => {
        symbol.src = cardData.symbol;
      });
      cardNums.forEach((number) => {
        number.textContent = cardData.number;
        updateNumberClasses(number, cardsArray[colorRandomIndex].color);
      });

      if (isUpsideDown) {
        cardDiv.classList.add("cardupsideDown");
      } else {
        cardDiv.classList.remove("cardupsideDown");
      }

      const card = template.cloneNode(true);

      if (player === "player") {
        playerCardsOnTable.append(card);
        addCardValue(cardData.number, "player", false);
      } else {
        dealerCardsOnTable.append(card);
        addCardValue(cardData.number, "dealer", isUpsideDown);
      }

      cardsOnTable[colorRandomIndex].cards.push(
        cardsArray[colorRandomIndex].cards[cardsRandomIndex]
      );

      cardsArray[colorRandomIndex].cards.splice(cardsRandomIndex, 1);

      cardsCount = 0;
      cardsArray.forEach((cardArray) => (cardsCount += cardArray.cards.length));

      updateScore();
    }
    setTimeout(() => {
      resolve();
    }, 500); 
  });
};



const swapTokensAndScore = () => {
  if (gameIsRunning) {
    tokensE.classList.add("remove");
    scoreE.classList.remove("remove");
  } else {
    scoreE.classList.add("remove");
    tokensE.classList.remove("remove");
  }
};

const updateScore = () => {
  playerScoreE.textContent = playerCardsValue;
  dealerScoreE.textContent = dealerCardsValue;
};

const offerInsurance = () => {
  if (dealerCardsOnTable.children[0].querySelector('.number').textContent === 'A') {
    const insuranceBet = Math.ceil(potMoney / 2);
    const insurance = confirm(`Dealer má eso. Chceš pojištění? (${insuranceBet}$)`);
    if (insurance) {
      playerMoney -= insuranceBet;
      if (dealerCardsValue + upsideDownCardvalue === 21) {
        playerMoney += insuranceBet * 3;
        updateElements();
        dealerBlackJackMessage();
      } else {
        alert("Dealer nemá Blackjack, pojištění prohrálo.");
        updateElements();
      }
    }
  }
};

const startGame = async () => {
  gameIsRunning = true;
  hitPlayBtnUpdate();
  enableBtns();
  controlBtnsUpdate(doubleBtn, "ZDVOJNÁSOBIT");
  controlBtnsUpdate(standBtn, "STÁT");
  disableBetBtns();

  await apendCard("player", 2, false);
  await apendCard("dealer", 1, false);
  await apendCard("dealer", 1, true);

  enableBtns();

  setTimeout(() => {
    offerInsurance();
  }, 500);
};
  


const revealUpsideDownCard = () => {
  dealerCardsOnTable.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("cardupsideDown");
  });
  dealerCardsValue += upsideDownCardvalue;
};  

const clearPot = () => {
  pot.querySelectorAll(".token").forEach((token) => {
    pot.removeChild(token);
  });
};

const disableControlsButtons = () => {
  hitPlayBtn.disabled = true;
  doubleBtn.disabled = true;
  standBtn.disabled = true;
};

const handleWinMoney = () => {
  playerMoney += potMoney * 2;
};

const showMessage = (messageClass) => {
  clearPot();
  messageE.classList.add("show");
  messageText.className = "";
  messageText.classList.add(messageClass, "text");
};

const drawMessage = () => {
  showMessage("draw");
  playerMoney += potMoney;
  messageText.textContent = `REMÍZA získáváš ${potMoney}$`;
  disableControlsButtons();
};

const lossMessage = (message) => {
  showMessage("loss");
  messageText.textContent = message;
  disableControlsButtons();
  gameIsRunning = false;
};

const winMessage = () => {
  showMessage("win");
  handleWinMoney();
  messageText.textContent = `VÝHRA ZÍSKÁVÁŠ ${potMoney * 2}$`;
  disableControlsButtons();
};

const blackjackMessage = () => {
  showMessage("blackjack");
  handleWinMoney();
  messageText.textContent = `BLACKJACK! získáváš ${potMoney * 2}$`;
  disableControlsButtons();
  gameIsRunning = false;
};

const dealerBlackJackMessage = () => {
  showMessage("loss");
  messageText.textContent = `DEALER MÁ BLACKJACK! PROHRÁVÁŠ`;
  disableControlsButtons();
};

const restartGame = () => {
  doubleBtn.disabled = true;
  standBtn.disabled = true;
  minBetBtn.disabled = false;
  maxBetBtn.disabled = false;
  hitPlayBtn.disabled = false;
  controlBtnsUpdate(doubleBtn, "ZDVOJNÁSOBIT");
  controlBtnsUpdate(standBtn, "STÁT");
  hitPlayBtnUpdate();

  messageE.classList.remove("show");

  playerCardsOnTable.innerHTML = "";
  dealerCardsOnTable.innerHTML = "";

  cardsOnTable.forEach((colorGroup) => {
    colorGroup.cards.forEach((card) => {
      const colorIndex = cardsArray.findIndex(
        (cg) => cg.color === colorGroup.color
      );
      if (colorIndex !== -1) {
        cardsArray[colorIndex].cards.push(card);
      }
    });
  });
  cardsOnTable.forEach((colorGroup) => {
    colorGroup.cards.length = 0;
  });

  playerCardsValue = 0;
  dealerCardsValue = 0;
  potMoney = 0;
  gameIsRunning = false;
  upsideDownCardvalue = 0;

  hitPlayBtnUpdate();
  swapTokensAndScore();
  playerScoreE.textContent = 0;
  dealerScoreE.textContent = 0;
  playerMoneyE.textContent = playerMoney;
  potMoneyE.textContent = 0;
};

restartBtn.addEventListener("click", () => {
  restartGame();
});

const checkPlayerMove = () => {
    if (playerCardsValue === 21) {
      revealUpsideDownCard();
      dealerCardsValue === 21 ? drawMessage() : blackjackMessage();
    } else if (playerCardsValue > 21) {
      lossMessage("PŘETÁHNUL JSI DEALER VYHRÁVÁ");
    }
};

const hit = async () => {
  doubleBtn.disabled = true;
  await apendCard("player", 1, false);
  enableBtns();

  checkPlayerMove();

  updateScore();
  setPlayerMoney();
};

hitPlayBtn.addEventListener("click", () => {
  if (potMoney > 0) {
    gameIsRunning ? hit() : startGame();
    swapTokensAndScore();
    updateScore();
  } else {
    noBetAlert();
  }
});

const dealerPlay = () => {
  if (dealerCardsValue < 17) {
    setTimeout(() => {
      apendCard("dealer", 1, false);
      updateScore();
      dealerPlay();
      disableControlsButtons();
    }, 1000);
  } else {
    if (dealerCardsValue === 21) {
      dealerBlackJackMessage();
    } else if (dealerCardsValue > 21 || dealerCardsValue < playerCardsValue) {
      winMessage();
    } else if (dealerCardsValue < 21 && dealerCardsValue > playerCardsValue) {
      lossMessage("DEALER VYHRÁVÁ");
    } else {
      drawMessage();
    }
    disableControlsButtons();
  }
};

const stand = () => {
    revealUpsideDownCard();
    updateScore();
    dealerPlay();
};

standBtn.addEventListener("click", stand);

doubleBtn.addEventListener("click", () => {
  disableControlsButtons();
  playerMoney -= potMoney;
  potMoney += potMoney;
  updateElements();
  document.querySelectorAll(".tokenToAppend").forEach((token) => {
    const clone = token.cloneNode(true);
    makeRandomPlaceForToken(clone);
    pot.append(clone);
  });
  apendCard("player", 1, false);
  updateScore();
  checkPlayerMove();
  if (gameIsRunning) {
    revealUpsideDownCard();
    dealerPlay();
  }
  setPlayerMoney();
});
