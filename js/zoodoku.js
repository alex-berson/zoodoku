let board, clues;
let animals = ['bear','boar','cat','cow','dog','fox','frog','hamster','koala','lion','monkey','mouse','panda','pig','polar-bear','rabbit','raccoon','tiger','wolf'];

const initBoard = () => board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];    

const showBoard = () => document.body.style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.trunc(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const setTitle = () => {

    let title = document.querySelector('h1');
    let ua = navigator.userAgent;
    let safari = /Safari/.test(ua) && !/Chrome/.test(ua);

    try {

        let safariVer = safari ? ua.match(/Version\/([\d.]+)/)[1].split('.').map(Number) : null;

        if (safari && safariVer[0] < 14) title.classList.remove('rounded-corners');

    } catch(e) {}

    if (document.URL.startsWith('http://') || document.URL.startsWith('https://')) return;

    if (/(iPhone|iPod|iPad)/.test(ua)) {

        try {

            let osVer = ua.match(/OS ([\d_]+)/)[1].split('_').map(Number);
        
            if (osVer[0] < 14) title.classList.remove('rounded-corners');

        } catch(e) {}

        return;
    }

    try {

        let osVer = [...ua.match(/Mac OS X ([\d_]+)/)[1].split('_').map(Number), 0, 0, 0];

        if (osVer[0] == 10 && osVer[1] == 15 && osVer[2] <= 4) title.classList.remove('rounded-corners');
        
    } catch(e) {}    
}

const setBoardSize = () => {

    let minSide = screen.height > screen.width ? screen.width : window.innerHeight;
    let cssBoardSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size'));
    let boardSize = Math.ceil(minSide * cssBoardSize / 4) * 4;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const setClues = () => {

    clues = shuffle(animals).slice(0, 4);

    document.querySelectorAll('.selection .animal').forEach((animal, i) => {
        animal.src = `images/animals/${clues[i]}.svg`;
    });
}

const puzzleSolved = (board) => {

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] == 0) return false;
        }
    }

    return true;
}

const validAnimal = (board, row, col, val) => {

    let boxRow = Math.trunc(row / 2) * 2;
    let boxCol = Math.trunc(col / 2) * 2;

    for (let i = 0; i < 4; i++) {

        if (board[row][i] == val || board[i][col] == val) return false;

        let currentRow = boxRow + Math.trunc(i / 2);
        let currentCol = boxCol + i % 2;

        if (board[currentRow][currentCol] == val) return false;
    }

    return true;
}

const checkRegs = (board) => {

    for (let reg = 0; reg < 4; reg++) {
        valLoop: for (let val = 1; val <= 4; val++) {

            let r, c; 
            let boxRow = Math.trunc(reg / 2) * 2;
            let boxCol = reg % 2 * 2;

            for (let cell = 0; cell < 4; cell++) {

                let row = boxRow + Math.trunc(cell / 2);
                let col = boxCol + cell % 2;

                if (board[row][col] != 0 || !validAnimal(board, row, col, val)) continue;
                if (r != undefined) continue valLoop;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val];
        }
    }

    return [null, null, null];
}

const findAnimal = (board) => {

    let row, col, val;

    [row, col, val] = checkRegs(board);

    if (row != null) return [row, col, val];

    return [null, null, null];
}

const countFilled = (board) => {

    let n = 0;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] != 0) n++;
        }
    }

    return n;
}

const puzzleSolvable = (board) => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findAnimal(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while (!puzzleSolved(tempBoard));

    return true;
}

const generatePuzzle = () => {

    let tempBoard = [];

    do {

        let cells = Array.from({length: 16}, (_, i) => i);
        let clues = [1,2,3,4];

        tempBoard = board.map(arr => arr.slice());

        shuffle(cells);

        for (let clue of clues) {
            for (let cell of cells) {

                let [row, col] = [Math.trunc(cell / 4), cell % 4];

                if (tempBoard[row][col] != 0) continue;

                if (validAnimal(tempBoard, row, col, clue)) {
                    tempBoard[row][col] = clue;
                    break;
                }
            }
        }

    } while (!puzzleSolvable(tempBoard) || countFilled(tempBoard) != 4);

    board = tempBoard;
}

const saveSolution = () => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findAnimal(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while (!puzzleSolved(tempBoard));

    let cells = document.querySelectorAll('.cell');

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            cells[row * 4 + col].dataset.val = tempBoard[row][col];
        }
    }
}

const fillBoard = () => {

    let board1D = board.flat();
    let cells = document.querySelectorAll('.cell');
    
    for (let cell of cells) {

        let val = board1D.shift();

        if (!val) continue;

        cell.firstChild.src = `images/animals/${clues[val - 1]}.svg`;
        cell.classList.add('clue', 'filled');
    }
}

const selectCell = (e) => {

    let cell = e.currentTarget;
    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
                    
        let img = cell.firstChild;

        if (!img.classList.contains('incorrect')) continue;
            
        img.style.animationDuration = '0.0s';

        break;
    }

    document.querySelector('.selection').classList.remove('display');

    if (cell.classList.contains('gray')) {
        cell.classList.remove('gray');
        return;
    } 

    cells.forEach(cell => cell.classList.remove('gray'));

    if (cell.classList.contains('filled')) return;

    cell.classList.add('gray');
    
    setTimeout(() => {
        document.querySelector('.selection').classList.add('display');   
    }, 0);
}

const cellCoords = (touchedCell) => {

    let cells = document.querySelectorAll('.cell');

    for (let [i, cell] of cells.entries()) {
        if (cell == touchedCell) return [Math.trunc(i / 4), i % 4];
    }
}

const selectAnimal = (e) => {

    let animal = e.currentTarget.id.substring(1);
    let cells = document.querySelectorAll('.cell');

    document.querySelector('.selection').classList.remove('display');

    for (let cell of cells) {

        if (!cell.classList.contains('gray')) continue;

        let [row, col] = cellCoords(cell);
        let img = cell.firstChild;
        img.src = `images/animals/${clues[animal - 1]}.svg`;
        cell.classList.remove('gray');

        if (cell.dataset.val == animal) {
            cell.classList.add('filled');
            board[row][col] = Number(animal);
            break;
        }

        img.classList.add('incorrect');

        img.addEventListener('animationend', e => {

            let img = e.currentTarget;

            img.classList.remove('incorrect');
            img.src = '';
            img.removeAttribute('style');

        }, {once: true});

        break;
    }

    if (puzzleSolved(board)) {
        disableTouch();
        setTimeout(firework, 500);
    }
}

const resetBoard = () => {

    let event = touchScreen() ? 'touchstart' : 'mousedown';

    document.querySelector('.board').removeEventListener(event, newGame);

    document.querySelectorAll('.cell').forEach(cell => {

        cell.classList.add('reset'); 
        cell.classList.remove('filled', 'clue', 'zoom');

        cell.addEventListener('transitionend', e => {

            let cell = e.currentTarget;

            cell.classList.remove('reset'); 
            cell.firstChild.src = '';

        }, {once: true});
    });
}

const newGame = () => {

    resetBoard();

    setTimeout(() => {
        initBoard(); 
        setClues();  
        generatePuzzle();
        saveSolution(); 
        fillBoard();

    }, 600);

    setTimeout(enableTouch, 1100);
}

const firework = () => {

    let n = 0;
    let cells = document.querySelectorAll('.cell');
    let order = Array.from({length: 16}, (_, i) => i);

    order = shuffle(order);

    const zoom = () => {

        cells[order[n]].classList.add('zoom');

        cells[order[n]].firstChild.addEventListener('animationend', e => {

            let img = e.currentTarget;

            img.parentElement.classList.remove('zoom'); 

        }, {once: true});
        
        if (n >= 15) {

            let event = touchScreen() ? 'touchstart' : 'mousedown';

            clearInterval(zoomInterval);
            setTimeout(() => document.querySelector('.board').addEventListener(event, newGame), 500);
        }

        n++;  
    }

    let  zoomInterval = setInterval(zoom, 300);
}

const preloadImages = () => {

    animals.forEach(animal => {

        let img = new Image();

        img.src = `images/animals/${animal}.svg`;
    });
}

const enableTouch = () => {

    let cells = document.querySelectorAll('.cell');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    cells.forEach(cell => cell.addEventListener(event, selectCell));
}

const disableTouch = () => {

    let cells = document.querySelectorAll('.cell');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    cells.forEach(cell => cell.removeEventListener(event, selectCell));
}

const enableSelection = () => {

    let buttons = document.querySelectorAll('.button');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    buttons.forEach(button => button.addEventListener(event, selectAnimal));
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();
    const event = touchScreen() ? 'touchstart' : 'mousedown';

    document.body.addEventListener(event, preventDefault, {passive: false});
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {

    registerServiceWorker();
    disableTapZoom();
    setTitle();
    setBoardSize();
    initBoard();
    setClues();
    generatePuzzle();
    saveSolution();
    fillBoard();
    showBoard();
    enableTouch();
    enableSelection();
    preloadImages();  
}

window.onload = () => document.fonts.ready.then(() => setTimeout(init, 0));