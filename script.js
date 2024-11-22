class PuffTracker {
    constructor() {
        this.data = this.loadData();
        this.todayKey = this.getDateKey(new Date());
        
        this.initializeToday();
        this.setupEventListeners();
        this.updateDisplay();
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
    }

    addPuff() {
        this.data[this.todayKey]++;
        this.saveData();
        this.updateDisplay();
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