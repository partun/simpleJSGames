document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('.score span');
    const startBtn = document.querySelector('.start');
    startBtn.addEventListener('click', () => {
        if (running) {
            gameStop('stop button was pressed');
        }
        else {
            gameStart();
        }
    });

    const width = 12; //squares
    const height = 12; //squares

    const squareSize = 60; //px
    let running = false

    class Snake {
        constructor() {
            this.x = 3;
            this.y = 3;
            this.direction = [1, 0];
            this.tail = [];
            this.maxLength = 3;
            this.initSpeed = 200;
            this.speed = this.initSpeed;
            this.acc = 0.95;
            this.score = 0;

            let head = field(this.x, this.y);
            this.tail.push(head);
            head.classList.add('snake');
        }
        start = () => {
            this.interval = setInterval(this.move, this.initSpeed);
        }

        stop = () => {
            clearInterval(this.interval);
        }

        increaseSpeed = () => {
            this.speed *= this.acc;
            clearInterval(this.interval);
            this.interval = setInterval(this.move, this.speed);
        }

        move = () => {
            //calc new positions for head
            let newX = this.x + this.direction[0];
            let newY = this.y + this.direction[1];

            //check for boarder collision
            if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
                gameStop('collision with wall');
                return;
            }

            //check for apple collision
            if (newX == apple.x && newY == apple.y) {
                this.increaseSpeed();
                apple.reset();
                this.maxLength++;
            }

            //if snake is to long we have to remove the last element
            if (this.tail.length > this.maxLength - 1) {
                let oldTail = this.tail.shift()
                oldTail.classList.remove('snake') //remove mark form old tail of the snake
            }

            //update position values
            this.x = newX;
            this.y = newY;
            let newHead = field(newX, newY);

            //check collision with own tail
            for (let i = 0; i < this.tail.length; i++) {
                if (this.tail[i] === newHead) {
                    gameStop('collision with own tail')
                    return;
                }

            }

            this.tail.push(newHead); //add new head to the tail
            newHead.classList.add('snake') //mark head as part of the snake
            addToScore();
        }

        changeDirection = (event) => {
            let newDir = controls[event.keyCode];
            if (running && newDir != undefined) {
                //check to make sure you can only make 90 degree turn
                if (newDir[0] == snake.direction[0] || newDir[1] == snake.direction[1]) {
                    //this is a 180 degree tour, which would imminently kill me
                    return;
                }
                this.direction = newDir
                console.log(newDir);
            }
        }
    }


    class Apple {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.isSet = false;
        }

        set = () => {
            if (this.isSet) {
                return
            }
            this.x = randInt(width);
            this.y = randInt(height);
            this.isSet = true;
            field(this.x, this.y).classList.add('apple');
        }

        remove = () => {
            if (!this.isSet) {
                return;
            }
            this.isSet = false;
            field(this.x, this.y).classList.remove('apple');
        }

        reset = () => {
            this.remove();
            this.set();
        }
    }

    //maps keyCode to vectors
    let controls = new Map();
    controls['38'] = [0, -1]; //up
    controls['40'] = [0, 1]; //down
    controls['39'] = [1, 0]; //right
    controls['37'] = [-1, 0]; //left
    controls['87'] = [0, -1]; //up
    controls['83'] = [0, 1]; //down
    controls['68'] = [1, 0]; //right
    controls['65'] = [-1, 0]; //left


    function field(x, y) {
        return gameField[y][x]
    }

    function toPx(value) {
        return value.toString() + 'px'
    }

    function randInt(upper) {
        return Math.floor(Math.random() * upper);
    }

    //set the grid to the correct size
    grid.style.height = toPx(height * squareSize);
    grid.style.width = toPx(width * squareSize);

    //create html structure
    var gameField = []
    for (let i = 0; i < height; i++) {
        let row = [];

        for (let j = 0; j < width; j++) {
            let square = document.createElement('div');
            square.style.width = toPx(squareSize);
            square.style.height = toPx(squareSize);
            grid.appendChild(square);
            row.push(square);
        }
        gameField.push(row);
    }


    const apple = new Apple();
    const snake = new Snake();

    function addToScore() {
        scoreDisplay.innerHTML = ++snake.score;
    }

    function pressSpaceToStart(event) {
        if (!running && event.keyCode == 32) {
            gameStart();
            return;
        }
    }
    document.addEventListener('keydown', pressSpaceToStart)

    function gameStart() {
        //setup the game
        running = true
        document.removeEventListener('keydown', pressSpaceToStart)


        //create the snake
        document.addEventListener('keydown', snake.changeDirection);
        snake.start();

        //set apple
        apple.reset();
    }

    function gameStop(stopCode) {
        running = false;
        //stop the snake
        snake.stop();

        console.log('game has stopped because ' + stopCode)
    }
});