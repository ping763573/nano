// Nano Banana AI Guide - Fixed JavaScript Application
class NanoBananaGuide {
    constructor() {
        this.currentSection = 'home';
        this.currentTab = 'consistency';
        this.currentFilter = 'all';
        this.mobileMenuOpen = false;
        this.favorites = this.loadFavorites();
        this.databasePopulated = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // Small delay to ensure all elements are rendered
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        console.log('🍌 Nano Banana Guide 初始化中...');
        
        try {
            this.setupEventListeners();
            this.setupTheme();
            this.populateDatabase();
            this.showToast('應用載入完成', 'success');
            console.log('✅ 應用初始化完成');
        } catch (error) {
            console.error('❌ 初始化錯誤:', error);
            this.showToast('應用載入失敗', 'error');
        }
    }
    
    setupEventListeners() {
        console.log('設置事件監聽器...');
        
        // Navigation - using event delegation to ensure it works
        this.setupNavigation();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Theme toggle
        this.setupThemeToggle();
        
        // Tab switching - fixed implementation
        this.setupTabs();
        
        // Database controls
        this.setupDatabaseControls();
        
        // Generator
        this.setupGenerator();
        
        // Global event delegation
        this.setupGlobalEvents();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('✅ 事件監聽器設置完成');
    }
    
    setupNavigation() {
        console.log('設置導航...');
        
        // Use event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Desktop navigation
            if (e.target.matches('.nav-item[data-section]')) {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                console.log('Desktop nav clicked:', section);
                this.navigateToSection(section);
                return;
            }
            
            // Mobile navigation
            if (e.target.matches('.mobile-nav-item[data-section]')) {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                console.log('Mobile nav clicked:', section);
                this.navigateToSection(section);
                this.closeMobileMenu();
                return;
            }
            
            // Hero buttons
            if (e.target.matches('[data-action]')) {
                e.preventDefault();
                const action = e.target.getAttribute('data-action');
                console.log('Action button clicked:', action);
                if (action === 'start') {
                    this.navigateToSection('features');
                } else if (action === 'examples') {
                    this.navigateToSection('examples');
                }
                return;
            }
            
            // Feature cards navigation
            if (e.target.matches('.feature-card') || e.target.closest('.feature-card')) {
                e.preventDefault();
                const card = e.target.matches('.feature-card') ? e.target : e.target.closest('.feature-card');
                const index = Array.from(card.parentNode.children).indexOf(card);
                const sections = ['features', 'database', 'generator'];
                if (sections[index]) {
                    console.log('Feature card clicked, navigating to:', sections[index]);
                    this.navigateToSection(sections[index]);
                }
                return;
            }
        });
        
        console.log('✅ 導航設置完成');
    }
    
    setupMobileMenu() {
        console.log('設置手機選單...');
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile menu button clicked');
                this.toggleMobileMenu();
            });
        }
        
        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Close mobile menu clicked');
                this.closeMobileMenu();
            });
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile overlay clicked');
                this.closeMobileMenu();
            });
        }
        
        console.log('✅ 手機選單設置完成');
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }
    
    setupTheme() {
        // Initialize theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        let theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setupTabs() {
        console.log('設置標籤頁...');
        
        // Use event delegation for tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn[data-tab]')) {
                e.preventDefault();
                const tab = e.target.getAttribute('data-tab');
                console.log('Tab clicked:', tab);
                this.switchTab(tab);
            }
        });
        
        console.log('✅ 標籤頁設置完成');
    }
    
    setupDatabaseControls() {
        console.log('設置資料庫控制項...');
        
        // Search - use event delegation
        document.addEventListener('input', (e) => {
            if (e.target.matches('#databaseSearch')) {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            }
        });
        
        // Filter tabs - use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-tab[data-filter]')) {
                e.preventDefault();
                const filter = e.target.getAttribute('data-filter');
                console.log('Filter clicked:', filter);
                this.filterDatabase(filter);
                this.updateFilterTabs(filter);
            }
        });
        
        console.log('✅ 資料庫控制項設置完成');
    }
    
    setupGenerator() {
        console.log('設置生成器...');
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('#generatePrompt')) {
                e.preventDefault();
                this.generatePrompt();
            } else if (e.target.matches('#clearForm')) {
                e.preventDefault();
                this.clearGeneratorForm();
            } else if (e.target.matches('#copyResult')) {
                e.preventDefault();
                this.copyGeneratedPrompt();
            } else if (e.target.matches('#favoriteResult')) {
                e.preventDefault();
                this.favoriteGeneratedPrompt();
            }
        });
        
        console.log('✅ 生成器設置完成');
    }
    
    setupGlobalEvents() {
        // Event delegation for dynamic content
        document.addEventListener('click', (e) => {
            // Copy buttons
            if (e.target.matches('.copy-btn') || e.target.closest('.copy-btn')) {
                e.preventDefault();
                const btn = e.target.matches('.copy-btn') ? e.target : e.target.closest('.copy-btn');
                const text = btn.getAttribute('data-copy');
                if (text) {
                    this.copyToClipboard(text);
                }
                return;
            }
            
            // Favorite buttons
            if (e.target.matches('.favorite-btn')) {
                e.preventDefault();
                this.toggleFavorite(e.target);
                return;
            }
            
            // Toast close
            if (e.target.matches('.toast__close')) {
                e.preventDefault();
                this.hideToast();
                return;
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('databaseSearch');
                if (searchInput && this.currentSection === 'database') {
                    searchInput.focus();
                }
            }
            
            // Escape to close mobile menu
            if (e.key === 'Escape') {
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
                this.hideToast();
            }
            
            // Number keys for quick navigation
            const numberKeys = ['1', '2', '3', '4', '5', '6'];
            const sections = ['home', 'features', 'examples', 'database', 'generator', 'tutorial'];
            
            if (numberKeys.includes(e.key) && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                if (sections[index]) {
                    this.navigateToSection(sections[index]);
                }
            }
        });
    }
    
    navigateToSection(sectionId) {
        console.log(`🧭 導航至: ${sectionId}`);
        
        try {
            // Validate section exists
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                console.error(`Section not found: ${sectionId}`);
                this.showToast('頁面載入失敗', 'error');
                return;
            }
            
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Update navigation states
            this.updateNavigationState(sectionId);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Section-specific actions
            if (sectionId === 'database' && !this.databasePopulated) {
                setTimeout(() => this.populateDatabase(), 100);
            }
            
            console.log(`✅ 成功導航至: ${sectionId}`);
            
        } catch (error) {
            console.error('導航錯誤:', error);
            this.showToast('導航失敗', 'error');
        }
    }
    
    updateNavigationState(activeSection) {
        // Desktop navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection) {
                item.classList.add('active');
            }
        });
        
        // Mobile navigation
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection) {
                item.classList.add('active');
            }
        });
    }
    
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        console.log('Mobile menu toggle:', this.mobileMenuOpen);
        
        if (this.mobileMenuOpen) {
            if (mobileMenu) mobileMenu.classList.add('active');
            if (mobileOverlay) {
                mobileOverlay.classList.add('active');
                mobileOverlay.classList.remove('hidden');
            }
            document.body.style.overflow = 'hidden';
        } else {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
                setTimeout(() => {
                    mobileOverlay.classList.add('hidden');
                }, 300);
            }
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        this.mobileMenuOpen = false;
        
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
            setTimeout(() => {
                mobileOverlay.classList.add('hidden');
            }, 300);
        }
        document.body.style.overflow = '';
        
        console.log('Mobile menu closed');
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        this.showToast(`已切換至${newTheme === 'dark' ? '深色' : '淺色'}主題`, 'info');
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    switchTab(tabId) {
        console.log(`切換標籤: ${tabId}`);
        
        try {
            // Update tab buttons
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-tab') === tabId) {
                    btn.classList.add('active');
                }
            });
            
            // Update tab panels
            const tabPanels = document.querySelectorAll('.tab-panel');
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                this.currentTab = tabId;
                console.log(`✅ 標籤切換成功: ${tabId}`);
            } else {
                console.error(`Tab panel not found: ${tabId}`);
            }
        } catch (error) {
            console.error('標籤切換錯誤:', error);
        }
    }
    
    populateDatabase() {
        const container = document.getElementById('databaseContent');
        if (!container) {
            console.warn('Database container not found');
            return;
        }
        
        if (this.databasePopulated) {
            console.log('Database already populated');
            return;
        }
        
        console.log('填充提示詞資料庫...');
        
        const promptsData = this.getPromptsData();
        container.innerHTML = '';
        
        promptsData.forEach((category, categoryIndex) => {
            category.prompts.forEach((prompt, promptIndex) => {
                const card = this.createPromptCard(prompt, category.id, `${categoryIndex}-${promptIndex}`);
                container.appendChild(card);
            });
        });
        
        this.databasePopulated = true;
        console.log('✅ 資料庫填充完成');
    }
    
    createPromptCard(prompt, categoryId, cardId) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.setAttribute('data-category', categoryId);
        card.setAttribute('data-id', cardId);
        
        const isFavorited = this.favorites.includes(prompt.content);
        
        card.innerHTML = `
            <div class="prompt-card__category">${this.getCategoryName(categoryId)}</div>
            <div class="prompt-card__title">${prompt.title}</div>
            <div class="prompt-card__content">${this.escapeHtml(prompt.content)}</div>
            <div class="prompt-card__tags">
                ${prompt.tags ? prompt.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                <span class="difficulty-badge difficulty-badge--${this.getDifficultyClass(prompt.difficulty)}">${prompt.difficulty}</span>
            </div>
            <div class="prompt-card__actions">
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline copy-btn" data-copy="${this.escapeHtml(prompt.content)}">複製</button>
                    <button class="btn btn--sm btn--outline favorite-btn ${isFavorited ? 'active' : ''}" data-prompt="${this.escapeHtml(prompt.content)}">
                        ${isFavorited ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    filterDatabase(filter) {
        this.currentFilter = filter;
        const cards = document.querySelectorAll('.prompt-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`篩選結果: ${filter}, 顯示 ${visibleCount} 項`);
    }
    
    updateFilterTabs(activeFilter) {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-filter') === activeFilter) {
                tab.classList.add('active');
            }
        });
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.filterDatabase(this.currentFilter);
            return;
        }
        
        console.log(`搜尋: "${query}"`);
        
        const cards = document.querySelectorAll('.prompt-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.prompt-card__title')?.textContent || '';
            const content = card.querySelector('.prompt-card__content')?.textContent || '';
            const category = card.querySelector('.prompt-card__category')?.textContent || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent).join(' ');
            
            const searchText = `${title} ${content} ${category} ${tags}`.toLowerCase();
            const shouldShow = searchText.includes(query.toLowerCase());
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`搜尋結果: ${visibleCount} 項`);
        
        if (visibleCount === 0) {
            this.showToast(`沒有找到「${query}」相關的結果`, 'info');
        }
    }
    
    generatePrompt() {
        const inputs = {
            subject: document.getElementById('subject')?.value.trim() || '',
            composition: document.getElementById('composition')?.value.trim() || '',
            action: document.getElementById('action')?.value.trim() || '',
            location: document.getElementById('location')?.value.trim() || '',
            style: document.getElementById('style')?.value.trim() || '',
            editing: document.getElementById('editing')?.value.trim() || ''
        };
        
        // Check if at least one field is filled
        const hasContent = Object.values(inputs).some(value => value);
        
        if (!hasContent) {
            this.showToast('請至少填寫一個欄位', 'warning');
            return;
        }
        
        // Generate prompt
        const promptParts = [];
        
        if (inputs.subject) promptParts.push(inputs.subject);
        if (inputs.composition) promptParts.push(`構圖：${inputs.composition}`);
        if (inputs.action) promptParts.push(`動作：${inputs.action}`);
        if (inputs.location) promptParts.push(`地點：${inputs.location}`);
        if (inputs.style) promptParts.push(`風格：${inputs.style}`);
        if (inputs.editing) promptParts.push(`編輯指令：${inputs.editing}`);
        
        const generatedPrompt = promptParts.join('，');
        
        // Display result
        const resultDisplay = document.getElementById('generatedPrompt');
        const resultActions = document.getElementById('resultActions');
        
        if (resultDisplay) {
            resultDisplay.innerHTML = `<div class="generated-content">${this.escapeHtml(generatedPrompt)}</div>`;
            resultDisplay.setAttribute('data-prompt', generatedPrompt);
        }
        
        if (resultActions) {
            resultActions.classList.remove('hidden');
        }
        
        this.showToast('提示詞生成完成', 'success');
        console.log('生成提示詞:', generatedPrompt);
    }
    
    clearGeneratorForm() {
        const inputs = ['subject', 'composition', 'action', 'location', 'style', 'editing'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        
        const resultDisplay = document.getElementById('generatedPrompt');
        const resultActions = document.getElementById('resultActions');
        
        if (resultDisplay) {
            resultDisplay.innerHTML = `
                <div class="empty-result">
                    <div class="empty-icon">✨</div>
                    <div class="empty-text">填寫表單後點擊「生成提示詞」即可生成專業提示詞</div>
                </div>
            `;
            resultDisplay.removeAttribute('data-prompt');
        }
        
        if (resultActions) {
            resultActions.classList.add('hidden');
        }
        
        this.showToast('表單已清空', 'info');
    }
    
    copyGeneratedPrompt() {
        const resultDisplay = document.getElementById('generatedPrompt');
        const prompt = resultDisplay?.getAttribute('data-prompt');
        
        if (prompt) {
            this.copyToClipboard(prompt);
        } else {
            this.showToast('沒有內容可複製', 'warning');
        }
    }
    
    favoriteGeneratedPrompt() {
        const resultDisplay = document.getElementById('generatedPrompt');
        const prompt = resultDisplay?.getAttribute('data-prompt');
        
        if (prompt) {
            const isAlreadyFavorited = this.favorites.includes(prompt);
            
            if (isAlreadyFavorited) {
                this.removeFavorite(prompt);
                this.showToast('已從收藏中移除', 'info');
            } else {
                this.addFavorite(prompt);
                this.showToast('已加入收藏', 'success');
            }
            
            // Update button
            const favoriteBtn = document.getElementById('favoriteResult');
            if (favoriteBtn) {
                favoriteBtn.textContent = isAlreadyFavorited ? '🤍 收藏' : '❤️ 已收藏';
            }
        } else {
            this.showToast('沒有內容可收藏', 'warning');
        }
    }
    
    toggleFavorite(button) {
        const prompt = button.getAttribute('data-prompt');
        if (!prompt) return;
        
        const isFavorited = this.favorites.includes(prompt);
        
        if (isFavorited) {
            this.removeFavorite(prompt);
            button.textContent = '🤍';
            button.classList.remove('active');
            this.showToast('已從收藏中移除', 'info');
        } else {
            this.addFavorite(prompt);
            button.textContent = '❤️';
            button.classList.add('active');
            this.showToast('已加入收藏', 'success');
        }
    }
    
    addFavorite(prompt) {
        if (!this.favorites.includes(prompt)) {
            this.favorites.push(prompt);
            this.saveFavorites();
        }
    }
    
    removeFavorite(prompt) {
        const index = this.favorites.indexOf(prompt);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
        }
    }
    
    loadFavorites() {
        try {
            const saved = localStorage.getItem('nanoBanana_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('載入收藏失敗:', error);
            return [];
        }
    }
    
    saveFavorites() {
        try {
            localStorage.setItem('nanoBanana_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('儲存收藏失敗:', error);
        }
    }
    
    copyToClipboard(text) {
        if (!text) {
            this.showToast('沒有內容可複製', 'warning');
            return;
        }
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('已複製到剪貼簿', 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px;opacity:0;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast('已複製到剪貼簿', 'success');
            } else {
                this.showToast('複製失敗，請手動複製', 'error');
            }
        } catch (error) {
            this.showToast('複製失敗，請手動複製', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastIcon || !toastMessage) return;
        
        // Clear existing classes
        toast.className = 'toast';
        
        // Set icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toastIcon.textContent = icons[type] || icons.success;
        toastMessage.textContent = message;
        
        // Add type class
        if (type !== 'success') {
            toast.classList.add(type);
        }
        
        // Show toast
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.hideToast();
        }, 3000);
        
        console.log(`💬 ${type.toUpperCase()}: ${message}`);
    }
    
    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }
    }
    
    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getCategoryName(categoryId) {
        const names = {
            'basic': '基礎編輯',
            'advanced': '進階合成',
            'creative': '創意應用',
            'professional': '專業用途'
        };
        return names[categoryId] || categoryId;
    }
    
    getDifficultyClass(difficulty) {
        const classes = {
            '簡單': 'simple',
            '中等': 'medium',
            '困難': 'hard'
        };
        return classes[difficulty] || 'simple';
    }
    
    getPromptsData() {
        // Enhanced prompts data based on the provided JSON
        return [
            {
                id: 'basic',
                name: '基礎編輯',
                prompts: [
                    {
                        title: '背景替換',
                        content: '將場景換成在海邊、衣服換成藍色T恤、手上換成拿著小螃蟹',
                        difficulty: '簡單',
                        tags: ['背景', '場景', '服裝']
                    },
                    {
                        title: '服裝替換',
                        content: '換成休閒西裝照片(深藍色西裝外套,白色上衣)',
                        difficulty: '簡單',
                        tags: ['服裝', '西裝', '商務']
                    },
                    {
                        title: '光影調整',
                        content: '柔和的燈光、中性的背景、個人資料照片風格',
                        difficulty: '簡單',
                        tags: ['光影', '背景', '人像']
                    },
                    {
                        title: '表情調整',
                        content: '讓人物露出開心的表情，眼神自然，嘴角上揚',
                        difficulty: '簡單',
                        tags: ['表情', '人像', '情緒']
                    }
                ]
            },
            {
                id: 'advanced',
                name: '進階合成',
                prompts: [
                    {
                        title: '多圖融合',
                        content: '請將這些圖片融合成一張圖,每個物件和角色都不能缺漏',
                        difficulty: '中等',
                        tags: ['合成', '多圖', '融合']
                    },
                    {
                        title: '風格轉換',
                        content: '調整為黑白漫畫線稿，續上圖調整為俯瞰視角',
                        difficulty: '中等',
                        tags: ['風格', '漫畫', '視角']
                    },
                    {
                        title: '複雜場景合成',
                        content: '根據所提供的兩張上傳之參考圖,生成一位女孩在秋天傍晚穿上衣服的場景,她的臉部特徵,髮型,身材必須與第一張照片相同,寫實風格,8K 高畫質,電影感光影',
                        difficulty: '困難',
                        tags: ['場景', '合成', '電影感']
                    }
                ]
            },
            {
                id: 'creative',
                name: '創意應用',
                prompts: [
                    {
                        title: '擬真公仔製作',
                        content: '將圖片中的角色轉化為1/7比例的全身實體模型,放置在一個圓形塑膠底座上,底座上的PVC紋理清晰可見',
                        difficulty: '困難',
                        tags: ['公仔', '模型', '收藏']
                    },
                    {
                        title: '火柴人構圖',
                        content: '根據動作草圖來生成兩隻貓互相打鬥,並呈現賽博龐克風格',
                        difficulty: '中等',
                        tags: ['構圖', '動作', '風格']
                    },
                    {
                        title: '微縮場景',
                        content: '以清晰的45°俯視角度，展示一個等距微縮模型場景',
                        difficulty: '中等',
                        tags: ['微縮', '場景', '模型']
                    },
                    {
                        title: '毛絨公仔轉換',
                        content: '轉換成「毛絨玩具公仔」風格，材質柔軟可愛',
                        difficulty: '簡單',
                        tags: ['毛絨', '玩具', '可愛']
                    }
                ]
            },
            {
                id: 'professional',
                name: '專業用途',
                prompts: [
                    {
                        title: '品牌廣告設計',
                        content: '簡潔而富有創意的廣告，背景為乾淨的白色。真實的[產品]融入手繪黑色墨水塗鴉，線條流暢，趣味十足',
                        difficulty: '困難',
                        tags: ['廣告', '品牌', '設計']
                    },
                    {
                        title: '產品展示',
                        content: '高品質、富有電影感的產品展示，使用自然光或電影燈光來增強產品的吸引力',
                        difficulty: '中等',
                        tags: ['產品', '展示', '商業']
                    },
                    {
                        title: '商務人像',
                        content: '攝影棚燈光，背景為灰色中性色調，柔和的燈光營造專業氛圍',
                        difficulty: '簡單',
                        tags: ['商務', '人像', '專業']
                    },
                    {
                        title: '產品原樣保持',
                        content: '請按原樣使用上傳的產品圖片，請勿修改、重繪或重新詮釋其任何部分',
                        difficulty: '簡單',
                        tags: ['產品', '原樣', '保持']
                    }
                ]
            }
        ];
    }
}

// Initialize the application
console.log('🚀 正在載入 Nano Banana Guide...');

// Ensure DOM is ready before initialization
let app;

function initializeApp() {
    try {
        app = new NanoBananaGuide();
        window.nanoBananaApp = app;
        console.log('🎉 Nano Banana Guide 載入完成！');
    } catch (error) {
        console.error('❌ 應用載入失敗:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 320px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">❌ 載入錯誤</div>
            <div style="margin-bottom: 12px;">應用載入失敗，請重新整理頁面</div>
            <button onclick="location.reload()" style="
                background: white; 
                color: #ff4444; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 14px;
            ">重新載入</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    setTimeout(initializeApp, 50);
}