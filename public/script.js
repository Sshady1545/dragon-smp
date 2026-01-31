// ========================================
// MAIN INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeCopyFunctions();
    initializeModalButtons();
    checkServerStatus();
    initializeSmoothScrolling();
    
    // Check server status every 30 seconds
    setInterval(checkServerStatus, 30000);
});

// ========================================
// MINECRAFT SERVER STATUS API
// ========================================
async function checkServerStatus() {
    const serverIP = 'dragonsmp.shock.gg';
    const statusElement = document.getElementById('server-status');
    const statusDot = statusElement.querySelector('.status-dot');
    const statusText = statusElement.querySelector('.status-text');
    const playerCount = document.getElementById('player-count');
    
    try {
        // Using Minecraft Server Status API
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIP}`);
        const data = await response.json();
        
        if (data.online) {
            // Server is online
            statusDot.classList.remove('offline');
            statusText.textContent = 'SUNUCU AKTİF';
            
            // Show player count
            const online = data.players.online || 0;
            const max = data.players.max || 0;
            playerCount.textContent = `${online}/${max}`;
            playerCount.style.display = 'inline';
            
            // Animate the count
            animateNumber(playerCount, 0, online, 1000);
            
        } else {
            // Server is offline
            statusDot.classList.add('offline');
            statusText.textContent = 'SUNUCU ÇEVRİMDIŞI';
            playerCount.style.display = 'none';
        }
    } catch (error) {
        console.error('Sunucu durumu alınamadı:', error);
        statusDot.classList.add('offline');
        statusText.textContent = 'DURUM BİLİNMİYOR';
        playerCount.style.display = 'none';
    }
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        const max = element.textContent.split('/')[1];
        element.textContent = `${Math.floor(current)}/${max}`;
    }, 16);
}

// ========================================
// ANIMATED PARTICLES BACKGROUND
// ========================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = (Math.random() - 0.5) * 100;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255, 26, 26, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        left: ${startX}%;
        top: ${startY}%;
        animation: float-particle-${index} ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;
    
    // Create unique animation for each particle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle-${index} {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            50% {
                transform: translate(${moveX}px, ${moveY}px) scale(1.5);
                opacity: 1;
            }
            90% {
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(particle);
}

// ========================================
// IP COPY FUNCTIONALITY
// ========================================
function initializeCopyFunctions() {
    const serverIP = "dragonsmp.shock.gg";
    
    // Main IP container
    const copyIpBtn = document.getElementById('copy-ip');
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', () => {
            copyToClipboard(serverIP, "IP ADRESİ KOPYALANDI!");
            addClickEffect(copyIpBtn);
        });
    }
    
    // Join card IP
    const copyIpBtn2 = document.getElementById('copy-ip-2');
    if (copyIpBtn2) {
        copyIpBtn2.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(serverIP, "IP ADRESİ KOPYALANDI!");
            addClickEffect(copyIpBtn2);
        });
    }
}

function copyToClipboard(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast(message || "Kopyalandı!", "IP adresi panoya kopyalandı");
            })
            .catch(err => {
                console.error('Kopyalama hatası:', err);
                fallbackCopy(text, message);
            });
    } else {
        fallbackCopy(text, message);
    }
}

function fallbackCopy(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast(message || "Kopyalandı!", "IP adresi panoya kopyalandı");
    } catch (err) {
        showToast("Kopyalama başarısız!", "Lütfen manuel olarak kopyalayın");
    }
    
    document.body.removeChild(textArea);
}

// ========================================
// MODAL/COMING SOON BUTTONS
// ========================================
function initializeModalButtons() {
    const comingSoonCards = document.querySelectorAll('[data-modal]');
    
    comingSoonCards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-modal');
            const featureName = feature === 'store' ? 'STORE' : 'İSTATİSTİKLER';
            showToast(`${featureName} YAKINDA!`, "Bu özellik çok yakında aktif olacak");
            addClickEffect(card);
        });
    });
}

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================
let toastTimeout;

function showToast(title, description) {
    const toast = document.getElementById('toast');
    const titleElement = document.getElementById('toast-msg');
    const descElement = toast.querySelector('.toast-desc');
    
    if (!toast || !titleElement) return;
    
    // Clear existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Update content
    titleElement.textContent = title;
    if (descElement) {
        descElement.textContent = description || '';
    }
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Add entrance animation
    toast.style.animation = 'none';
    setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
    
    // Auto hide after 3 seconds
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('hidden');
    }
}

// Add toast animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastSlideUp {
        from {
            transform: translateX(-50%) translateY(20px) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(toastStyle);

// ========================================
// CLICK RIPPLE EFFECT
// ========================================
function addClickEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 26, 26, 0.5);
        width: 20px;
        height: 20px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// SMOOTH SCROLLING
// ========================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
    // Press 'C' to copy IP
    if (e.key === 'c' || e.key === 'C') {
        if (!e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                copyToClipboard("dragonsmp.shock.gg", "IP ADRESİ KOPYALANDI!");
            }
        }
    }
    
    // Press 'ESC' to close toast
    if (e.key === 'Escape') {
        hideToast();
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log('%c🐲 DragonSMP', 'font-size: 40px; font-weight: bold; color: #ff1a1a;');
console.log('%cHoş geldin geliştirici!', 'font-size: 16px; color: #fff;');
console.log('%cdragonsmp.shock.gg adresinden bize katıl!', 'font-size: 14px; color: #888;');

// ========================================
// SERVICE WORKER (Optional - for PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js');
    });
}