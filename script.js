// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                animateNumber(target, 0, numericValue, isPercentage ? '%' : '+', 2000);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const cardsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardsObserver.observe(card);
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.05) translateY(-5px)' 
                : 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
        });
    });
    
    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});

// Helper function to animate numbers
function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add CSS for mobile navigation
const mobileNavStyles = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .nav-links.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Inject mobile navigation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavStyles;
document.head.appendChild(styleSheet);

// Global variables
let surveys = JSON.parse(localStorage.getItem('surveys')) || [];
let currentSurvey = null;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveSurveys() {
    localStorage.setItem('surveys', JSON.stringify(surveys));
}

function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
}

// Authentication functions
function signUp(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    
    // Simple validation
    if (!email || !password || !name) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showNotification('User already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the new user
    saveUser(newUser);
    
    showNotification('Account created successfully!');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function login(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Invalid email or password', 'error');
        return;
    }
    
    // Log in user
    saveUser(user);
    
    showNotification('Login successful!');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// Survey creation functionality
function openCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('show');
        resetCreateForm();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetCreateForm() {
    const form = document.getElementById('createSurveyForm');
    if (form) {
        form.reset();
        // Reset color picker
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.color-option[data-color="#2563eb"]').classList.add('active');
    }
}

function createSurvey(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const survey = {
        id: generateId(),
        title: formData.get('title') || 'Untitled Survey',
        category: formData.get('category') || 'General',
        description: formData.get('description') || '',
        color: document.querySelector('.color-option.active')?.dataset.color || '#2563eb',
        fontSize: formData.get('fontSize') || '16px',
        borderRadius: formData.get('borderRadius') || '8px',
        questions: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        responses: []
    };
    
    surveys.push(survey);
    saveSurveys();
    
    closeModal('createModal');
    showNotification('Survey created successfully!');
    
    // Redirect to survey editor
    window.location.href = `survey-editor.html?id=${survey.id}`;
}

// QR Code generation
function generateQRCode(text) {
    // Using a simple QR code API (you can replace with a library like qrcode.js)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    return qrUrl;
}

function viewQR(surveyId) {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
        showNotification('Survey not found', 'error');
        return;
    }
    
    const surveyUrl = `${window.location.origin}/survey.html?id=${survey.id}`;
    const qrCodeUrl = generateQRCode(surveyUrl);
    
    const modal = document.getElementById('qrModal');
    if (modal) {
        const qrImage = modal.querySelector('.qr-code img');
        const surveyLink = modal.querySelector('.survey-link');
        
        if (qrImage) qrImage.src = qrCodeUrl;
        if (surveyLink) {
            surveyLink.textContent = surveyUrl;
            surveyLink.href = surveyUrl;
        }
        
        modal.classList.add('show');
    }
}

// Survey management
function loadSurveys() {
    const surveysGrid = document.querySelector('.surveys-grid');
    if (!surveysGrid) return;
    
    surveysGrid.innerHTML = '';
    
    surveys.forEach(survey => {
        const surveyCard = createSurveyCard(survey);
        surveysGrid.appendChild(surveyCard);
    });
}

function createSurveyCard(survey) {
    const card = document.createElement('div');
    card.className = 'survey-card';
    
    const responseCount = survey.responses ? survey.responses.length : 0;
    const daysAgo = Math.floor((Date.now() - new Date(survey.createdAt)) / (1000 * 60 * 60 * 24));
    
    card.innerHTML = `
        <div class="survey-header">
            <div>
                <h3 class="survey-title">${survey.title}</h3>
                <span class="survey-status status-${survey.status}">${survey.status}</span>
            </div>
        </div>
        
        <div class="survey-meta">
            <span><i class="fas fa-calendar"></i> Created ${daysAgo} days ago</span>
            <span><i class="fas fa-users"></i> ${responseCount} responses</span>
        </div>
        
        <div class="survey-actions">
            <a href="#" class="btn-action" onclick="viewQR('${survey.id}')">
                <i class="fas fa-qrcode"></i> QR Code
            </a>
            <a href="#" class="btn-action" onclick="viewAnalytics('${survey.id}')">
                <i class="fas fa-chart-bar"></i> Analytics
            </a>
            <a href="survey-editor.html?id=${survey.id}" class="btn-primary-action">
                <i class="fas fa-edit"></i> Edit
            </a>
        </div>
    `;
    
    return card;
}

function viewAnalytics(surveyId) {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
        showNotification('Survey not found', 'error');
        return;
    }
    
    // Redirect to analytics page
    window.location.href = `analytics.html?id=${survey.id}`;
}

// Color picker functionality
function initColorPicker() {
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Survey editor functionality
function loadSurveyEditor() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');
    
    if (!surveyId) {
        showNotification('No survey ID provided', 'error');
        return;
    }
    
    currentSurvey = surveys.find(s => s.id === surveyId);
    if (!currentSurvey) {
        showNotification('Survey not found', 'error');
        return;
    }
    
    // Load survey data into editor
    document.getElementById('surveyTitle').value = currentSurvey.title;
    document.getElementById('surveyDescription').value = currentSurvey.description;
    
    // Load questions
    loadQuestions();
}

function addQuestion(type) {
    if (!currentSurvey) return;
    
    const question = {
        id: generateId(),
        type: type,
        text: '',
        required: false,
        options: type === 'multiple_choice' || type === 'radio' ? [''] : [],
        min: 1,
        max: 10
    };
    
    currentSurvey.questions.push(question);
    saveSurveys();
    loadQuestions();
}

function removeQuestion(questionId) {
    if (!currentSurvey) return;
    
    currentSurvey.questions = currentSurvey.questions.filter(q => q.id !== questionId);
    saveSurveys();
    loadQuestions();
}

function loadQuestions() {
    const questionsContainer = document.getElementById('questionsContainer');
    if (!questionsContainer || !currentSurvey) return;
    
    questionsContainer.innerHTML = '';
    
    currentSurvey.questions.forEach((question, index) => {
        const questionElement = createQuestionElement(question, index);
        questionsContainer.appendChild(questionElement);
    });
}

function createQuestionElement(question, index) {
    const div = document.createElement('div');
    div.className = 'question-item';
    div.innerHTML = `
        <div class="question-header">
            <span class="question-number">Q${index + 1}</span>
            <span class="question-type">${getQuestionTypeName(question.type)}</span>
            <button type="button" class="btn-remove" onclick="removeQuestion('${question.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <input type="text" class="question-text" placeholder="Enter your question" 
               value="${question.text}" onchange="updateQuestion('${question.id}', 'text', this.value)">
        <div class="question-options">
            ${getQuestionOptions(question)}
        </div>
    `;
    
    return div;
}

function getQuestionTypeName(type) {
    const types = {
        'text': 'Text Input',
        'textarea': 'Long Text',
        'number': 'Number',
        'email': 'Email',
        'phone': 'Phone',
        'rating': 'Rating',
        'nps': 'NPS Score',
        'multiple_choice': 'Multiple Choice',
        'radio': 'Single Choice',
        'checkbox': 'Checkboxes'
    };
    return types[type] || type;
}

function getQuestionOptions(question) {
    switch (question.type) {
        case 'multiple_choice':
        case 'radio':
        case 'checkbox':
            return question.options.map((option, index) => `
                <div class="option-item">
                    <input type="text" value="${option}" 
                           onchange="updateOption('${question.id}', ${index}, this.value)"
                           placeholder="Option ${index + 1}">
                    <button type="button" onclick="removeOption('${question.id}', ${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('') + `
                <button type="button" class="btn-add-option" onclick="addOption('${question.id}')">
                    <i class="fas fa-plus"></i> Add Option
                </button>
            `;
        case 'rating':
            return `
                <div class="rating-options">
                    <label>Min: <input type="number" value="${question.min}" min="1" max="10" 
                           onchange="updateQuestion('${question.id}', 'min', this.value)"></label>
                    <label>Max: <input type="number" value="${question.max}" min="1" max="10" 
                           onchange="updateQuestion('${question.id}', 'max', this.value)"></label>
                </div>
            `;
        default:
            return '';
    }
}

function updateQuestion(questionId, field, value) {
    if (!currentSurvey) return;
    
    const question = currentSurvey.questions.find(q => q.id === questionId);
    if (question) {
        question[field] = value;
        saveSurveys();
    }
}

function addOption(questionId) {
    if (!currentSurvey) return;
    
    const question = currentSurvey.questions.find(q => q.id === questionId);
    if (question && (question.type === 'multiple_choice' || question.type === 'radio' || question.type === 'checkbox')) {
        question.options.push('');
        saveSurveys();
        loadQuestions();
    }
}

function removeOption(questionId, optionIndex) {
    if (!currentSurvey) return;
    
    const question = currentSurvey.questions.find(q => q.id === questionId);
    if (question) {
        question.options.splice(optionIndex, 1);
        saveSurveys();
        loadQuestions();
    }
}

function updateOption(questionId, optionIndex, value) {
    if (!currentSurvey) return;
    
    const question = currentSurvey.questions.find(q => q.id === questionId);
    if (question && question.options[optionIndex] !== undefined) {
        question.options[optionIndex] = value;
        saveSurveys();
    }
}

function saveSurvey() {
    if (!currentSurvey) return;
    
    currentSurvey.title = document.getElementById('surveyTitle').value;
    currentSurvey.description = document.getElementById('surveyDescription').value;
    currentSurvey.status = 'active';
    
    // Update survey in array
    const index = surveys.findIndex(s => s.id === currentSurvey.id);
    if (index !== -1) {
        surveys[index] = currentSurvey;
        saveSurveys();
    }
    
    showNotification('Survey saved successfully!');
}

function previewSurvey() {
    if (!currentSurvey) return;
    
    // Save current state
    saveSurvey();
    
    // Open survey in new tab
    const surveyUrl = `survey.html?id=${currentSurvey.id}`;
    window.open(surveyUrl, '_blank');
}

// Survey response functionality
function loadSurvey() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');
    
    if (!surveyId) {
        showNotification('No survey ID provided', 'error');
        return;
    }
    
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
        showNotification('Survey not found', 'error');
        return;
    }
    
    // Apply survey styling
    document.documentElement.style.setProperty('--primary-color', survey.color);
    document.documentElement.style.setProperty('--font-size', survey.fontSize);
    document.documentElement.style.setProperty('--border-radius', survey.borderRadius);
    
    // Load survey content
    document.getElementById('surveyTitle').textContent = survey.title;
    document.getElementById('surveyDescription').textContent = survey.description;
    
    // Load questions
    loadSurveyQuestions(survey);
}

function loadSurveyQuestions(survey) {
    const questionsContainer = document.getElementById('questionsContainer');
    if (!questionsContainer) return;
    
    questionsContainer.innerHTML = '';
    
    survey.questions.forEach((question, index) => {
        const questionElement = createSurveyQuestionElement(question, index);
        questionsContainer.appendChild(questionElement);
    });
}

function createSurveyQuestionElement(question, index) {
    const div = document.createElement('div');
    div.className = 'question';
    
    let inputHtml = '';
    switch (question.type) {
        case 'text':
            inputHtml = `<input type="text" name="q${question.id}" placeholder="Your answer" ${question.required ? 'required' : ''}>`;
            break;
        case 'textarea':
            inputHtml = `<textarea name="q${question.id}" placeholder="Your answer" ${question.required ? 'required' : ''}></textarea>`;
            break;
        case 'number':
            inputHtml = `<input type="number" name="q${question.id}" ${question.required ? 'required' : ''}>`;
            break;
        case 'email':
            inputHtml = `<input type="email" name="q${question.id}" placeholder="your@email.com" ${question.required ? 'required' : ''}>`;
            break;
        case 'phone':
            inputHtml = `<input type="tel" name="q${question.id}" placeholder="Your phone number" ${question.required ? 'required' : ''}>`;
            break;
        case 'rating':
            inputHtml = createRatingInput(question);
            break;
        case 'nps':
            inputHtml = createNPSInput(question);
            break;
        case 'multiple_choice':
            inputHtml = createMultipleChoiceInput(question);
            break;
        case 'radio':
            inputHtml = createRadioInput(question);
            break;
        case 'checkbox':
            inputHtml = createCheckboxInput(question);
            break;
    }
    
    div.innerHTML = `
        <h3>${index + 1}. ${question.text}</h3>
        ${inputHtml}
    `;
    
    return div;
}

function createRatingInput(question) {
    let html = '<div class="rating-input">';
    for (let i = question.min; i <= question.max; i++) {
        html += `
            <label class="rating-option">
                <input type="radio" name="q${question.id}" value="${i}" ${question.required ? 'required' : ''}>
                <span class="rating-label">${i}</span>
            </label>
        `;
    }
    html += '</div>';
    return html;
}

function createNPSInput(question) {
    let html = '<div class="nps-input">';
    for (let i = 0; i <= 10; i++) {
        html += `
            <label class="nps-option">
                <input type="radio" name="q${question.id}" value="${i}" ${question.required ? 'required' : ''}>
                <span class="nps-label">${i}</span>
            </label>
        `;
    }
    html += '</div>';
    return html;
}

function createMultipleChoiceInput(question) {
    let html = '<div class="multiple-choice-input">';
    question.options.forEach(option => {
        html += `
            <label class="choice-option">
                <input type="checkbox" name="q${question.id}" value="${option}">
                <span>${option}</span>
            </label>
        `;
    });
    html += '</div>';
    return html;
}

function createRadioInput(question) {
    let html = '<div class="radio-input">';
    question.options.forEach(option => {
        html += `
            <label class="radio-option">
                <input type="radio" name="q${question.id}" value="${option}" ${question.required ? 'required' : ''}>
                <span>${option}</span>
            </label>
        `;
    });
    html += '</div>';
    return html;
}

function createCheckboxInput(question) {
    let html = '<div class="checkbox-input">';
    question.options.forEach(option => {
        html += `
            <label class="checkbox-option">
                <input type="checkbox" name="q${question.id}" value="${option}">
                <span>${option}</span>
            </label>
        `;
    });
    html += '</div>';
    return html;
}

function submitSurvey(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');
    
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
        showNotification('Survey not found', 'error');
        return;
    }
    
    // Collect responses
    const response = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        answers: {}
    };
    
    survey.questions.forEach(question => {
        const fieldName = `q${question.id}`;
        if (question.type === 'multiple_choice' || question.type === 'checkbox') {
            const values = formData.getAll(fieldName);
            response.answers[question.id] = values;
        } else {
            response.answers[question.id] = formData.get(fieldName);
        }
    });
    
    // Add response to survey
    if (!survey.responses) survey.responses = [];
    survey.responses.push(response);
    
    // Update surveys array
    const index = surveys.findIndex(s => s.id === surveyId);
    if (index !== -1) {
        surveys[index] = survey;
        saveSurveys();
    }
    
    // Show thank you message
    showThankYouMessage();
}

function showThankYouMessage() {
    const mainContent = document.querySelector('.survey-container');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="thank-you">
                <i class="fas fa-check-circle"></i>
                <h2>Thank You!</h2>
                <p>Your response has been submitted successfully.</p>
                <p>We appreciate your feedback!</p>
            </div>
        `;
    }
}

// User menu functionality
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'survey-editor.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize color picker
    initColorPicker();
    
    // Load surveys if on dashboard
    if (document.querySelector('.surveys-grid')) {
        loadSurveys();
    }
    
    // Load survey editor if on editor page
    if (window.location.pathname.includes('survey-editor.html')) {
        loadSurveyEditor();
    }
    
    // Load survey if on survey page
    if (window.location.pathname.includes('survey.html')) {
        loadSurvey();
    }
    
    // Add form event listeners
    const createForm = document.getElementById('createSurveyForm');
    if (createForm) {
        createForm.addEventListener('submit', createSurvey);
    }
    
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.addEventListener('submit', submitSurvey);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', signUp);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Update user display
    updateUserDisplay();
});

function updateUserDisplay() {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    
    if (currentUser) {
        if (userAvatar) {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
        if (userName) {
            userName.textContent = currentUser.name;
        }
    }
} 