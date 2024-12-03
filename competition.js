class CompetitionManager {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.currentPeriod = 'day';
        this.setupEventListeners();
        this.loadLeaderboard();
        this.loadAchievements();
    }

    setupEventListeners() {
        // Обработчики для кнопок периода
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchPeriod(btn.dataset.period);
            });
        });

        // Обработчик для кнопки приглашения
        document.getElementById('invite-friends').addEventListener('click', () => {
            this.inviteFriends();
        });
    }

    switchPeriod(period) {
        this.currentPeriod = period;
        // Обновляем активную кнопку
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });
        // Загружаем новые данные
        this.loadLeaderboard();
    }

    async loadLeaderboard() {
        // В реальном приложении здесь будет запрос к API
        const mockData = await this.getMockLeaderboardData();
        this.updateLeaderboardUI(mockData);
    }

    async getMockLeaderboardData() {
        // Временные данные для демонстрации
        return [
            { id: 1, name: 'Алексей', avatar: 'https://via.placeholder.com/40', puffs: 120, trend: -5 },
            { id: 2, name: 'Мария', avatar: 'https://via.placeholder.com/40', puffs: 85, trend: -12 },
            { id: 3, name: 'Дмитрий', avatar: 'https://via.placeholder.com/40', puffs: 150, trend: 8 },
        ];
    }

    updateLeaderboardUI(data) {
        const container = document.getElementById('leaderboard-list');
        container.innerHTML = data.map((user, index) => `
            <div class="leaderboard-item">
                <div class="leaderboard-position">${index + 1}</div>
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-stats">
                        <span class="puff-count">${user.puffs} затяжек</span>
                        <span class="trend ${user.trend < 0 ? 'down' : 'up'}">
                            ${user.trend > 0 ? '+' : ''}${user.trend}%
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadAchievements() {
        const achievements = [
            { icon: '🌟', name: 'Первый день', progress: '1/1' },
            { icon: '📊', name: 'Статистик', progress: '3/5' },
            { icon: '🏆', name: 'Чемпион недели', progress: '0/1' },
            { icon: '🎯', name: 'Цель достигнута', progress: '2/3' },
        ];

        const container = document.getElementById('achievements-list');
        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-progress">${achievement.progress}</div>
            </div>
        `).join('');
    }

    inviteFriends() {
        // Используем нативный функционал Telegram для шаринга
        this.tg.showPopup({
            title: 'Пригласить друзей',
            message: 'Хотите отправить приглашение друзьям?',
            buttons: [
                {id: "share", type: "default", text: "Поделиться"},
                {id: "cancel", type: "cancel", text: "Отмена"}
            ]
        }, (buttonId) => {
            if (buttonId === 'share') {
                // В реальном приложении здесь будет логика шаринга через Telegram
                this.tg.shareUrl('https://t.me/your_bot_username');
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CompetitionManager();
}); 