document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const resetButton = document.getElementById('resetButton');
    const vsPlayerBtn = document.getElementById('vsPlayerBtn');
    const vsComputerBtn = document.getElementById('vsComputerBtn');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let isVsComputer = false; // Flag to determine game mode

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Function to initialize or reset the game
    function initializeGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'occupied');
            cell.addEventListener('click', handleCellClick, { once: true }); // Re-add click listener
        });

        // If playing against computer and it's O's turn first (rare for Tic Tac Toe)
        // or if we want AI to make first move sometimes, we could add logic here.
    }

    // Function to handle a cell click
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return; // Cell already occupied or game is not active
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        checkGameStatus();

        if (gameActive && isVsComputer && currentPlayer === 'O') {
            setTimeout(computerMove, 500); // Delay computer move for better UX
        }
    }

    // Function to make a move (both player and computer)
    function makeMove(cellElement, index, player) {
        board[index] = player;
        cellElement.textContent = player;
        cellElement.classList.add(player.toLowerCase(), 'occupied');
        // Remove event listener after occupation, re-added on reset
        cellElement.removeEventListener('click', handleCellClick);
    }

    // Function to check game status (win or draw)
    function checkGameStatus() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameStatus.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
            // Remove all click listeners to prevent further moves
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            gameStatus.textContent = `It's a Draw!`;
            gameActive = false;
            return;
        }

        // If no win or draw, switch players
        switchPlayer();
    }

    // Function to switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }

    // Simple AI for computer player (playing as 'O')
    function computerMove() {
        if (!gameActive) return;

        let availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                availableCells.push(i);
            }
        }

        if (availableCells.length > 0) {
            // Basic AI: Prioritize winning, then blocking, otherwise random
            let bestMove = -1;

            // 1. Check for winning move for computer (O)
            for (let i = 0; i < availableCells.length; i++) {
                const testBoard = [...board];
                testBoard[availableCells[i]] = 'O';
                if (checkWin(testBoard, 'O')) {
                    bestMove = availableCells[i];
                    break;
                }
            }

            // 2. If no winning move, check to block player (X)
            if (bestMove === -1) {
                for (let i = 0; i < availableCells.length; i++) {
                    const testBoard = [...board];
                    testBoard[availableCells[i]] = 'X';
                    if (checkWin(testBoard, 'X')) {
                        bestMove = availableCells[i];
                        break;
                    }
                }
            }

            // 3. If no win or block, pick center if available
            if (bestMove === -1 && board[4] === '') {
                bestMove = 4;
            }

            // 4. If center not available, pick corners
            const corners = [0, 2, 6, 8];
            if (bestMove === -1) {
                for (let i = 0; i < corners.length; i++) {
                    if (board[corners[i]] === '') {
                        bestMove = corners[i];
                        break;
                    }
                }
            }

            // 5. Otherwise, pick a random available cell
            if (bestMove === -1) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                bestMove = availableCells[randomIndex];
            }

            const cellElement = cells[bestMove];
            makeMove(cellElement, bestMove, 'O');
            checkGameStatus();
        }
    }

    // Helper function to check win condition on a given board state for a player
    function checkWin(currentBoard, player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            if (currentBoard[winCondition[0]] === player &&
                currentBoard[winCondition[1]] === player &&
                currentBoard[winCondition[2]] === player) {
                return true;
            }
        }
        return false;
    }

    // Event listener for reset button
    resetButton.addEventListener('click', initializeGame);

    // Event listeners for game mode buttons
    vsPlayerBtn.addEventListener('click', () => {
        isVsComputer = false;
        vsPlayerBtn.classList.add('active');
        vsComputerBtn.classList.remove('active');
        initializeGame();
    });

    vsComputerBtn.addEventListener('click', () => {
        isVsComputer = true;
        vsComputerBtn.classList.add('active');
        vsPlayerBtn.classList.remove('active');
        initializeGame();
    });

    // Initialize the game when the page loads
    initializeGame();
});