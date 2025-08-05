class DurakGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.computerHand = [];
        this.trumpCard = null;
        this.trumpSuit = null;
        this.currentAttacker = 'player'; // 'player' или 'computer'
        this.attackCards = [];
        this.beatCards = [];
        this.gameState = 'waiting'; // 'waiting', 'playing', 'finished'
        this.selectedCards = [];
        
        this.initializeEventListeners();
    }

    // Инициализация колоды
    initializeDeck() {
        const suits = ['♠', '♣', '♥', '♦'];
        const values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }
        
        // Перемешивание колоды
        this.shuffleDeck();
        
        // Определение козыря
        this.trumpCard = this.deck[this.deck.length - 1];
        this.trumpSuit = this.trumpCard.suit;
        
        // Раздача карт
        this.dealCards();
        
        // Определение первого атакующего (у кого младший козырь)
        this.determineFirstAttacker();
    }

    // Перемешивание колоды
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // Раздача карт
    dealCards() {
        // Раздаем по 6 карт каждому игроку
        for (let i = 0; i < 6; i++) {
            if (this.deck.length > 0) {
                this.playerHand.push(this.deck.pop());
            }
            if (this.deck.length > 0) {
                this.computerHand.push(this.deck.pop());
            }
        }
    }

    // Определение первого атакующего
    determineFirstAttacker() {
        let playerLowestTrump = null;
        let computerLowestTrump = null;

        // Находим младший козырь у игрока
        for (let card of this.playerHand) {
            if (card.suit === this.trumpSuit) {
                if (!playerLowestTrump || this.getCardValue(card) < this.getCardValue(playerLowestTrump)) {
                    playerLowestTrump = card;
                }
            }
        }

        // Находим младший козырь у компьютера
        for (let card of this.computerHand) {
            if (card.suit === this.trumpSuit) {
                if (!computerLowestTrump || this.getCardValue(card) < this.getCardValue(computerLowestTrump)) {
                    computerLowestTrump = card;
                }
            }
        }

        // Если у кого-то нет козырей, атакует тот, у кого есть
        if (!playerLowestTrump && computerLowestTrump) {
            this.currentAttacker = 'computer';
        } else if (playerLowestTrump && !computerLowestTrump) {
            this.currentAttacker = 'player';
        } else if (playerLowestTrump && computerLowestTrump) {
            // Сравниваем младшие козыри
            if (this.getCardValue(playerLowestTrump) < this.getCardValue(computerLowestTrump)) {
                this.currentAttacker = 'player';
            } else {
                this.currentAttacker = 'computer';
            }
        } else {
            // Если у обоих нет козырей, атакует игрок
            this.currentAttacker = 'player';
        }
    }

    // Получение числового значения карты
    getCardValue(card) {
        const values = {
            '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[card.value];
    }

    // Проверка, можно ли побить карту
    canBeatCard(attackCard, beatCard) {
        // Карты должны быть одной масти или козырем
        if (beatCard.suit !== attackCard.suit && beatCard.suit !== this.trumpSuit) {
            return false;
        }

        // Если козырь бьет некозырь
        if (beatCard.suit === this.trumpSuit && attackCard.suit !== this.trumpSuit) {
            return true;
        }

        // Если некозырь бьет козырь
        if (attackCard.suit === this.trumpSuit && beatCard.suit !== this.trumpSuit) {
            return false;
        }

        // Сравниваем значения карт
        return this.getCardValue(beatCard) > this.getCardValue(attackCard);
    }

    // Проверка, можно ли подкинуть карту
    canAddCard(card) {
        // Можно подкидывать карты того же достоинства, что уже есть на столе
        for (let attackCard of this.attackCards) {
            if (card.value === attackCard.value) {
                return true;
            }
        }
        for (let beatCard of this.beatCards) {
            if (card.value === beatCard.value) {
                return true;
            }
        }
        return false;
    }

    // Начало игры
    startGame() {
        this.initializeDeck();
        this.updateDisplay();
        this.gameState = 'playing';
        this.updateStatus();
        this.updateButtons();
        
        if (this.currentAttacker === 'computer') {
            setTimeout(() => this.computerTurn(), 1000);
        }
    }

    // Ход компьютера
    computerTurn() {
        if (this.currentAttacker === 'computer') {
            // Компьютер атакует
            this.computerAttack();
        } else {
            // Компьютер отбивается
            this.computerDefend();
        }
    }

    // Атака компьютера
    computerAttack() {
        // Компьютер выбирает карту для атаки
        let attackCard = null;
        
        // Сначала пытается найти некозырную карту
        for (let card of this.computerHand) {
            if (card.suit !== this.trumpSuit) {
                attackCard = card;
                break;
            }
        }
        
        // Если нет некозырных, берет козырь
        if (!attackCard && this.computerHand.length > 0) {
            attackCard = this.computerHand[0];
        }

        if (attackCard) {
            this.attackCards.push(attackCard);
            this.computerHand = this.computerHand.filter(card => card !== attackCard);
            this.currentAttacker = 'player';
            this.updateDisplay();
            this.updateStatus();
            this.updateButtons();
        }
    }

    // Защита компьютера
    computerDefend() {
        // Компьютер пытается побить карты
        let allBeaten = true;
        
        for (let attackCard of this.attackCards) {
            let beatCard = null;
            
            // Ищем подходящую карту для отбивания
            for (let card of this.computerHand) {
                if (this.canBeatCard(attackCard, card)) {
                    // Предпочитаем некозырные карты
                    if (card.suit !== this.trumpSuit) {
                        beatCard = card;
                        break;
                    } else if (!beatCard) {
                        beatCard = card;
                    }
                }
            }
            
            if (beatCard) {
                this.beatCards.push(beatCard);
                this.computerHand = this.computerHand.filter(card => card !== beatCard);
            } else {
                allBeaten = false;
                break;
            }
        }
        
        if (allBeaten) {
            // Компьютер побил все карты
            this.clearAttackArea();
            this.currentAttacker = 'computer';
            this.refillHands();
        } else {
            // Компьютер не смог побить, берет карты
            this.computerHand = this.computerHand.concat(this.attackCards);
            this.computerHand = this.computerHand.concat(this.beatCards);
            this.clearAttackArea();
            this.currentAttacker = 'player';
            this.refillHands();
        }
        
        this.updateDisplay();
        this.updateStatus();
        this.updateButtons();
        
        if (this.gameState === 'playing') {
            setTimeout(() => this.computerTurn(), 1000);
        }
    }

    // Очистка игровой области
    clearAttackArea() {
        this.attackCards = [];
        this.beatCards = [];
    }

    // Добор карт
    refillHands() {
        // Добираем карты до 6
        while (this.playerHand.length < 6 && this.deck.length > 0) {
            this.playerHand.push(this.deck.pop());
        }
        while (this.computerHand.length < 6 && this.deck.length > 0) {
            this.computerHand.push(this.deck.pop());
        }
    }

    // Проверка окончания игры
    checkGameEnd() {
        if (this.deck.length === 0) {
            if (this.playerHand.length === 0) {
                this.endGame('player');
            } else if (this.computerHand.length === 0) {
                this.endGame('computer');
            }
        }
    }

    // Окончание игры
    endGame(winner) {
        this.gameState = 'finished';
        if (winner === 'player') {
            this.updateStatus('Поздравляем! Вы выиграли!');
        } else {
            this.updateStatus('Компьютер выиграл. Попробуйте еще раз!');
        }
        this.updateButtons();
    }

    // Обновление отображения
    updateDisplay() {
        this.updateDeckCount();
        this.updateTrumpDisplay();
        this.updatePlayerHand();
        this.updateComputerHand();
        this.updateAttackArea();
        this.checkGameEnd();
    }

    // Обновление счетчика карт в колоде
    updateDeckCount() {
        document.getElementById('deck-count').textContent = this.deck.length;
    }

    // Обновление отображения козыря
    updateTrumpDisplay() {
        if (this.trumpCard) {
            const trumpDisplay = document.getElementById('trump-display');
            trumpDisplay.querySelector('.card-value').textContent = this.trumpCard.value;
            trumpDisplay.querySelector('.card-suit').textContent = this.trumpCard.suit;
        }
        document.getElementById('trump-suit').textContent = this.trumpSuit || '♠';
    }

    // Обновление руки игрока
    updatePlayerHand() {
        const container = document.getElementById('player-cards');
        container.innerHTML = '';
        
        this.playerHand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index, 'player');
            container.appendChild(cardElement);
        });
    }

    // Обновление руки компьютера
    updateComputerHand() {
        const container = document.getElementById('computer-cards');
        container.innerHTML = '';
        
        this.computerHand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index, 'computer');
            container.appendChild(cardElement);
        });
    }

    // Обновление игровой области
    updateAttackArea() {
        const container = document.getElementById('attack-area');
        container.innerHTML = '';
        
        // Отображаем пары карт (атакующая + отбивающая)
        const maxCards = Math.max(this.attackCards.length, this.beatCards.length);
        
        for (let i = 0; i < maxCards; i++) {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'attack-pair';
            
            if (i < this.attackCards.length) {
                const attackCard = this.createCardElement(this.attackCards[i], i, 'attack');
                attackCard.classList.add('attack-card');
                pairDiv.appendChild(attackCard);
            }
            
            if (i < this.beatCards.length) {
                const beatCard = this.createCardElement(this.beatCards[i], i, 'beat');
                beatCard.classList.add('beat-card');
                pairDiv.appendChild(beatCard);
            }
            
            container.appendChild(pairDiv);
        }
    }

    // Создание элемента карты
    createCardElement(card, index, type) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.type = type;
        
        if (card.suit === this.trumpSuit) {
            cardDiv.classList.add('trump');
        }
        
        cardDiv.innerHTML = `
            <div class="card-value">${card.value}</div>
            <div class="card-suit">${card.suit}</div>
        `;
        
        if (type === 'player') {
            cardDiv.addEventListener('click', () => this.onPlayerCardClick(card, index));
        }
        
        return cardDiv;
    }

    // Обработка клика по карте игрока
    onPlayerCardClick(card, index) {
        if (this.gameState !== 'playing') return;
        
        if (this.currentAttacker === 'player') {
            // Игрок атакует
            this.handlePlayerAttack(card, index);
        } else {
            // Игрок отбивается
            this.handlePlayerDefend(card, index);
        }
    }

    // Обработка атаки игрока
    handlePlayerAttack(card, index) {
        if (this.attackCards.length === 0) {
            // Первая атака
            this.attackCards.push(card);
            this.playerHand.splice(index, 1);
            this.currentAttacker = 'computer';
            this.updateDisplay();
            this.updateStatus();
            this.updateButtons();
            setTimeout(() => this.computerTurn(), 1000);
        } else {
            // Подкидывание карты
            if (this.canAddCard(card)) {
                this.attackCards.push(card);
                this.playerHand.splice(index, 1);
                this.currentAttacker = 'computer';
                this.updateDisplay();
                this.updateStatus();
                this.updateButtons();
                setTimeout(() => this.computerTurn(), 1000);
            }
        }
    }

    // Обработка защиты игрока
    handlePlayerDefend(card, index) {
        // Находим карту для отбивания
        const unbeatCards = this.attackCards.filter((_, i) => i >= this.beatCards.length);
        
        if (unbeatCards.length > 0 && this.canBeatCard(unbeatCards[0], card)) {
            this.beatCards.push(card);
            this.playerHand.splice(index, 1);
            
            // Проверяем, все ли карты побиты
            if (this.beatCards.length === this.attackCards.length) {
                this.clearAttackArea();
                this.currentAttacker = 'player';
                this.refillHands();
            }
            
            this.updateDisplay();
            this.updateStatus();
            this.updateButtons();
            
            if (this.gameState === 'playing') {
                setTimeout(() => this.computerTurn(), 1000);
            }
        }
    }

    // Обработка кнопки "Взять карты"
    takeCards() {
        if (this.currentAttacker !== 'player') {
            this.playerHand = this.playerHand.concat(this.attackCards);
            this.playerHand = this.playerHand.concat(this.beatCards);
            this.clearAttackArea();
            this.currentAttacker = 'computer';
            this.refillHands();
            this.updateDisplay();
            this.updateStatus();
            this.updateButtons();
            setTimeout(() => this.computerTurn(), 1000);
        }
    }

    // Обработка кнопки "Бито"
    done() {
        if (this.beatCards.length === this.attackCards.length && this.beatCards.length > 0) {
            this.clearAttackArea();
            this.currentAttacker = 'player';
            this.refillHands();
            this.updateDisplay();
            this.updateStatus();
            this.updateButtons();
        }
    }

    // Обновление статуса игры
    updateStatus(message) {
        const statusElement = document.getElementById('status-message');
        if (message) {
            statusElement.textContent = message;
        } else {
            if (this.gameState === 'waiting') {
                statusElement.textContent = 'Нажмите "Начать игру" для начала';
            } else if (this.gameState === 'playing') {
                if (this.currentAttacker === 'player') {
                    if (this.attackCards.length === 0) {
                        statusElement.textContent = 'Ваш ход. Выберите карту для атаки';
                    } else {
                        statusElement.textContent = 'Выберите карту для отбивания или нажмите "Взять карты"';
                    }
                } else {
                    statusElement.textContent = 'Ход компьютера...';
                }
            }
        }
    }

    // Обновление состояния кнопок
    updateButtons() {
        const startBtn = document.getElementById('start-game');
        const takeBtn = document.getElementById('take-cards');
        const beatBtn = document.getElementById('beat-cards');
        const doneBtn = document.getElementById('done');

        if (this.gameState === 'waiting') {
            startBtn.disabled = false;
            takeBtn.disabled = true;
            beatBtn.disabled = true;
            doneBtn.disabled = true;
        } else if (this.gameState === 'playing') {
            startBtn.disabled = true;
            
            if (this.currentAttacker === 'player') {
                takeBtn.disabled = this.attackCards.length === 0;
                beatBtn.disabled = true;
                doneBtn.disabled = true;
            } else {
                takeBtn.disabled = true;
                beatBtn.disabled = true;
                doneBtn.disabled = this.beatCards.length !== this.attackCards.length || this.beatCards.length === 0;
            }
        } else {
            startBtn.disabled = false;
            takeBtn.disabled = true;
            beatBtn.disabled = true;
            doneBtn.disabled = true;
        }
    }

    // Инициализация обработчиков событий
    initializeEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('take-cards').addEventListener('click', () => this.takeCards());
        document.getElementById('beat-cards').addEventListener('click', () => this.beatCards());
        document.getElementById('done').addEventListener('click', () => this.done());
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new DurakGame();
}); 