console.log('Ghost Video Companion loaded!');

class VideoGhost {
    constructor() {
        this.isActive = true;
        this.hauntInterval = null;
        this.ghostLevel = 'medium';
        this.hauntCount = 0;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.startHaunting();
        this.setupMessageListener();
        
        console.log('Ghost initialized and ready to haunt videos!');
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('ghostSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.isActive = settings.isActive !== false;
                this.ghostLevel = settings.ghostLevel || 'medium';
            }
        } catch (e) {
            console.log('Using default ghost settings');
        }
    }
    
    saveSettings() {
        const settings = {
            isActive: this.isActive,
            ghostLevel: this.ghostLevel,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('ghostSettings', JSON.stringify(settings));
    }
    
    startHaunting() {
        if (this.hauntInterval) {
            clearInterval(this.hauntInterval);
        }
        
        const intervals = {
            low: 120000,
            medium: 60000,
            high: 30000
        };
        
        this.hauntInterval = setInterval(() => {
            if (this.isActive) {
                this.hauntRandomVideo();
            }
        }, intervals[this.ghostLevel]);
    }
    
    findVideos() {
        return Array.from(document.querySelectorAll('video'));
    }
    
    hauntRandomVideo() {
        const videos = this.findVideos();
        const playingVideos = videos.filter(v => !v.paused && !v.ended);
        
        if (playingVideos.length > 0) {
            const video = playingVideos[0];
            this.triggerGhostEvent(video);
            this.hauntCount++;
        }
    }
    
    triggerGhostEvent(video) {
        const events = [
            () => this.glitchEffect(video),
            () => this.ghostComment(),
            () => this.randomPause(video),
            () => this.volumeSpook(video),
            () => this.ghostFootprint(video),
            () => this.subtleDistortion(video)
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        randomEvent.call(this);
        
        console.log('Ghost event triggered!');
    }
    
    glitchEffect(video) {
        const glitch = document.createElement('div');
        glitch.className = 'ghost-glitch';
        glitch.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: 
                linear-gradient(45deg, 
                rgba(255, 0, 0, 0.1) 0%, 
                rgba(0, 255, 0, 0.1) 50%, 
                rgba(0, 0, 255, 0.1) 100%);
            mix-blend-mode: overlay;
            pointer-events: none;
            z-index: 2147483647;
            animation: ghostGlitch 1.5s ease-out;
        `;
        
        document.documentElement.appendChild(glitch);
        setTimeout(() => glitch.remove(), 1500);
    }
    
    ghostComment() {
        const comments = [
            "Сзади тебя...",
            "Не смотри наверх",
            "Этот актер мне нравился... до своей смерти",
            "22 августа все ближе и ближе",
            "Я бы на твоем месте не смотрел это один...",
        ];
        
        const comment = document.createElement('div');
        comment.className = 'ghost-comment';
        comment.textContent = comments[Math.floor(Math.random() * comments.length)];
        comment.style.cssText = `
            position: fixed;
            top: ${20 + Math.random() * 50}px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            padding: 12px 16px;
            border-radius: 12px;
            border: 2px solid #ff00ff;
            z-index: 2147483647;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            max-width: 250px;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
            animation: ghostCommentFade 6s ease-in-out forwards;
        `;
        
        document.documentElement.appendChild(comment);
        setTimeout(() => comment.remove(), 6000);
    }
    
    randomPause(video) {
        if (!video.paused && !video.ended) {
            video.pause();
            setTimeout(() => {
                if (!video.ended) video.play();
            }, 2000 + Math.random() * 3000);
        }
    }
    
    volumeSpook(video) {
        const originalVolume = video.volume;
        video.volume = 0.1;
        
        setTimeout(() => {
            video.volume = Math.min(originalVolume + 0.1, 1.0);
        }, 3000);
    }
    
    ghostFootprint(video) {
        const rect = video.getBoundingClientRect();
        const footprint = document.createElement('div');
        footprint.innerHTML = '👻';
        footprint.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            font-size: 24px;
            z-index: 2147483646;
            animation: ghostFootprint 8s ease-out forwards;
            pointer-events: none;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
        `;
        
        document.documentElement.appendChild(footprint);
        setTimeout(() => footprint.remove(), 8000);
    }
    
    subtleDistortion(video) {
        video.style.filter = 'hue-rotate(180deg) contrast(1.5)';
        setTimeout(() => {
            video.style.filter = '';
        }, 3000);
    }
    
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            try {
                switch (request.action) {
                    case 'toggleGhost':
                        this.isActive = request.active;
                        this.saveSettings();
                        sendResponse({success: true, active: this.isActive});
                        break;
                        
                    case 'setGhostLevel':
                        this.ghostLevel = request.level;
                        this.saveSettings();
                        this.startHaunting();
                        sendResponse({success: true, level: this.ghostLevel});
                        break;
                        
                    case 'testEffect':
                        const videos = this.findVideos();
                        if (videos.length > 0) {
                            this.triggerGhostEvent(videos[0]);
                        }
                        sendResponse({success: true});
                        break;
                        
                    case 'getStatus':
                        sendResponse({
                            active: this.isActive,
                            level: this.ghostLevel,
                            videosFound: this.findVideos().length,
                            hauntCount: this.hauntCount
                        });
                        break;
                        
                    default:
                        sendResponse({success: false, error: 'Unknown action'});
                }
            } catch (error) {
                sendResponse({success: false, error: error.message});
            }
            
            return true;
        });
    }
    
    destroy() {
        if (this.hauntInterval) {
            clearInterval(this.hauntInterval);
            this.hauntInterval = null;
        }
        console.log('Ghost has been exorcised!');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.videoGhost = new VideoGhost();
    });
} else {
    window.videoGhost = new VideoGhost();
}