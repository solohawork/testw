class PuffTracker {
    constructor() {
        this.data = this.loadData();
        this.todayKey = this.getDateKey(new Date());
        this.limit = localStorage.getItem('puffLimit') ? parseInt(localStorage.getItem('puffLimit')) : null;
        
        this.initializeToday();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateLimitDisplay();
    }

    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    loadData() {
        const savedData = localStorage.getItem('puffData');
        return savedData ? JSON.parse(savedData) : {};
    }

    saveData() {
        localStorage.setItem('puffData', JSON.stringify(this.data));
    }

    initializeToday() {
        if (!this.data[this.todayKey]) {
            this.data[this.todayKey] = 0;
        }
    }

    setupEventListeners() {
        document.getElementById('count-button').addEventListener('click', () => {
            this.addPuff();
        });

        document.getElementById('set-limit-button').addEventListener('click', () => {
            this.setLimit();
        });
    }

    setLimit() {
        const newLimit = prompt('Введите лимит затяжек на день:', this.limit || '');
        if (newLimit !== null) {
            const limitNumber = parseInt(newLimit);
            if (!isNaN(limitNumber) && limitNumber > 0) {
                this.limit = limitNumber;
                localStorage.setItem('puffLimit', limitNumber);
                this.updateLimitDisplay();
                // Проверяем текущее количество затяжек после установки лимита
                this.checkLimit();
            } else {
                alert('Пожалуйста, введите положительное число');
            }
        }
    }

    updateLimitDisplay() {
        const limitDisplay = document.getElementById('limit-display');
        const currentLimit = document.getElementById('current-limit');
        
        if (this.limit) {
            limitDisplay.style.display = 'block';
            currentLimit.textContent = `${this.limit} затяжек`;
        } else {
            limitDisplay.style.display = 'none';
        }
    }

    checkLimit() {
        const limitWarning = document.getElementById('limit-warning');
        if (this.limit && this.data[this.todayKey] >= this.limit) {
            limitWarning.style.display = 'block';
            // Добавляем модальное окно
            this.showLimitModal();
        } else {
            limitWarning.style.display = 'none';
        }
    }

    showLimitModal() {
        // Создаем модальное окно, если его еще нет
        let modal = document.getElementById('limit-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'limit-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Внимание!</h2>
                    <p>Хватит курить!</p>
                    <button onclick="this.parentElement.parentElement.style.display='none'">OK</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Добавляем стили для модального окна
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    position: relative;
                    background-color: #fff;
                    margin: 15% auto;
                    padding: 20px;
                    width: 80%;
                    max-width: 400px;
                    border-radius: 15px;
                    text-align: center;
                    animation: slideIn 0.3s ease;
                }
                .modal-content h2 {
                    color: #e74c3c;
                    margin-bottom: 10px;
                }
                .modal-content button {
                    padding: 10px 30px;
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }
                .modal-content button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        modal.style.display = 'block';
    }

    addPuff() {
        this.data[this.todayKey]++;
        this.saveData();
        this.updateDisplay();
        this.checkLimit();
    }

    updateDisplay() {
        // Обновляем счётчик на сегодня
        const todayCount = document.getElementById('today-count');
        todayCount.textContent = `${this.data[this.todayKey]} затяжек`;

        // Обновляем статистику
        const statsContainer = document.getElementById('stats-container');
        statsContainer.innerHTML = '';

        // Сортируем даты в обратном порядке
        const sortedDates = Object.keys(this.data).sort((a, b) => b.localeCompare(a));

        sortedDates.forEach(date => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const formattedDate = new Date(date).toLocaleDateString('ru-RU');
            statItem.innerHTML = `
                <span>${formattedDate}</span>
                <span>${this.data[date]} затяжек</span>
            `;
            
            statsContainer.appendChild(statItem);
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new PuffTracker();
}); 