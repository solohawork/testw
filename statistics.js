class StatisticsViewer {
    constructor() {
        this.data = this.loadData();
        this.displayStats();
    }

    loadData() {
        const savedData = localStorage.getItem('puffData');
        return savedData ? JSON.parse(savedData) : {};
    }

    displayStats() {
        const statsContainer = document.getElementById('stats-container-full');
        statsContainer.innerHTML = '';

        // Сортируем даты в обратном порядке
        const sortedDates = Object.keys(this.data).sort((a, b) => b.localeCompare(a));

        // Добавляем общую статистику
        const totalPuffs = Object.values(this.data).reduce((sum, count) => sum + count, 0);
        const avgPuffs = Math.round(totalPuffs / sortedDates.length);

        const statsHeader = document.createElement('div');
        statsHeader.className = 'stats-summary';
        statsHeader.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Всего дней:</span>
                <span class="summary-value">${sortedDates.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Всего затяжек:</span>
                <span class="summary-value">${totalPuffs}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">В среднем в день:</span>
                <span class="summary-value">${avgPuffs}</span>
            </div>
        `;
        statsContainer.appendChild(statsHeader);

        // Добавляем статистику по дням
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

document.addEventListener('DOMContentLoaded', () => {
    new StatisticsViewer();
}); 