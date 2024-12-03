class StatisticsViewer {
    constructor() {
        // Инициализация Telegram WebApp
        this.tg = window.Telegram.WebApp;
        
        // Сообщаем приложению, что мы готовы к отображению
        this.tg.ready();
        
        // Настраиваем цвета в соответствии с темой пользователя
        this.setupTheme();
        
        this.data = this.loadData();
        this.displayStats();

        // Добавляем слушатель изменения темы
        this.tg.onEvent('themeChanged', () => {
            this.setupTheme();
        });

        // Настраиваем кнопку "Назад"
        this.setupBackButton();
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

    setupBackButton() {
        // Настраиваем кнопку "Назад" в хедере Telegram
        this.tg.BackButton.show();
        this.tg.BackButton.onClick(() => {
            window.history.back();
        });
    }

    loadData() {
        const savedData = localStorage.getItem('puffData');
        return savedData ? JSON.parse(savedData) : {};
    }

    displayStats() {
        const dates = Object.keys(this.data);
        if (dates.length === 0) {
            this.displayEmptyState();
            return;
        }

        this.displaySummary(dates);
        this.displayDetailedStats(dates);
    }

    displayEmptyState() {
        const container = document.getElementById('stats-container-full');
        container.innerHTML = `
            <div class="empty-state">
                <p>Пока нет данных о затяжках</p>
            </div>
        `;
    }

    displaySummary(dates) {
        const totalPuffs = Object.values(this.data).reduce((sum, count) => sum + count, 0);
        const avgPuffs = Math.round(totalPuffs / dates.length);
        const maxPuffs = Math.max(...Object.values(this.data));
        
        const summaryContainer = document.getElementById('stats-summary');
        summaryContainer.innerHTML = `
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-value">${dates.length}</span>
                    <span class="summary-label">Дней записи</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${totalPuffs}</span>
                    <span class="summary-label">Всего затяжек</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${avgPuffs}</span>
                    <span class="summary-label">В среднем в день</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${maxPuffs}</span>
                    <span class="summary-label">Максимум за день</span>
                </div>
            </div>
        `;
    }

    displayDetailedStats(dates) {
        const container = document.getElementById('stats-container-full');
        container.innerHTML = '';

        // Сортируем даты в обратном порядке
        const sortedDates = dates.sort((a, b) => b.localeCompare(a));

        sortedDates.forEach(date => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            statItem.innerHTML = `
                <div class="stat-date">
                    <span class="date-full">${formattedDate}</span>
                </div>
                <div class="stat-count">
                    <span class="count-value">${this.data[date]}</span>
                    <span class="count-label">затяжек</span>
                </div>
            `;
            
            container.appendChild(statItem);
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new StatisticsViewer();
}); 