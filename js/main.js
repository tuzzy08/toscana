document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Add back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    `;
    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopButton);

     // Back to top button visibility
     const toggleBackToTop = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };    

    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop);

    // Function to toggle the mobile menu
    const toggleMobileMenu = () => {
        console.log('Toggle menu clicked');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
            // document.body.classList.toggle('menu-open');
        } else {
            console.error('Mobile menu element not found');
        }
    };

    // Set active state based on current page
    const setActiveLink = () => {
        // Get the current URL's pathname
        const currentPath = window.location.pathname;
        // Get the last part of the path, or default to index.html
        let pageName = currentPath.split('/').pop() || 'index.html';
        // If no extension is present, add .html
        if (!pageName.includes('.')) {
            pageName += '.html';
        }
        
        // Create a mapping of page names to their corresponding nav text
        const pageToNavText = {
            'menu.html': 'SPEISEN',
            'gallery.html': 'GALERIE',
            'events.html': 'EVENTS',
            'contact.html': 'KONTAKT',
            'index.html': 'HOME'
        };
        
        // Remove all active classes first
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Find and set the active link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Check various conditions for active state
            const isActive = 
                // Direct href match
                href === pageName || 
                // Index page with empty href
                (pageName === 'index.html' && href === '') ||
                // Hash href matching current page via text content
                (href === '#' && link.textContent === pageToNavText[pageName]);
            
            if (isActive) {
                link.classList.add('active');
            }
        });
    };

    // Set initial active state
    setActiveLink();

    // Also set active state when the page loads
    window.addEventListener('load', setActiveLink);

    // And when the URL changes (if using history API)
    window.addEventListener('popstate', setActiveLink);

    // Open menu on button click
    if (mobileMenuBtn) {
        console.log('Mobile menu button found');
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    } else {
        console.error('Mobile menu button not found');
    }

    // Close menu on close button click
    if (closeMenuBtn) {
        console.log('Close menu button found');
        closeMenuBtn.addEventListener('click', toggleMobileMenu);
    } else {
        console.error('Close menu button not found');
    }

    // Handle navigation active states
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            // Remove the active class from all links
            navLinks.forEach((l) => l.classList.remove('active'));
            // Add the active class to the clicked link
            e.currentTarget.classList.add('active');

            // Close the mobile menu if it's open
            if (mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (
            mobileMenu.classList.contains('show') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)
        ) {
            toggleMobileMenu();
        }
    });

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const toast = document.getElementById('toast');
        
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        })
        .then(() => {
            form.reset();
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            const toastSpan = toast.querySelector('span');
            toastSpan.textContent = 'Ein Fehler ist aufgetreten.';
            toastSpan.classList.remove('bg-green-500');
            toastSpan.classList.add('bg-red-500');
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2000);
        });
    });
});
