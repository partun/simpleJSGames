document.addEventListener('DOMContentLoaded', () => {
    const colons = document.querySelectorAll('.col');
    const displayCurrentPlayer = document.querySelector('#current-player');
    const result = document.querySelector('#result');
    //size of the grid depends on the html structure
    const winningSeq = 4; //player # disc in a sequence wins the game
    var players = [
        //array of players
        {
            key: 'player01',
            name: 'Player Green',
            color: 'green',
        },
        {
            key: 'player02',
            name: 'Player Purple',
            color: 'purple',
        },
    ];
    var currentPlayerID = Math.floor(Math.random() * players.length); //id of starting player choses a random player to start
    displayCurrentPlayer.innerHTML = currentPlayer().name;
    var fullColons = new Set(); //set of full colons
    var finished = false; //indicates if the game has finished
    var squares = [];
    //return current player
    function currentPlayer() {
        return players[currentPlayerID];
    }
    // changes the player to the next player in the players array
    function nextPlayer() {
        currentPlayerID = (currentPlayerID + 1) % players.length;
        displayCurrentPlayer.innerHTML = currentPlayer().name;
    }
    for (let i = 0; i < colons.length; i++) {
        colons[i].setAttribute('id', i.toString()); //numbers the colons
        squares.push(colons[i].querySelectorAll('.col div')); //add the list of all squares in the colon to squares
        colons[i].addEventListener('click', insertDisc);
    }
    //called by clicking on a colon
    function insertDisc() {
        if (finished) {
            //game is finished no more discs can we placed
            return;
        }
        let col_id = parseInt(this.getAttribute('id')); //id of the colon clicked
        let col_squares = squares[col_id];
        //fine the lowest empty square in the colon
        for (let i = col_squares.length - 1; i >= 0; i--) {
            if (col_squares[i].classList.contains('taken')) {
                continue;
            }
            else {
                //add the disc into the grid
                col_squares[i].classList.add('taken');
                col_squares[i].classList.add(currentPlayer().key);
                col_squares[i].setAttribute('style', 'background-color:' + currentPlayer().color);
                checkForWinner(col_id, i);
                if (i == 0) {
                    //colon full, add it to the full colons set
                    fullColons.add(col_id);
                    if (fullColons.size >= colons.length) {
                        //all colons are full and no player has won, draw the game
                        drawGame();
                    }
                    //remove event listener to prevent further clicks
                    col_squares[i].removeEventListener('click', insertDisc);
                }
                nextPlayer();
                return;
            }
        }
    }
    function checkVertical(col_id, row_id, height, width) {
        //vertical four down
        let player = currentPlayer().key;
        let i = row_id + 1;
        let seq = 1;
        while (i <= height) {
            if (squares[col_id][i].classList.contains(player)) {
                i++;
                seq++;
            }
            else {
                break;
            }
        }
        return seq >= winningSeq;
    }
    function checkHorizontal(col_id, row_id, height, width) {
        //horizontal four
        let player = currentPlayer().key;
        let left = col_id - 1;
        let right = col_id + 1;
        let seq = 1;
        while (left >= 0) {
            if (squares[left][row_id].classList.contains(player)) {
                left--;
                seq++;
            }
            else {
                break;
            }
        }
        while (right <= width) {
            if (squares[right][row_id].classList.contains(player)) {
                right++;
                seq++;
            }
            else {
                break;
            }
        }
        return seq >= winningSeq;
    }
    function checkPositiveDiagonal(col_id, row_id, height, width) {
        //positive diagonal (/) four
        let player = currentPlayer().key;
        let left = col_id - 1;
        let right = col_id + 1;
        let top = row_id - 1;
        let bottom = row_id + 1;
        let seq = 1;
        while (left >= 0 && bottom <= height) {
            if (squares[left][bottom].classList.contains(player)) {
                left--;
                bottom++;
                seq++;
            }
            else {
                break;
            }
        }
        while (right <= width && top >= 0) {
            if (squares[right][top].classList.contains(player)) {
                right++;
                top--;
                seq++;
            }
            else {
                break;
            }
        }
        return seq >= winningSeq;
    }
    function checkNegativeDiagonal(col_id, row_id, height, width) {
        //negative diagonal (\) four
        let player = currentPlayer().key;
        let left = col_id - 1;
        let right = col_id + 1;
        let top = row_id - 1;
        let bottom = row_id + 1;
        let seq = 1;
        while (left >= 0 && top >= 0) {
            if (squares[left][top].classList.contains(player)) {
                left--;
                top--;
                seq++;
            }
            else {
                break;
            }
        }
        while (right <= width && bottom <= height) {
            if (squares[right][bottom].classList.contains(player)) {
                right++;
                bottom++;
                seq++;
            }
            else {
                break;
            }
        }
        return seq >= winningSeq;
    }
    //checks if the last inserted disc builds a winning sequence
    function checkForWinner(col_id, row_id) {
        let height = squares[col_id].length - 1; //max row id
        let width = squares.length - 1; //max colon id
        if (checkVertical(col_id, row_id, height, width) ||
            checkHorizontal(col_id, row_id, height, width) ||
            checkPositiveDiagonal(col_id, row_id, height, width) ||
            checkNegativeDiagonal(col_id, row_id, height, width)) {
            winGame(currentPlayer());
        }
    }
    //player won the game
    function winGame(player) {
        console.log(player.name + ' won the game!');
        result.innerHTML = player.name + ' wins!';
        finished = true;
    }
    //game is a draw
    function drawGame() {
        console.log('Game is a draw!');
        result.innerHTML = 'Game is a draw!';
        finished = true;
    }
});
