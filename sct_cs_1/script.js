document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messageInput = document.getElementById('message');
    const shiftInput = document.getElementById('shift');
    const resultOutput = document.getElementById('result');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const decreaseShiftBtn = document.getElementById('decrease-shift');
    const increaseShiftBtn = document.getElementById('increase-shift');
    const infoSection = document.querySelector('.info-section');
    const infoToggle = document.querySelector('.info-toggle');
    const outerWheel = document.querySelector('.outer-wheel');
    const innerWheel = document.querySelector('.inner-wheel');
    
    // Initialize cipher wheels
    initCipherWheels();
    
    // Event Listeners
    encryptBtn.addEventListener('click', () => processText('encrypt'));
    decryptBtn.addEventListener('click', () => processText('decrypt'));
    copyBtn.addEventListener('click', copyResult);
    clearBtn.addEventListener('click', clearAll);
    decreaseShiftBtn.addEventListener('click', () => adjustShift(-1));
    increaseShiftBtn.addEventListener('click', () => adjustShift(1));
    infoToggle.addEventListener('click', toggleInfo);
    shiftInput.addEventListener('input', updateCipherWheel);
    
    // Functions
    function processText(action) {
        const message = messageInput.value;
        const shift = parseInt(shiftInput.value);
        
        if (!message) {
            showNotification('Please enter a message', 'warning');
            return;
        }
        
        if (isNaN(shift) || shift < 1 || shift > 25) {
            showNotification('Shift must be between 1 and 25', 'warning');
            return;
        }
        
        let result = '';
        
        if (action === 'encrypt') {
            result = caesarCipher(message, shift);
            showNotification('Message encrypted!', 'success');
        } else {
            result = caesarCipher(message, 26 - shift); // 26 - shift for decryption
            showNotification('Message decrypted!', 'success');
        }
        
        // Animate the result appearing
        resultOutput.value = '';
        animateTyping(result, resultOutput);
    }
    
    function caesarCipher(text, shift) {
        return text.split('').map(char => {
            // Process uppercase letters
            if (char.match(/[A-Z]/)) {
                const code = char.charCodeAt(0);
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            // Process lowercase letters
            else if (char.match(/[a-z]/)) {
                const code = char.charCodeAt(0);
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            // Return unchanged for non-alphabetic characters
            return char;
        }).join('');
    }
    
    function copyResult() {
        if (!resultOutput.value) {
            showNotification('Nothing to copy', 'warning');
            return;
        }
        
        resultOutput.select();
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    }
    
    function clearAll() {
        messageInput.value = '';
        resultOutput.value = '';
        shiftInput.value = 3;
        updateCipherWheel();
        showNotification('All cleared!', 'info');
    }
    
    function adjustShift(amount) {
        let currentShift = parseInt(shiftInput.value) || 0;
        currentShift += amount;
        
        // Keep within bounds
        if (currentShift < 1) currentShift = 1;
        if (currentShift > 25) currentShift = 25;
        
        shiftInput.value = currentShift;
        updateCipherWheel();
    }
    
    function toggleInfo() {
        infoSection.classList.toggle('active');
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function animateTyping(text, element, speed = 30) {
        let i = 0;
        const interval = setInterval(() => {
            element.value += text.charAt(i);
            i++;
            if (i > text.length - 1) {
                clearInterval(interval);
            }
        }, speed);
    }
    
    function initCipherWheels() {
        // Create alphabet letters for outer wheel (plaintext)
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i); // A-Z
            const angle = (i * 360 / 26) - 90; // Start from top (90 degrees offset)
            
            const outerLetter = document.createElement('div');
            outerLetter.className = 'wheel-letter outer-letter';
            outerLetter.textContent = letter;
            outerLetter.style.transform = `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
            
            outerWheel.appendChild(outerLetter);
        }
        
        // Update inner wheel based on current shift
        updateCipherWheel();
    }
    
    function updateCipherWheel() {
        // Clear existing inner wheel letters
        while (innerWheel.firstChild) {
            innerWheel.removeChild(innerWheel.firstChild);
        }
        
        const shift = parseInt(shiftInput.value) || 3;
        
        // Create alphabet letters for inner wheel (ciphertext)
        for (let i = 0; i < 26; i++) {
            const letterIndex = (i + shift) % 26;
            const letter = String.fromCharCode(65 + letterIndex); // A-Z shifted
            const angle = (i * 360 / 26) - 90; // Start from top (90 degrees offset)
            
            const innerLetter = document.createElement('div');
            innerLetter.className = 'wheel-letter inner-letter';
            innerLetter.textContent = letter;
            innerLetter.style.transform = `rotate(${angle}deg) translate(75px) rotate(-${angle}deg)`;
            
            innerWheel.appendChild(innerLetter);
        }
        
        // Animate the inner wheel rotation
        innerWheel.style.transform = `rotate(${shift * (360/26)}deg)`;
    }
});