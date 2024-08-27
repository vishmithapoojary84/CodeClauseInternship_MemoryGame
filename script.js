document.addEventListener('DOMContentLoaded', () => {
  const cardsArray = [
      { 'name': 'strawberry', 'img': 'images/strawberry.png' },
      { 'name': 'apple', 'img': 'images/apple.png' },
      { 'name': 'mango', 'img': 'images/mango.png' },
      { 'name': 'orange', 'img': 'images/orange.png' },
      { 'name': 'grapes', 'img': 'images/grapes.png' },
      { 'name': 'dragonfruit', 'img': 'images/dragonfruit.png' }
  ];

  const parentDiv = document.querySelector("#card-section");
  const timerElement = document.getElementById("timer");
  const movesElement = document.getElementById("moves");
  const scoreElement = document.getElementById("score");

  // Duplicate and shuffle cards
  const gameCard = cardsArray.concat(cardsArray);
  const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  };
  const shuffleNumber = shuffleArray(gameCard);

  // Track selected cards
  let clickCount = 0;
  let firstCard = null;
  let secondCard = null;
  const selectedCards = [];
  let countdown = 120; // Countdown in seconds (2:00)
  let countdownInterval;
  let moves = 0; // Move counter
  let score = 0; // Starting score

  // Function to update the display for moves and score
  const updateDisplay = () => {
      movesElement.innerText = `Moves: ${moves}`;
      scoreElement.innerText = `Score: ${score}`;
  };

  // Function to start countdown timer
  const startCountdown = () => {
      // Clear any existing interval before starting a new one
      if (countdownInterval) {
          clearInterval(countdownInterval);
      }
      countdownInterval = setInterval(() => {
          countdown--;
          const minutes = Math.floor(countdown / 60);
          const seconds = countdown % 60;
          timerElement.innerText = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          
          if (countdown <= 0) {
              clearInterval(countdownInterval);
              timerElement.innerText = `Time's up!`;
              // alert("Time's up!"); // Show alert when time is up
              window.location.href = `time-up.html?moves=${moves}&score=${score}`;
              window.location.href = time-upUrl;
          }
      }, 1000);
  };

  // Function to reset countdown timer
  const resetCountdown = () => {
      clearInterval(countdownInterval); // Clear any existing interval
      countdown = 120; // Reset to 2:00
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      timerElement.innerText = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      // Restart the countdown
      startCountdown();
  };

  // Function to add match class to matched cards
  const cardMatches = () => {
      selectedCards.forEach(card => {
          card.classList.add("card_match");
      });
      score += 10; // Increase score by 10 for each match
      updateDisplay(); // Update score display
      checkGameCompletion();
  };

  const checkGameCompletion = () => {
    const unmatchedCards = document.querySelectorAll('.card:not(.card_match)');
    if (unmatchedCards.length === 0) {
        clearInterval(countdownInterval); // Stop countdown timer
        
        // Calculate elapsed time
        const timeElapsed = 120 - countdown;

        // Construct the URL with query parameters
        const resultsUrl = `results.html?moves=${moves}&score=${score}&time=${timeElapsed}`;
        
        // Redirect to results page
        window.location.href = resultsUrl;
    }
};

  // Function to reset game state
  const resetGame = () => {
      clickCount = 0;
      firstCard = null;
      secondCard = null;
      selectedCards.forEach(card => {
          card.classList.remove("card-selected");
          // Flip the card back to the front if it's not a match
          setTimeout(() => {
              if (!card.classList.contains("card_match")) {
                  card.style.transform = 'rotateY(0deg)';
              }
          }, 300); // Delay for visual effect
      });
      selectedCards.length = 0; // Clear the array
      updateDisplay(); // Update moves and score display
  };

  // Handle card clicks
  parentDiv.addEventListener("click", function (event) {
      let curCard = event.target;
      if (curCard.id === "card-section" || curCard.parentNode.classList.contains("card-selected") || curCard.parentNode.classList.contains("card_match")) {
          return;
      }

      clickCount++;
      let cardElement = curCard.parentNode;

      if (clickCount === 1) {
          firstCard = cardElement.dataset.name;
          cardElement.classList.add("card-selected");
          selectedCards.push(cardElement);
          cardElement.style.transform = 'rotateY(180deg)';
      } else if (clickCount === 2) {
          secondCard = cardElement.dataset.name;
          cardElement.classList.add("card-selected");
          selectedCards.push(cardElement);
          cardElement.style.transform = 'rotateY(180deg)';

          moves++; // Increment move counter
          updateDisplay(); // Update moves and score display
          if (firstCard && secondCard) {
              if (firstCard === secondCard) {
                  setTimeout(() => {
                      cardMatches();
                      resetGame();
                  }, 1000); // Delay to allow for the visual match effect
              } else {
                  setTimeout(() => {
                      resetGame();
                  }, 1000); // Delay to allow for the visual effect
                  // Do not reset the countdown timer here
              }
          }
      }
  });

  // Create new cards
  shuffleNumber.forEach(card => {
      const childDiv = document.createElement("div");
      childDiv.classList.add("card");
      childDiv.dataset.name = card.name;
      const frontDiv = document.createElement("div");
      frontDiv.classList.add("front-card");
      const backDiv = document.createElement("div");
      backDiv.classList.add("back-card");
      backDiv.style.backgroundImage = `url(${card.img})`;

      parentDiv.appendChild(childDiv);
      childDiv.appendChild(frontDiv);
      childDiv.appendChild(backDiv);
  });

  // Initialize game
  const initializeGame = () => {
      resetCountdown(); // Initialize countdown timer
      updateDisplay(); // Initialize moves and score display
  };

  initializeGame();

  // Reset button event listener
  document.getElementById("reset-button").addEventListener("click", function() {
      window.location.reload(); // Reload the page to reset everything
  });
});
