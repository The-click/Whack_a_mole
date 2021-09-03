const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreElement = document.querySelector('.score');
const levelCurrentElem = document.querySelector('.level__current');
const allLevels = document.querySelectorAll('.level');
const countMole = document.querySelector('.task__mole');
const allLeader = document.querySelectorAll('.leader');
const taskLevelText = document.querySelector('.task')
const conditionLevels = { 1: 8, 2: 7, 3: 5, 4: 4, 5: 4 };
// 
let levelCurrent = +localStorage.getItem('level-current');
let leaderBoard = JSON.parse(localStorage.getItem('leader-board')) || [];
let currentConditionLevel = JSON.parse(localStorage.getItem('condition-levels'));
let score = 0;
let lastHole;
let game = false;

// 

function getRandomTime(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomHole() {
    let randomIdx = Math.floor(Math.random() * holes.length);
    let hole = holes[randomIdx];
    if (lastHole === randomIdx) return getRandomHole();
    lastHole = randomIdx;
    return hole;
}

function nextMove(level) {
    let timeMove = getRandomTime(300, 1000);
    let nextHole = getRandomHole();
    nextHole.classList.add('up');
    setTimeout(() => {
        nextHole.classList.remove('up');
        if (game) nextMove();
    }, timeMove)
}

function startGame() {
    if (game) return;

    score = 0;
    scoreElement.textContent = score;
    game = true;
    nextMove();
    setTimeout(finishGame, 10000)

}

function finishGame() {
    game = false;

    setTimeout(() => {
        leaderBoard[levelCurrent].push(score);
        leaderBoard[levelCurrent].sort((a, b) => -(a - b));
        console.log(leaderBoard[levelCurrent])
        leaderBoard[levelCurrent] = leaderBoard[levelCurrent].slice(0, 3)
        localStorage.setItem('leader-board', (JSON.stringify(leaderBoard)));
        drawLeaderBoard()
    }, 400)

    if (score >= currentConditionLevel) {
        localStorage.setItem('level-current', ++levelCurrent);
        taskLevelText.classList.remove('complete')
        initialOrNextLevel();

    }


}

function addScore(e) {
    if (!e.isTrusted) return;
    this.parentNode.classList.remove('up');
    score++;
    scoreElement.textContent = score;
    if (currentConditionLevel <= score) {

        taskLevelText.classList.add('complete')
    }
}


function getOrSetLocalStorae(key, initialValue) {
    if (localStorage.getItem(key)) {
        localStorage.setItem(key, initialValue);
        return initialValue;
    } else {
        localStorage
    }
}

function drawLeaderBoard() {
    leaderBoard = (JSON.parse(localStorage.getItem('leader-board')));
    for (let i = 0; i < 3; i++) {
        allLeader[i].textContent = `${i + 1}. ${(leaderBoard[levelCurrent][i] || '...')}`
    };

}

function initialOrNextLevel() {
    if (!localStorage.getItem('level-current')) {
        console.log('s')
        localStorage.setItem('level-current', 1);
        localStorage.setItem('condition-levels', JSON.stringify(conditionLevels));
        localStorage.setItem('leader-board', JSON.stringify({
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        }));
    } else {
        document.querySelector('.here').classList.remove('here');
        drawLeaderBoard();

        levelCurrent = localStorage.getItem('level-current');
        levelCurrentElem.textContent = levelCurrent;
        currentConditionLevel = JSON.parse(localStorage.getItem('condition-levels'))[levelCurrent];
        countMole.textContent = currentConditionLevel;
        allLevels[levelCurrent - 1].classList.add('here');


    }

}


document.addEventListener('DOMContentLoaded', initialOrNextLevel)
moles.forEach((i) => i.addEventListener('click', addScore))