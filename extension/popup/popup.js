document.addEventListener('DOMContentLoaded', function() {
    const ghostToggle = document.getElementById('ghostToggle');
    const ghostLevel = document.getElementById('ghostLevel');
    const testBtn = document.getElementById('testBtn');
    const exorciseBtn = document.getElementById('exorciseBtn');
    const ghostStatus = document.getElementById('ghostStatus');
    const videoStatus = document.getElementById('videoStatus');
    const toggleText = document.getElementById('toggleText');
    const stats = document.getElementById('stats');
    
    loadCurrentStatus();
    
    ghostToggle.addEventListener('change', toggleGhost);
    ghostLevel.addEventListener('change', changeGhostLevel);
    testBtn.addEventListener('click', testEffect);
    exorciseBtn.addEventListener('click', exorciseGhost);
    
    function loadCurrentStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
                    if (response) {
                        updateUI(response);
                    } else {
                        showErrorState();
                    }
                });
            } else {
                showErrorState();
            }
        });
    }
    
    function updateUI(status) {
        ghostToggle.checked = status.active;
        ghostLevel.value = status.level;
        
        if (status.active) {
            ghostStatus.textContent = 'АКТИВЕН';
            ghostStatus.className = 'ghost-status status-active';
            toggleText.textContent = 'Включен';
        } else {
            ghostStatus.textContent = 'ВЫКЛЮЧЕН';
            ghostStatus.className = 'ghost-status status-inactive';
            toggleText.textContent = 'Выключен';
        }
        
        videoStatus.textContent = `Найдено видео: ${status.videosFound}`;
        stats.textContent = `Эффектов вызвано: ${status.hauntCount || 0}`;
    }
    
    function showErrorState() {
        videoStatus.textContent = 'Обновите страницу для активации';
        ghostStatus.textContent = 'НЕАКТИВЕН';
        ghostStatus.className = 'ghost-status status-inactive';
        toggleText.textContent = 'Выключен';
        ghostToggle.checked = false;
        stats.textContent = 'Эффектов вызвано: 0';
    }
    
    function toggleGhost() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleGhost',
                    active: ghostToggle.checked
                }, function(response) {
                    if (response && response.success) {
                        loadCurrentStatus();
                    }
                });
            }
        });
    }
    
    function changeGhostLevel() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setGhostLevel', 
                    level: ghostLevel.value
                }, function(response) {
                    if (response && response.success) {
                        loadCurrentStatus();
                    }
                });
            }
        });
    }
    
    function testEffect() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'testEffect'}, function(response) {
                    if (response && response.success) {
                        setTimeout(loadCurrentStatus, 500);
                    }
                });
            }
        });
    }
    
    function exorciseGhost() {
        ghostToggle.checked = false;
        toggleGhost();
        
        setTimeout(() => {
            ghostToggle.checked = true;
            toggleGhost();
        }, 10 * 60 * 1000);
        
        alert('Призрак изгнан на 10 минут! 👻➡️🚪');
    }
    
    setInterval(loadCurrentStatus, 2000);
});