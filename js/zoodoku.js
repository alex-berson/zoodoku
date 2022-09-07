let board;


// let board = [
//         [0,0,3,0,2,0,6,0,0],
//         [9,0,0,3,0,5,0,0,1],
//         [0,0,1,8,0,6,4,0,0],
//         [0,0,8,1,0,2,9,0,0],
//         [7,0,0,0,0,0,0,0,8],
//         [0,0,6,7,0,8,2,0,0],
//         [0,0,2,6,0,9,5,0,0],
//         [8,0,0,2,0,3,0,0,9],
//         [0,0,5,0,1,0,3,0,0]];


// let board = [
// [3,0,0,2,0,0,0,0,0],
// [0,0,0,1,0,7,0,0,0],
// [7,0,6,0,3,0,5,0,0],
// [0,7,0,0,0,9,0,8,0],
// [9,0,0,0,2,0,0,0,4],
// [0,1,0,8,0,0,0,5,0],
// [0,0,9,0,4,0,3,0,1],
// [0,0,0,7,0,2,0,0,0],
// [0,0,0,0,0,8,0,0,6]];

// let board = [
//     [0,0,8,7,0,3,0,2,0],
//     [0,0,1,9,8,6,0,0,0],
//     [0,0,6,0,0,0,0,0,8],
//     [7,0,0,0,0,0,4,0,2],
//     [0,6,0,0,4,0,0,0,1],
//     [0,1,2,0,0,5,0,0,0],
//     [9,0,4,0,3,1,0,0,6],
//     [6,0,0,2,0,7,0,4,0],
//     [1,0,0,0,6,9,0,0,5]
// ];

// let board = [
//     [3,0,7,0,0,1,0,0,0],
//     [2,0,0,9,0,0,0,1,5],
//     [0,0,0,0,0,2,0,9,3],
//     [5,4,8,2,0,0,0,7,0],
//     [0,0,0,0,0,6,0,0,0],
//     [7,0,2,0,9,0,0,0,0],
//     [0,0,0,6,5,0,0,0,0],
//     [0,0,6,3,0,0,8,4,2],
//     [8,0,0,1,0,0,5,0,0]
// ];


// let board = [
//     [1,0,0,0,0,5,0,0,8],
//     [0,4,0,0,9,0,0,0,0],
//     [0,0,0,1,0,0,4,6,3],
//     [2,0,8,0,1,0,0,0,6],
//     [7,0,0,0,0,4,3,5,0],
//     [0,0,0,0,3,0,0,0,0],
//     [0,0,1,0,0,0,0,0,4],
//     [0,8,0,0,0,0,6,0,0],
//     [4,0,0,0,0,6,1,9,2]
// ];

const initBoard = () => {

    board = [[0,0,0,0],
             [0,0,0,0],
             [0,0,0,0],
             [0,0,0,0]];
}

const showBoard = () => document.querySelector("body").style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const cellCoords = (touchedCell) => {

    let cells = document.querySelectorAll('.cell');

    for (let [i, cell] of cells.entries()) {
        if (cell == touchedCell) return [Math.floor(i / 4), i % 4];
    }
}

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 4) * 4;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 4) * 4;
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});

}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const solved = (board) => {

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] == 0) return false;
        }
    }
    return true;
}

const count = (board) => {

    let n = 0;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] != 0) n++;
        }
    }

    return n;
}


const valid = (board, row, col, val) => {

    let boxRow = Math.floor(row / 2) * 2;
    let boxCol = Math.floor(col / 2) * 2;

    for (let i = 0; i < 4; i++) {

        if (board[row][i] == val || board[i][col] == val) return false;

        let currentRow = boxRow + Math.floor(i / 2);
        let currrentCol = boxCol + Math.floor(i % 2);

        if (board[currentRow][currrentCol] == val) return false;
    }

    return true;
}

const rows = (board) => {

    for (let row = 0; row < 4; row++) {
        outer: for (let val = 1; val <= 9; val++) {

            let r, c;

            for (let col = 0; col < 4; col++) {

                if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

                if (r != undefined) continue outer;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val, 1];
        }
    }

    return [null, null, null, null];
}

const cols = (board) => {

    for (let col = 0; col < 4; col++) {
        outer: for (let val = 1; val <= 4; val++) {

            let r, c;

            for (let row = 0; row < 4; row++) {

                if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

                if (r != undefined) continue outer;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val, 2];
        }
    }

    return [null, null, null, null];
}

const squares = (board) => {

    for (let sq = 0; sq < 4; sq++) {
        outer: for (let val = 1; val <= 4; val++) {

            let r, c; 
            let boxRow = Math.floor(sq / 2) * 2;
            let boxCol = Math.floor(sq % 2) * 2;

            for (let cell = 0; cell < 4; cell++) {

                let row = boxRow + Math.floor(cell / 2);
                let col = boxCol + Math.floor(cell % 2);

                if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

                if (r != undefined) continue outer;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val, 3];
        }
    }

    return [null, null, null, null];
}

// const cells = (board) => {

//     for (let row = 0; row < 4; row++) {
//         outer: for (let col = 0; col < 4; col++) {

//             if (board[row][col] != 0) continue;

//             let v;

//             for (let val = 1; val <= 4; val++) {

//                 if (valid(board, row, col, val)) {

//                     if (v != undefined) continue outer;

//                     v = val;
//                 }
//             }

//             if (v != undefined) return [row, col, v, 4];
//         }
//     }   

//     return [null, null, null, null];
// }

const solve = (board) => {

    let row, col, val, num;

    [row, col, val, num] = squares(board);
    if (row != undefined) return [row, col, val, num];

    [row, col, val, num] = rows(board);
    if (row != undefined) return [row, col, val, num];

    [row, col, val, num] = cols(board);
    if (row != undefined) return [row, col, val, num];

    // [row, col, val, num] = cells(board);
    // if (row != undefined) return [row, col, val, num];

    return [null, null, null, null];
}

const fill = () => {

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {

            if (board[row][col] != 0) continue;

            // let arr = shuffle([1,2,3,4,5,6,7,8,9]);

            // console.log(arr);

            for (let i of shuffle([1,2,3,4])) {
            
                // if (valid(board, row, col, i)) {
                if (!valid(board, row, col, i)) continue;

                // board[row][col] = i;
                board[row][col] = i;

                if (fill()) return true;

                board[row][col] = 0;

                // if (solve(board)) {
                //     // console.log(board.map(arr => arr.slice()));
                //     n++;
                // }
            }
                        
            return false;
        }
    }

    return true;
}

const save = () => {

    let cells = document.querySelectorAll('.cell');

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {

            cells[row * 4 + col].dataset.val = board[row][col];
            // cells[row * 9 + col].innerText = board[row][col];

        }
    }
}

const remove = () => {

    let cells = Array.from({length: 16}, (_, i) => i);

    // console.log(cells);

    cells = shuffle(cells);

    // for (let i = 0; i < 16; i++) {
    for (let cell of cells) {


        // let cell = cells[i];
        let row = Math.floor(cell / 4);
        let col = cell % 4;
        let val = board[row][col];

        // if (count(board) == 28) break;
        
        board[row][col] = 0;

        if (solvable()) continue;

        board[row][col] = val;
    }
}

const solvable = (steps = false) => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val, num] = solve(tempBoard);

        // if (steps) console.log(row, col, val, num);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while(!solved(tempBoard));

    // if (steps) console.table(tempBoard);

    return true;
}

// document.querySelector('.time').innerHTML = t2 - t1;

const fillBoard = () => {

    let flatBoard = board.flat();

    console.log(flatBoard);

    document.querySelectorAll('.cell').forEach(cell => {

        let val = flatBoard.shift();

        if (val) {
            cell.firstChild.innerText = val;
            cell.classList.add('filled');
        } else {
            cell.firstChild.innerText = '';
            // cell.classList.add('green');
        }

    });
}

const checkRow = (row, col, val) => {

    console.log(' ');

    for (let i = 0; i < 4; i++) {

        if (i == col || board[row][i] != 0) continue;

        console.log('row: ', row, i, valid(board, row, i, val));

        if (valid(board, row, i, val)) return false;
    }

    console.log('ROW');

    return true;
}

const checkCol = (row, col, val) => {

    console.log(' ');

    for (let i = 0; i < 4; i++) {

        if (i == row || board[i][col] != 0) continue;

        console.log('col: ', i, col, valid(board, i, col, val));

        if (valid(board, i, col, val)) return false;
    }
    console.log('COL');


    return true;
}

const checkSquare = (row, col, val) => {

    let boxRow = Math.floor(row / 2) * 2;
    let boxCol = Math.floor(col / 2) * 2;

    console.log(' ');



    for (let i = 0; i < 4; i++) {


        let r = boxRow + Math.floor(i / 2);
        let c = boxCol + Math.floor(i % 2);

        if (r == row && c == col || board[r][c] != 0) continue;

        console.log('sq: ', r, c, valid(board, r, c, val));

        if (valid(board, r, c, val)) return false;
    }

    console.log('SQ');


    return true;
}

const checkCell = (row, col, val) => {

    console.log(' ');


    for (i = 1; i <= 4; i++) {

        if (i == val) continue;

        if (valid(board, row, col, val)) return false;
    }

    console.log('CELL');

    return true;
}

const logic = (row, col, val) => {

    if (checkRow(row, col, val) || checkCol(row, col, val) || checkSquare(row, col, val) || checkCell(row, col, val)) return true;

    // if (checkRow(row, col, val)) return true;


    return false;
}

const select = (e) => {

    let cell = e.currentTarget;
    let cells = document.querySelectorAll('.cell');

    // console.table(board);

    let [row, col] = cellCoords(cell);

    let val = parseInt(cell.dataset.val);

    console.log(row, col, val);

    // logic(row, col, val) ? cell.classList.add('green') : cell.classList.add('red');

    if (cell.classList.contains('filled')) { 
        for (let cell of cells) {
            cell.classList.remove('gray');
        }

        document.querySelector('.animals').classList.remove('display');
        document.querySelector('.eraser').classList.remove('display');

        // disableAnimals();
        // disableEraser();
        return;
    }

    if (cell.classList.contains('gray')) {
        cell.classList.remove('gray');
        document.querySelector('.animals').classList.remove('display');
        document.querySelector('.eraser').classList.remove('display');
        // disableAnimals();
        // disableEraser();

        return;
    } 

    for (let cell of cells) {
        cell.classList.remove('gray');
    }

    cell.classList.add('gray');

    document.querySelector('.animals').classList.remove('display');
    document.querySelector('.eraser').classList.remove('display');

    if (cell.classList.contains('red')) {

        document.querySelector('.animals').style.display = 'none';
        document.querySelector('.eraser').style.display = 'flex';

        setTimeout(() => {
            document.querySelector('.eraser').classList.add('display');   
            // enableEraser();              
        }, 0);

        return;  
    }

    document.querySelector('.eraser').style.display = 'none';
    document.querySelector('.animals').style.display = 'flex';

    setTimeout(() => {
        document.querySelector('.animals').classList.add('display');   
        // enableAnimals();             
    }, 0);
}


const selectAnimal= (e) => {

    let animal = parseInt(e.currentTarget.innerText);
    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        if (cell.classList.contains('gray')) {

            let [row, col] = cellCoords(cell);

            cell.classList.remove('gray');

            cell.dataset.val == animal ? cell.classList.add('filled') : cell.classList.add('red'); 
            cell.firstChild.innerText = animal;
            if (cell.dataset.val == animal) board[row][col] = animal;

        }

        document.querySelector('.animals').classList.remove('display');
        // disableAnimals();

    }

    if (solved(board)) setTimeout(firework, 500);

    console.log(animal);
}

const reset = () => {

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);

    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('filled');
        cell.firstChild.classList.remove('pop');
    });

    initBoard();    
    fill();
    save(); 
    remove();
    fillBoard();
}

const firework = () => {

    console.log('FIREWORK');

    let n = 0;

    let cells = document.querySelectorAll('.cell');
    let order = Array.from({length: 81}, (_, i) => i);
    order = shuffle(order);
    // console.log(cells);

    const pop = () => {
        if (n > 80){
            document.querySelector('.board').addEventListener('touchstart', reset);
            document.querySelector('.board').addEventListener('mousedown', reset);
            clearInterval(popInterval);
        } else {
            cells[order[n]].firstChild.classList.add('pop');
            n++;
        }
    }

    let  popInterval = setInterval(pop, 100);

}

const eraser = (e) => {

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        if (cell.classList.contains('gray')) {

            let [row, col] = cellCoords(cell);

            cell.classList.remove('gray','red');
            cell.firstChild.innerText = '';
            board[row][col] = 0;
        }

        document.querySelector('.eraser').classList.remove('display');

        // disableAnimals();
        // disableEraser();
    }
}

const enableAnimals = () => {

    let animals = document.querySelectorAll('.animal');

    for (let animal of animals){
        if (touchScreen()){
            animal.addEventListener("touchstart", selectAnimal);
        } else {
            animal.addEventListener("mousedown", selectAnimal);
        }
    }
}

// const disableAnimals = () => {

//     let animals = document.querySelectorAll('.number');

//     for (let animal of animals){
//         if (touchScreen()){
//             animal.removeEventListener("touchstart", selectAnimal);
//         } else {
//             animal.removeEventListener("mousedown", selectAnimal);
//         }
//     }
// }

const enableEraser = () => {

    let x = document.querySelector('.x');

        if (touchScreen()){
            x.addEventListener("touchstart", eraser);
        } else {
            x.addEventListener("mousedown", eraser);
        }
}

// const disableEraser = () => {

//     let x = document.querySelector('.x');

//         if (touchScreen()){
//             x.removeEventListener("touchstart", eraser);
//         } else {
//             x.removeEventListener("mousedown", eraser);
//         }
// }

const enableTouch = () => {

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells){
        if (touchScreen()){
            cell.addEventListener("touchstart", select);
        } else {
            cell.addEventListener("mousedown", select);
        }
    }
}

// const disableTouch = () => {

//     let cells = document.querySelectorAll('.cell');

//     for (let cell of cells){
//         if (touchScreen()){
//             cell.removeEventListener("touchstart", select);
//         } else {
//             cell.removeEventListener("mousedown", select);
//         }
//     }
// }

const init = () => {

    disableTapZoom();
    setBoardSize();
    initBoard();
    
    let t0 = performance.now();

    fill();

    save(); 

    let t1 = performance.now();

    remove();

    let t2 = performance.now();

    fillBoard();

    showBoard();

    enableTouch();
    enableAnimals();
    enableEraser();

    solvable(true);


    console.table(board);

    // console.log(t1 - t0);
    // console.log(t2 - t1);
    console.log(count(board));
}

window.onload = () => document.fonts.ready.then(() => init());