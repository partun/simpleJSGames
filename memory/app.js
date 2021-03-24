document.addEventListener('DOMContentLoaded', () => {
    // define cards used by the game
    // names have to be unique
    const cards = [
        {
            name: 'alien',
            img: 'images/alien.jpeg'
        },
        {
            name: 'cat',
            img: 'images/cat.jpeg'
        },
        {
            name: 'happy',
            img: 'images/happy.jpeg'
        },
        {
            name: 'heart',
            img: 'images/heart.jpeg'
        },
        {
            name: 'rocket',
            img: 'images/rocket.jpeg'
        },
        {
            name: 'sad',
            img: 'images/sad.jpeg'
        },
    ];
    const emptyCard = {
        name: 'empty',
        img: 'images/empty.jpeg'
    };
    const backCard = {
        name: 'back',
        img: 'images/cardback.jpeg'
    };
    //double each card
    let cardCount = cards.length;
    for (let i = 0; i < cardCount; i++) {
        cards.push(Object.assign({}, cards[i]));
    }
    //shuffle cards array
    cards.sort(() => 0.5 - Math.random());
    var cardsChosenId = [];
    var cardsWon = 0;
    var attempts = 0;
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('#score');
    scoreDisplay.textContent = cardsWon.toString();
    const attemptsDisplay = document.querySelector('#attempts');
    attemptsDisplay.textContent = attempts.toString();
    //create game board
    function createBoard() {
        for (let i = 0; i < cards.length; i++) {
            let card = document.createElement('img');
            card.setAttribute('src', backCard.img);
            card.setAttribute('data-id', i.toString());
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }
    function checkForMatch() {
        let cards_elms = document.querySelectorAll('img');
        const id1 = cardsChosenId[0];
        const id2 = cardsChosenId[1];
        if (cards[id1].name == cards[id2].name) {
            cards_elms[id1].removeEventListener('click', flipCard);
            cards_elms[id2].removeEventListener('click', flipCard);
            console.log('correct');
            cards_elms[id1].setAttribute('src', emptyCard.img);
            cards_elms[id2].setAttribute('src', emptyCard.img);
            cardsWon++;
        }
        else {
            cards_elms[id1].setAttribute('src', backCard.img);
            cards_elms[id2].setAttribute('src', backCard.img);
            attemptsDisplay.textContent = (++attempts).toString();
        }
        cardsChosenId = [];
        scoreDisplay.textContent = cardsWon.toString();
        //check if player has won
        if (cardsWon >= cards.length / 2) {
            alert('You won!' + '\nwrong attempts: ' + attempts);
        }
    }
    function flipCard() {
        let cardId = parseInt(this.getAttribute('data-id'));
        //prevent player form choosing the same card twice
        //or more then two cards during timeout phase
        if (cardsChosenId.length >= 2 || cardsChosenId.includes(cardId)) {
            return;
        }
        cardsChosenId.push(cardId);
        this.setAttribute('src', cards[cardId].img);
        if (cardsChosenId.length >= 2) {
            //time out to give player time to look at the cards
            setTimeout(checkForMatch, 800);
        }
    }
    createBoard();
});
