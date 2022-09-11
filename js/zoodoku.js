let board;
let clues = [];

const animals = ['bear','boar','cat','cow','dog','fox','frog','hamster','koala','lion','monkey','mouse','panda','pig','polar-bear','rabbit','raccoon','tiger','wolf'];

// const animals = ['bear','boar','cat','cow','dog','fox','hamster','koala','lion','monkey','mouse','panda','pig','polar-bear','raccoon','tiger','wolf'];

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

const setClues = () => {

    clues = shuffle(animals).slice(0, 4);

    document.querySelectorAll('.selection .animal').forEach((animal, i) => {
        animal.src = `images/zoo/${clues[i]}.svg`;
    });
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

const boxes = (board) => {

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

    [row, col, val, num] = boxes(board);
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

const diffrent4 = (board) => {

    let clues = [1, 2, 3, 4];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {

            if (board[i][j] == 0) continue;

            let index = clues.indexOf(board[i][j]);

            if (index == -1) return false;

            clues.splice(index, 1); 
        }    
    }

    return true;
}

const remove = () => {

    let tempBoard;
    let cells = Array.from({length: 16}, (_, i) => i);

    // console.log(cells);

    do {
         
        tempBoard = board.map(arr => arr.slice());

        cells = shuffle(cells);

        // for (let i = 0; i < 16; i++) {
        for (let cell of cells) {

            // let cell = cells[i];
            let row = Math.floor(cell / 4);
            let col = cell % 4;
            let val = tempBoard[row][col];

            // if (count(board) == 28) break;
            
            tempBoard[row][col] = 0;

            if (solvable(tempBoard)) continue;

            tempBoard[row][col] = val;
        }

        // console.log(diffrent4(tempBoard));

    } while(!diffrent4(tempBoard));

    board = tempBoard;
}

const solvable = (board, steps = false) => {

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

// const fillBoard = () => {

//     let flatBoard = board.flat();

//     console.log(flatBoard);

//     document.querySelectorAll('.cell').forEach(cell => {

//         let val = flatBoard.shift();

//         if (val) {
//             cell.firstChild.innerText = val;
//             cell.classList.add('filled');
//         } else {
//             cell.firstChild.innerText = '';
//             // cell.classList.add('green');
//         }
//     });
// }

const fillBoard = () => {

    let flatBoard = board.flat();

    // console.log(flatBoard);

    document.querySelectorAll('.cell').forEach(cell => {

        let val = flatBoard.shift();

        if (val) {

            console.log(clues[val - 1]);

            cell.firstChild.src = `images/zoo/${clues[val - 1]}.svg`;
            cell.firstChild.classList.add('filled');
        } else {
            // cell.firstChild.innerText = '';
        }
    });
}

const checkRow = (row, col, val) => {

    // console.log(' ');

    for (let i = 0; i < 4; i++) {

        if (i == col || board[row][i] != 0) continue;

        // console.log('row: ', row, i, valid(board, row, i, val));

        if (valid(board, row, i, val)) return false;
    }

    // console.log('ROW');

    return true;
}

const checkCol = (row, col, val) => {

    // console.log(' ');

    for (let i = 0; i < 4; i++) {

        if (i == row || board[i][col] != 0) continue;

        console.log('col: ', i, col, valid(board, i, col, val));

        if (valid(board, i, col, val)) return false;
    }
    // console.log('COL');

    return true;
}

const checkBox = (row, col, val) => {

    let boxRow = Math.floor(row / 2) * 2;
    let boxCol = Math.floor(col / 2) * 2;

    // console.log(' ');

    for (let i = 0; i < 4; i++) {

        let r = boxRow + Math.floor(i / 2);
        let c = boxCol + Math.floor(i % 2);

        if (r == row && c == col || board[r][c] != 0) continue;

        console.log('sq: ', r, c, valid(board, r, c, val));

        if (valid(board, r, c, val)) return false;
    }

    // console.log('SQ');

    return true;
}

const checkCell = (row, col, val) => {

    // console.log(' ');

    for (i = 1; i <= 4; i++) {

        if (i == val) continue;

        if (valid(board, row, col, val)) return false;
    }

    // console.log('CELL');

    return true;
}

const logic = (row, col, val) => {

    if (checkRow(row, col, val) || checkCol(row, col, val) || checkBox(row, col, val) || checkCell(row, col, val)) return true;

    // if (checkRow(row, col, val)) return true;

    return false;
}

const select = (e) => {

    let cell = e.currentTarget;
    let cells = document.querySelectorAll('.cell');

    // console.table(board);

    let [row, col] = cellCoords(cell);

    let val = parseInt(cell.dataset.val);

    // console.log(row, col, val);

    // logic(row, col, val) ? cell.classList.add('green') : cell.classList.add('red');

    if (cell.firstChild.classList.contains('filled')) { 
        for (let cell of cells) {
            cell.classList.remove('gray');
        }

        document.querySelector('.selection').classList.remove('display');
        document.querySelector('.eraser').classList.remove('display');

        // disableAnimals();
        // disableEraser();
        return;
    }

    // console.log(cell.classList);

    if (cell.classList.contains('gray')) {
        cell.classList.remove('gray');
        document.querySelector('.selection').classList.remove('display');
        document.querySelector('.eraser').classList.remove('display');
        // disableAnimals();
        // disableEraser();

        // console.log('GRAY');

        return;
    } 

    for (let cell of cells) {
        cell.classList.remove('gray');
    }

    cell.classList.add('gray');

    document.querySelector('.selection').classList.remove('display');
    document.querySelector('.eraser').classList.remove('display');

    if (cell.firstChild.classList.contains('red')) {

        document.querySelector('.selection').style.display = 'none';
        document.querySelector('.eraser').style.display = 'flex';

        setTimeout(() => {
            document.querySelector('.eraser').classList.add('display');   
            // enableEraser();              
        }, 0);

        return;  
    }

    document.querySelector('.eraser').style.display = 'none';
    document.querySelector('.selection').style.display = 'flex';

    setTimeout(() => {
        document.querySelector('.selection').classList.add('display');   
        // enableAnimals();             
    }, 0);
}


const selectAnimal = (e) => {

    // let animal = parseInt(e.currentTarget.innerText);

    let animal = e.currentTarget.id.substring(1);

    // console.log(animal);

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        if (cell.classList.contains('gray')) {

            let [row, col] = cellCoords(cell);

            cell.classList.remove('gray');

            cell.dataset.val == animal ? cell.firstChild.classList.add('filled') : cell.firstChild.classList.add('red'); 
            cell.firstChild.src = `images/zoo/${clues[animal - 1]}.svg`;
            if (cell.dataset.val == animal) board[row][col] = animal;

        }

        document.querySelector('.selection').classList.remove('display');
        // disableAnimals();

    }

    if (solved(board)) {
        disableTouch();
        setTimeout(firework, 500);
    }

    // console.log(animal);
}

const reset = () => {

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);

    document.querySelectorAll(".cell .animal").forEach((animal) => {
        animal.classList.add('reset'); 
    });

    document.querySelectorAll('.cell').forEach(cell => {
        cell.firstChild.classList.remove('filled');
        cell.firstChild.classList.remove('pop');
    });

    setTimeout(() => {
        initBoard(); 
        setClues();  
        fill();
        save(); 
        remove();
        fillBoard();
    }, 600);

    setTimeout(() => {
        document.querySelectorAll(".cell .animal").forEach((animal) => {
            animal.classList.remove('reset'); 
            enableTouch();
        });
    }, 1100);

}

const firework = () => {

    // console.log('FIREWORK');

    let n = 0;

    let cells = document.querySelectorAll('.cell');
    let order = Array.from({length: 16}, (_, i) => i);
    order = shuffle(order);
    // console.log(cells);

    const pop = () => {
        if (n > 15){
            document.querySelector('.board').addEventListener('touchstart', reset);
            document.querySelector('.board').addEventListener('mousedown', reset);
            clearInterval(popInterval);
        } else {
            cells[order[n]].firstChild.classList.add('pop');
            n++;
        }
    }

    let  popInterval = setInterval(pop, 300);

}

const erase = (e) => {

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        if (cell.classList.contains('gray')) {

            let [row, col] = cellCoords(cell);

            cell.classList.remove('gray');
            cell.firstChild.classList.remove('red');
            // cell.firstChild.innerText = '';
            board[row][col] = 0;
        }

        document.querySelector('.eraser').classList.remove('display');

        // disableAnimals();
        // disableEraser();
    }
}

const enableSelection = () => {

    let animals = document.querySelectorAll('.selection .animal');

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

    let x = document.querySelector('.wastebasket');

        if (touchScreen()){
            x.addEventListener("touchstart", erase);
        } else {
            x.addEventListener("mousedown", erase);
        }
}

// const disableEraser = () => {

//     let x = document.querySelector('.wastebasket');

//         if (touchScreen()){
//             x.removeEventListener("touchstart", erase);
//         } else {
//             x.removeEventListener("mousedown", erase);
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

const disableTouch = () => {

    // console.log('DISABLE');

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells){
        if (touchScreen()){
            cell.removeEventListener("touchstart", select);
        } else {
            cell.removeEventListener("mousedown", select);
        }
    }
}

const init = () => {

    disableTapZoom();
    setBoardSize();
    initBoard();
    setClues();  
    
    let t0 = performance.now();

    fill();

    save(); 

    let t1 = performance.now();

    remove();

    let t2 = performance.now();

    fillBoard();

    showBoard();

    // if (solved(board)) setTimeout(() => {
    //     disableTouch();
    //     firework();
    // }, 1500);

    enableTouch();
    enableSelection();
    enableEraser();

    solvable(board, true);

    // console.table(board);

    console.log(t1 - t0);
    console.log(t2 - t1);
    // console.log(count(board));
}

window.onload = () => document.fonts.ready.then(() => init());