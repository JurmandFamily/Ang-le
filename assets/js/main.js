/**
 * Main JavaScript file for [BRAND_NAME] website
 * Vanilla JS - No dependencies
 */

(function() {
    'use strict';

    // ===============================
    // Global Variables
    // ===============================
    let productsData = [];
    let filteredProducts = [];

    // ===============================
    // DOM Ready
    // ===============================
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    // ===============================
    // App Initialization
    // ===============================
    function initializeApp() {
        // Navigation
        initMobileNav();
        
        // Load products data
        loadProductsData();
        
        // Initialize page-specific functionality
        initPageSpecific();
        
        // Forms
        initForms();
        
        // UI interactions
        initUIInteractions();
        
        // External links setup
        setupExternalLinks();
        
        // Smooth scrolling for anchor links
        initSmoothScrolling();
    }

    // ===============================
    // Mobile Navigation
    // ===============================
    function initMobileNav() {
        const navToggle = document.querySelector('.nav__toggle');
        const navMenu = document.querySelector('.nav__menu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('nav__menu--open');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        function openMenu() {
            navMenu.classList.add('nav__menu--open');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            navMenu.classList.remove('nav__menu--open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // ===============================
    // Products Data Loading
    // ===============================
    async function loadProductsData() {
        try {
            const response = await fetch('./data/produits.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            productsData = await response.json();
            filteredProducts = [...productsData];
            
            // Load featured products on homepage
            if (document.getElementById('featured-products')) {
                renderFeaturedProducts();
            }
            
            // Load full catalog if on catalog page
            if (document.getElementById('products-container')) {
                renderProducts();
                initFilters();
            }
            
        } catch (error) {
            console.warn('Could not load products data:', error);
            // Fallback to empty array if JSON file doesn't exist yet
            productsData = [];
            filteredProducts = [];
        }
    }

    // ===============================
    // Featured Products Rendering
    // ===============================
    function renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container || productsData.length === 0) return;

        // Show first 3 products as featured
        const featuredProducts = productsData.slice(0, 3);
        
        container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }

    // ===============================
    // Product Card Creation
    // ===============================
    function createProductCard(product) {
        const basePrice = product.price || 'Sur devis';
        const priceDisplay = typeof basePrice === 'number' ? `À partir de ${basePrice}€` : basePrice;
        
        return `
            <article class="product-card">
                <div class="product-card__image">
                    <picture>
                        <source srcset="${product.images[0].replace('.jpg', '.webp')}" type="image/webp">
                        <img src="${product.images[0]}" 
                             alt="${product.alt}" 
                             loading="lazy" 
                             decoding="async">
                    </picture>
                    <div class="product-card__badge">Pièce unique</div>
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__category">${product.category}</p>
                    <p class="product-card__description">${product.description}</p>
                    <div class="product-card__meta">
                        <span class="product-card__price">${priceDisplay}</span>
                        <span class="product-card__time">${product.delai}</span>
                    </div>
                    <a href="/produit.html?id=${product.slug}" class="btn btn--primary product-card__cta">
                        Voir les détails
                    </a>
                </div>
            </article>
        `;
    }

    // ===============================
    // Catalog Page Functionality
    // ===============================
    function renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Aucun produit ne correspond à vos critères.</p>
                    <button class="btn btn--secondary" onclick="clearFilters()">Effacer les filtres</button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
        
        // Update results count
        updateResultsCount();
    }

    function initFilters() {
        // Category filters
        const categoryFilters = document.querySelectorAll('.filter-category');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Color filters
        const colorFilters = document.querySelectorAll('.filter-color');
        colorFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Material filters
        const materialFilters = document.querySelectorAll('.filter-material');
        materialFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', applySorting);
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(applyFilters, 300));
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearFilters);
        }

        // Load filters from URL
        loadFiltersFromURL();
    }

    function applyFilters() {
        const selectedCategories = getSelectedValues('.filter-category');
        const selectedColors = getSelectedValues('.filter-color');
        const selectedMaterials = getSelectedValues('.filter-material');
        const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';

        filteredProducts = productsData.filter(product => {
            // Category filter
            const categoryMatch = selectedCategories.length === 0 || 
                                selectedCategories.includes(product.category);

            // Color filter
            const colorMatch = selectedColors.length === 0 || 
                             selectedColors.some(color => 
                                product.couleurs?.includes(color));

            // Material filter  
            const materialMatch = selectedMaterials.length === 0 || 
                                selectedMaterials.some(material => 
                                    product.matieres?.includes(material));

            // Search query
            const searchMatch = !searchQuery || 
                              product.name.toLowerCase().includes(searchQuery) ||
                              product.description.toLowerCase().includes(searchQuery);

            return categoryMatch && colorMatch && materialMatch && searchMatch;
        });

        applySorting();
        renderProducts();
        updateURL();
    }

    function applySorting() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;

        switch (sortValue) {
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => (a.price || 999) - (b.price || 999));
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
            default:
                // Keep original order (newest first)
                break;
        }
    }

    function getSelectedValues(selector) {
        return Array.from(document.querySelectorAll(`${selector}:checked`))
                   .map(checkbox => checkbox.value);
    }

    function updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const count = filteredProducts.length;
            const text = count === 1 ? '1 création trouvée' : `${count} créations trouvées`;
            countElement.textContent = text;
        }
    }

    function clearFilters() {
        // Clear all checkboxes
        document.querySelectorAll('.filter-category, .filter-color, .filter-material')
                .forEach(checkbox => checkbox.checked = false);
        
        // Clear search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        // Reset sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'newest';
        
        // Reset products and URL
        filteredProducts = [...productsData];
        applySorting();
        renderProducts();
        updateURL();
    }

    // Make clearFilters available globally for the no-results button
    window.clearFilters = clearFilters;

    // ===============================
    // URL Management
    // ===============================
    function updateURL() {
        const params = new URLSearchParams();
        
        const selectedCategories = getSelectedValues('.filter-category');
        const selectedColors = getSelectedValues('.filter-color');
        const selectedMaterials = getSelectedValues('.filter-material');
        const searchQuery = document.getElementById('search-input')?.value || '';
        const sortValue = document.getElementById('sort-select')?.value || 'newest';

        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        }
        if (selectedColors.length > 0) {
            params.set('colors', selectedColors.join(','));
        }
        if (selectedMaterials.length > 0) {
            params.set('materials', selectedMaterials.join(','));
        }
        if (searchQuery) {
            params.set('search', searchQuery);
        }
        if (sortValue !== 'newest') {
            params.set('sort', sortValue);
        }

        const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        history.replaceState(null, '', newURL);
    }

    function loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Load categories
        const categories = params.get('categories');
        if (categories) {
            categories.split(',').forEach(category => {
                const checkbox = document.querySelector(`.filter-category[value="${category}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load colors
        const colors = params.get('colors');
        if (colors) {
            colors.split(',').forEach(color => {
                const checkbox = document.querySelector(`.filter-color[value="${color}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load materials
        const materials = params.get('materials');
        if (materials) {
            materials.split(',').forEach(material => {
                const checkbox = document.querySelector(`.filter-material[value="${material}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load search
        const search = params.get('search');
        if (search) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = search;
        }

        // Load sort
        const sort = params.get('sort');
        if (sort) {
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) sortSelect.value = sort;
        }

        // Apply filters if any were loaded
        if (categories || colors || materials || search) {
            applyFilters();
        }
    }

    // ===============================
    // Page-Specific Functionality
    // ===============================
    function initPageSpecific() {
        const currentPage = getCurrentPage();

        switch (currentPage) {
            case 'produit':
                initProductPage();
                break;
            case 'faq':
                initFAQPage();
                break;
            case 'blog':
                initBlogPage();
                break;
            case 'contact':
            case 'sur-mesure':
                // Form functionality is handled in initForms()
                break;
        }
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('produit.html')) return 'produit';
        if (path.includes('faq.html')) return 'faq';
        if (path.includes('blog.html')) return 'blog';
        if (path.includes('contact.html')) return 'contact';
        if (path.includes('sur-mesure.html')) return 'sur-mesure';
        if (path.includes('catalogue.html')) return 'catalogue';
        return 'home';
    }

    // ===============================
    // Product Page
    // ===============================
    function initProductPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        
        if (productId && productsData.length > 0) {
            loadProductDetails(productId);
        }

        // Image gallery
        initImageGallery();
    }

    function loadProductDetails(productId) {
        const product = productsData.find(p => p.slug === productId);
        
        if (!product) {
            showProductNotFound();
            return;
        }

        updateProductPage(product);
    }

    function updateProductPage(product) {
        // Update page title and meta
        document.title = `${product.name} - [BRAND_NAME]`;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = `${product.name} - ${product.description}. Création unique en crochet fait main.`;
        }

        // Update content
        const titleElement = document.getElementById('product-title');
        if (titleElement) titleElement.textContent = product.name;
        
        const categoryElement = document.getElementById('product-category');
        if (categoryElement) categoryElement.textContent = product.category;
        
        const descriptionElement = document.getElementById('product-description');
        if (descriptionElement) descriptionElement.textContent = product.description;
        
        const priceElement = document.getElementById('product-price');
        if (priceElement) {
            const priceText = typeof product.price === 'number' ? `À partir de ${product.price}€` : 'Sur devis';
            priceElement.textContent = priceText;
        }
        
        const delayElement = document.getElementById('product-delay');
        if (delayElement) delayElement.textContent = product.delai;

        // Update gallery
        updateProductGallery(product);
        
        // Update JSON-LD
        updateProductJSONLD(product);
    }

    function updateProductGallery(product) {
        const galleryContainer = document.getElementById('product-gallery');
        if (!galleryContainer) return;

        const galleryHTML = product.images.map((image, index) => `
            <div class="gallery-item ${index === 0 ? 'gallery-item--active' : ''}" data-index="${index}">
                <picture>
                    <source srcset="${image.replace('.jpg', '.webp')}" type="image/webp">
                    <img src="${image}" alt="${product.alt}" loading="lazy" decoding="async">
                </picture>
            </div>
        `).join('');

        galleryContainer.innerHTML = galleryHTML;
    }

    function initImageGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        // Thumbnail clicks
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                setActiveGalleryItem(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigateGallery('prev');
            } else if (e.key === 'ArrowRight') {
                navigateGallery('next');
            }
        });
    }

    function setActiveGalleryItem(index) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        galleryItems.forEach(item => item.classList.remove('gallery-item--active'));
        thumbnails.forEach(thumb => thumb.classList.remove('thumbnail--active'));
        
        if (galleryItems[index]) {
            galleryItems[index].classList.add('gallery-item--active');
        }
        if (thumbnails[index]) {
            thumbnails[index].classList.add('thumbnail--active');
        }
    }

    function navigateGallery(direction) {
        const activeItem = document.querySelector('.gallery-item--active');
        if (!activeItem) return;
        
        const currentIndex = parseInt(activeItem.dataset.index);
        const totalItems = document.querySelectorAll('.gallery-item').length;
        
        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        } else {
            newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        }
        
        setActiveGalleryItem(newIndex);
    }

    // ===============================
    // FAQ Page
    // ===============================
    function initFAQPage() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question');
            const content = item.querySelector('.faq-answer');
            
            if (!button || !content) return;
            
            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('faq-item--open');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('faq-item--open');
                        const otherButton = otherItem.querySelector('.faq-question');
                        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('faq-item--open');
                    button.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('faq-item--open');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ===============================
    // Forms
    // ===============================
    function initForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
        });

        // File upload preview
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', handleFileUpload);
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showFormMessage(form, 'Veuillez corriger les erreurs avant d\'envoyer.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            showFormMessage(form, 'Votre message a été envoyé avec succès ! Je vous réponds dans les plus brefs délais.', 'success');
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        clearFieldError(field);
        
        // Required validation
        if (required && !value) {
            showFieldError(field, 'Ce champ est obligatoire.');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showFieldError(field, 'Veuillez saisir un email valide.');
                return false;
            }
        }
        
        // Phone validation
        if (field.name === 'telephone' && value) {
            const phonePattern = /^[\d\s\-\+\(\)\.]{10,}$/;
            if (!phonePattern.test(value)) {
                showFieldError(field, 'Veuillez saisir un numéro de téléphone valide.');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('field-error');
        field.setAttribute('aria-invalid', 'true');
        
        let errorElement = field.parentNode.querySelector('.field-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error-message';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.classList.remove('field-error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showFormMessage(form, message, type) {
        let messageElement = form.querySelector('.form-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            messageElement.setAttribute('role', 'alert');
            form.insertBefore(messageElement, form.firstChild);
        }
        
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }

    function handleFileUpload(e) {
        const input = e.target;
        const files = input.files;
        const preview = input.parentNode.querySelector('.file-preview');
        
        if (!preview) return;
        
        if (files.length === 0) {
            preview.innerHTML = '';
            return;
        }
        
        const fileList = Array.from(files).map(file => {
            const size = (file.size / 1024 / 1024).toFixed(2);
            return `<div class="file-item">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">(${size} MB)</span>
                    </div>`;
        }).join('');
        
        preview.innerHTML = `<div class="files-list">${fileList}</div>`;
    }

    // ===============================
    // UI Interactions
    // ===============================
    function initUIInteractions() {
        // Modal functionality
        initModals();
        
        // Scroll to top button
        initScrollToTop();
        
        // Lazy loading fallback
        initLazyLoading();
    }

    function initModals() {
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        const modals = document.querySelectorAll('.modal');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.dataset.modalTarget;
                const modal = document.getElementById(targetId);
                if (modal) openModal(modal);
            });
        });
        
        modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('.modal-close');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => closeModal(modal));
            });
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal--open');
                if (openModal) closeModal(openModal);
            }
        });
    }

    function openModal(modal) {
        modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    function closeModal(modal) {
        modal.classList.remove('modal--open');
        document.body.style.overflow = '';
    }

    function initScrollToTop() {
        const scrollButton = document.getElementById('scroll-to-top');
        if (!scrollButton) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('scroll-to-top--visible');
            } else {
                scrollButton.classList.remove('scroll-to-top--visible');
            }
        });
        
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initLazyLoading() {
        // Fallback for browsers without native lazy loading support
        if ('loading' in HTMLImageElement.prototype) return;
        
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===============================
    // External Links Setup
    // ===============================
    function setupExternalLinks() {
        // Show/hide Etsy link based on placeholder
        const etsyLink = document.getElementById('etsy-link');
        if (etsyLink && etsyLink.href.includes('[ETSY_URL]')) {
            etsyLink.style.display = 'none';
        } else if (etsyLink) {
            etsyLink.style.display = 'flex';
        }
        
        // Instagram link setup
        const instagramLinks = document.querySelectorAll('a[href*="[INSTAGRAM]"]');
        instagramLinks.forEach(link => {
            if (link.href.includes('[INSTAGRAM]')) {
                link.style.display = 'none';
            }
        });
    }

    // ===============================
    // Smooth Scrolling
    // ===============================
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===============================
    // Product JSON-LD Update
    // ===============================
    function updateProductJSONLD(product) {
        const script = document.querySelector('script[type="application/ld+json"]');
        if (!script) return;
        
        const jsonLD = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images,
            "brand": {
                "@type": "Brand",
                "name": "[BRAND_NAME]"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": product.price || 0,
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "[BRAND_NAME]"
                }
            },
            "category": product.category,
            "material": product.matieres?.join(', '),
            "color": product.couleurs?.join(', ')
        };
        
        script.textContent = JSON.stringify(jsonLD);
    }

    // ===============================
    // Utility Functions
    // ===============================
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

    function showProductNotFound() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="container">
                    <div class="not-found">
                        <h1>Produit non trouvé</h1>
                        <p>Désolé, ce produit n'existe pas ou n'est plus disponible.</p>
                        <a href="/catalogue.html" class="btn btn--primary">Voir le catalogue</a>
                    </div>
                </div>
            `;
        }
    }

})();