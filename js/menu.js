document.addEventListener('DOMContentLoaded', () => {
    const menuSections = document.querySelectorAll('.menu-section');
    let activeContent = null;

    menuSections.forEach(section => {
        const header = section.querySelector('.menu-header');
        const content = section.querySelector('.menu-content');
        const arrow = header.querySelector('svg');

        // Initialize content
        content.classList.add('hidden');
        content.style.height = '0';

        header.addEventListener('click', () => {
            const isClosing = content.classList.contains('show');

            // Close active content if it exists and is different from current content
            if (activeContent && activeContent !== content) {
                activeContent.style.height = '0';
                activeContent.classList.remove('show');
                activeContent.classList.add('hidden');
                activeContent.closest('.menu-section').querySelector('svg').classList.remove('rotate-180');
            }

            // Toggle current content
            if (isClosing) {
                content.style.height = '0';
                arrow.classList.remove('rotate-180');
                content.classList.remove('show');
                setTimeout(() => {
                    content.classList.add('hidden');
                }, 300); // Match transition duration
                activeContent = null;
            } else {
                content.classList.remove('hidden');
                // Trigger reflow to ensure transition works
                content.offsetHeight;
                content.classList.add('show');
                content.style.height = content.scrollHeight + 'px';
                arrow.classList.add('rotate-180');
                activeContent = content;
            }
        });
    });

    // Add touch ripple effect for mobile
    const addRippleEffect = (element) => {
        element.addEventListener('touchstart', (e) => {
            const rect = element.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${e.touches[0].clientX - rect.left}px`;
            ripple.style.top = `${e.touches[0].clientY - rect.top}px`;
            element.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    };

    // Add ripple effect to menu headers
    menuSections.forEach(section => {
        const header = section.querySelector('.menu-header');
        addRippleEffect(header);
    });
});