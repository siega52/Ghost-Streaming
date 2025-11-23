document.addEventListener('DOMContentLoaded', function() {
    const ghostToggle = document.getElementById('ghostToggle');
    const ghostLevel = document.getElementById('ghostLevel');
    const testBtn = document.getElementById('testBtn');
    const exorciseBtn = document.getElementById('exorciseBtn');
    const ghostStatus = document.getElementById('ghostStatus');
    const videoStatus = document.getElementById('videoStatus');
    const toggleText = document.getElementById('toggleText');
    const stats = document.getElementById('stats');
    
    const defaultSettings = {
        ghostEnabled: true,
        ghostLevel: 'medium'
    };
    
    loadSettings();
    
    loadCurrentStatus();
    
    ghostToggle.addEventListener('change', toggleGhost);
    ghostLevel.addEventListener('change', changeGhostLevel);
    testBtn.addEventListener('click', testEffect);
    exorciseBtn.addEventListener('click', exorciseGhost);
    
    function loadSettings() {
        try {
            const saved = localStorage.getItem('ghostPopupSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                ghostToggle.checked = settings.ghostEnabled !== false;
                ghostLevel.value = settings.ghostLevel || 'medium';
            } else {
                ghostToggle.checked = defaultSettings.ghostEnabled;
                ghostLevel.value = defaultSettings.ghostLevel;
            }
        } catch (e) {
            ghostToggle.checked = defaultSettings.ghostEnabled;
            ghostLevel.value = defaultSettings.ghostLevel;
        }
        
        updateUIStatus(ghostToggle.checked, ghostLevel.value);
    }
    
    function saveSettings() {
        const settings = {
            ghostEnabled: ghostToggle.checked,
            ghostLevel: ghostLevel.value,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('ghostPopupSettings', JSON.stringify(settings));
        } catch (e) {
            console.log('Cannot save settings to localStorage');
        }
    }
    
    function loadCurrentStatus() {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs && tabs.length > 0 && tabs[0].id) {
                    const tabId = tabs[0].id;
                    
                    chrome.tabs.sendMessage(tabId, {action: 'getStatus'}, function(response) {
                        if (chrome.runtime.lastError) {
                            showErrorState('Откройте страницу с видео и обновите её');
                        } else if (response) {
                            updateUI(response);
                        } else {
                            showErrorState('Расширение не активировано на этой странице');
                        }
                    });
                } else {
                    showErrorState('Не удалось получить активную вкладку');
                }
            });
        } else {
            showDemoState();
        }
    }
    
    function updateUI(status) {
        if (status && typeof status.active !== 'undefined') {
            ghostToggle.checked = status.active;
            ghostLevel.value = status.level;
            
            updateUIStatus(status.active, status.level);
            
            videoStatus.textContent = `Найдено видео: ${status.videosFound}`;
            stats.textContent = `Эффектов вызвано: ${status.hauntCount || 0}`;
        }
    }
    
    function updateUIStatus(isActive, level) {
        if (isActive) {
            ghostStatus.textContent = 'АКТИВЕН';
            ghostStatus.className = 'ghost-status status-active';
            toggleText.textContent = 'Включен';
        } else {
            ghostStatus.textContent = 'ВЫКЛЮЧЕН';
            ghostStatus.className = 'ghost-status status-inactive';
            toggleText.textContent = 'Выключен';
        }
        
        ghostLevel.value = level;
    }
    
    function showErrorState(message) {
        videoStatus.textContent = message;
        ghostStatus.textContent = 'НЕАКТИВЕН';
        ghostStatus.className = 'ghost-status status-inactive';
        toggleText.textContent = 'Выключен';
        stats.textContent = 'Эффектов вызвано: 0';
    }
    
    function showDemoState() {
        videoStatus.textContent = 'Демо-режим (тестирование в браузере)';
        ghostStatus.textContent = 'ДЕМО';
        ghostStatus.className = 'ghost-status status-active';
        stats.textContent = 'Эффектов вызвано: ?';
    }
    
    function toggleGhost() {
        const isActive = ghostToggle.checked;
        
        saveSettings();
        
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs && tabs.length > 0 && tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleGhost',
                        active: isActive
                    });
                }
            });
        }
        
        updateUIStatus(isActive, ghostLevel.value);
    }
    
    function changeGhostLevel() {
        const level = ghostLevel.value;
        
        saveSettings();
        
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs && tabs.length > 0 && tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'setGhostLevel', 
                        level: level
                    });
                }
            });
        }
        
        updateUIStatus(ghostToggle.checked, level);
    }
    
    function testEffect() {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs && tabs.length > 0 && tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'testEffect'}, function(response) {
                        if (!chrome.runtime.lastError) {
                            setTimeout(loadCurrentStatus, 1000);
                        }
                    });
                }
            });
        } else {
            alert('В демо-режиме тестирование эффектов недоступно. Установите расширение в браузер.');
        }
    }
    
    function exorciseGhost() {
        ghostToggle.checked = false;
        toggleGhost();
        
        setTimeout(() => {
            ghostToggle.checked = true;
            toggleGhost();
        }, 10 * 60 * 1000);
        
        alert('Призрак изгнан на 10 минут!');
    }
    
    setInterval(loadCurrentStatus, 3000);
});