// Portfolio Data
const portfolioData = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        liveUrl: '#',
        githubUrl: '#',
        featured: true
    },
    {
        id: 2,
        title: 'Task Management App',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        technologies: ['React', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
        liveUrl: '#',
        githubUrl: '#',
        featured: true
    },
    {
        id: 3,
        title: 'Weather Dashboard',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop',
        description: 'A weather application that displays current weather conditions and forecasts using OpenWeatherMap API with beautiful UI design.',
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'Weather API'],
        liveUrl: '#',
        githubUrl: '#',
        featured: false
    },
    {
        id: 4,
        title: 'Portfolio Website',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
        description: 'A responsive portfolio website showcasing projects and skills with modern design and smooth animations.',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
        liveUrl: '#',
        githubUrl: '#',
        featured: false
    },
    {
        id: 5,
        title: 'Mobile Fitness App',
        category: 'mobile',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        description: 'A fitness tracking mobile application with workout plans, progress tracking, and social features.',
        technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
        liveUrl: '#',
        githubUrl: '#',
        featured: true
    },
    {
        id: 6,
        title: 'Data Visualization Tool',
        category: 'data',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        description: 'An interactive data visualization tool for analyzing and presenting complex datasets with charts and graphs.',
        technologies: ['Python', 'D3.js', 'Flask', 'Pandas'],
        liveUrl: '#',
        githubUrl: '#',
        featured: false
    }
];

// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const portfolioGrid = document.getElementById('portfolio-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const currentYearSpan = document.getElementById('current-year');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Initialize portfolio
    renderPortfolio('all');
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize skill bars animation
    initializeSkillBars();
    
    // Add event listeners
    addEventListeners();
}

// Navigation functionality
function addEventListeners() {
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Portfolio filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handlePortfolioFilter);
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', handleContactForm);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.className = 'fas fa-bars';
}

function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Portfolio functionality
function handlePortfolioFilter(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Render filtered portfolio
    renderPortfolio(filter);
}

function renderPortfolio(filter) {
    const filteredProjects = filter === 'all' 
        ? portfolioData 
        : portfolioData.filter(project => project.category === filter);
    
    portfolioGrid.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const projectElement = createPortfolioItem(project);
        portfolioGrid.appendChild(projectElement);
    });
    
    // Add animation to new items
    setTimeout(() => {
        const items = portfolioGrid.querySelectorAll('.portfolio-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }, 100);
}

function createPortfolioItem(project) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    item.innerHTML = `
        <div class="portfolio-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            ${project.featured ? '<div class="portfolio-badge">Featured</div>' : ''}
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${project.title}</h3>
            <p class="portfolio-description">${project.description}</p>
            <div class="portfolio-tech">
                ${techTags}
            </div>
            <div class="portfolio-links">
                <a href="${project.liveUrl}" class="portfolio-link" target="_blank">
                    <i class="fas fa-eye"></i> Live Demo
                </a>
                <a href="${project.githubUrl}" class="portfolio-link" target="_blank">
                    <i class="fas fa-code"></i> Code
                </a>
            </div>
        </div>
    `;
    
    return item;
}

// Contact form functionality
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Simulate form submission (replace with actual API call)
    try {
        await simulateFormSubmission(formData);
        showFormStatus('success', 'Thank you! Your message has been sent successfully.');
        contactForm.reset();
    } catch (error) {
        showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                resolve();
            } else {
                reject(new Error('Simulated error'));
            }
        }, 2000);
    });
}

function showFormStatus(type, message) {
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    // Hide status after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// CV Download functionality
function downloadCV() {
    // Create a mock CV download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Your CV content here');
    link.download = 'YourName-CV.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('CV downloaded successfully!', 'success');
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.width = percent + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedScrollHandler = debounce(handleHeaderScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add typing effect to hero title (optional)
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
});

// Add smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });
};

// Initialize reveal animations
revealSections();

// Add CSS for section reveal animations
const style = document.createElement('style');
style.textContent = `
    .section--hidden {
        opacity: 0;
        transform: translateY(8rem);
        transition: all 1s;
    }
    
    .section-revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
