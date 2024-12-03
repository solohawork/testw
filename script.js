class PuffTracker {
    constructor() {
        // Инициализация Telegram WebApp
        this.tg = window.Telegram.WebApp;
        
        // Сообщаем приложению, что мы готовы к отображению
        this.tg.ready();
        
        // Настраиваем цвета в соответствии с темой пользователя
        this.setupTheme();
        
        // Инициализация данных
        this.data = this.loadData();
        this.todayKey = this.getDateKey(new Date());
        this.limit = localStorage.getItem('puffLimit') ? parseInt(localStorage.getItem('puffLimit')) : null;
        
        this.initializeToday();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateLimitDisplay();

        // Добавляем слушатель изменения темы
        this.tg.onEvent('themeChanged', () => {
            this.setupTheme();
        });

        // Настраиваем основную кнопку
        this.setupMainButton();
    }

    setupTheme() {
        // Применяем цвета темы Telegram
        document.documentElement.style.setProperty('--tg-theme-bg-color', this.tg.themeParams.bg_color);
        document.documentElement.style.setProperty('--tg-theme-text-color', this.tg.themeParams.text_color);
        document.documentElement.style.setProperty('--tg-theme-hint-color', this.tg.themeParams.hint_color);
        document.documentElement.style.setProperty('--tg-theme-link-color', this.tg.themeParams.link_color);
        document.documentElement.style.setProperty('--tg-theme-button-color', this.tg.themeParams.button_color);
        document.documentElement.style.setProperty('--tg-theme-button-text-color', this.tg.themeParams.button_text_color);

        // Устанавливаем цвет хедера
        this.tg.setHeaderColor(this.tg.themeParams.bg_color);
        
        // Устанавливаем цвет фона
        this.tg.setBackgroundColor(this.tg.themeParams.bg_color);
    }

    setupMainButton() {
        const mainButton = this.tg.MainButton;
        mainButton.setText('Добавить затяжку');
        mainButton.onClick(() => {
            this.addPuff();
        });
        mainButton.show();
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
                // Проверяем текущее количест��о затяжек после установки лимита
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
        // Используем нативный попап Telegram вместо своего модального окна
        this.tg.showPopup({
            title: 'Внимание!',
            message: 'Хватит курить! Вы достигли дневного лимита.',
            buttons: [{
                id: "ok",
                type: "ok",
                text: "Понятно"
            }]
        });
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