class CookieConsent {
	constructor() {
		this.cookieTypes = {
			necessary: {
				name: 'Notwendig',
				description:
					'Essenzielle Cookies, die für die grundlegende Funktionalität der Website erforderlich sind.',
				required: true,
			},
			preferences: {
				name: 'Präferenzen',
				description:
					'Cookies, die Ihre Einstellungen speichern und Ihr Website-Erlebnis verbessern.',
				required: false,
			},
			analytics: {
				name: 'Analyse',
				description:
					'Cookies, die uns helfen zu verstehen, wie Besucher mit unserer Website interagieren.',
				required: false,
			},
			marketing: {
				name: 'Marketing',
				description: 'Cookies für personalisierte Werbung und Marketingzwecke.',
				required: false,
			},
		};

		this.consentKey = 'toscanaConsent';
		// Wait for jQuery and other scripts to be fully loaded
		window.addEventListener('load', () => {
			// Add additional delay to ensure all animations and plugins are initialized
			setTimeout(() => this.init(), 2000);
		});
	}

	init() {
		const savedConsent = localStorage.getItem(this.consentKey);
		if (!savedConsent) {
			this.showBanner();
		} else {
			this.applyConsent(JSON.parse(savedConsent));
		}
	}

	createBanner() {
		const banner = document.createElement('div');
		banner.id = 'cookie-consent-banner';
		banner.style.opacity = '0';
		banner.style.transform = 'translateY(100%)';
		banner.innerHTML = `
            <div class="cookie-consent-content">
                <h3>Cookie-Einstellungen</h3>
                <p>Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Verkehr zu analysieren. Bitte wählen Sie Ihre Präferenzen.</p>
                <div class="cookie-buttons">
                    <button id="cookie-accept-all" class="cookie-button primary">Alle akzeptieren</button>
                    <button id="cookie-customize" class="cookie-button secondary">Anpassen</button>
                    <button id="cookie-reject-all" class="cookie-button secondary">Alle ablehnen</button>
                </div>
            </div>
        `;
		document.body.appendChild(banner);

		// Trigger reflow and add transition
		requestAnimationFrame(() => {
			banner.style.transition =
				'opacity 0.5s ease-out, transform 0.5s ease-out';
			banner.style.opacity = '1';
			banner.style.transform = 'translateY(0)';
		});

		return banner;
	}

	createPreferencesModal() {
		const overlay = document.createElement('div');
		overlay.className = 'cookie-modal-overlay';
		overlay.style.opacity = '0';

		const modal = document.createElement('div');
		modal.id = 'cookie-preferences-modal';
		modal.style.opacity = '0';
		modal.style.transform = 'translate(-50%, -40%)';
		modal.innerHTML = `
            <div class="cookie-modal-content">
                <h3>Cookie-Präferenzen</h3>
                <div class="cookie-preferences">
                    ${Object.entries(this.cookieTypes)
											.map(
												([key, value]) => `
                        <div class="cookie-preference">
                            <div class="cookie-preference-header">
                                <label>
                                    <input type="checkbox" name="${key}" 
                                        ${
																					value.required
																						? 'checked disabled'
																						: ''
																				}>
                                    ${value.name}
                                </label>
                            </div>
                            <p>${value.description}</p>
                        </div>
                    `
											)
											.join('')}
                </div>
                <div class="cookie-modal-buttons">
                    <button id="cookie-save-preferences" class="cookie-button primary">Einstellungen speichern</button>
                </div>
            </div>
        `;

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		// Trigger reflow and add transition
		requestAnimationFrame(() => {
			overlay.style.transition = 'opacity 0.3s ease-out';
			modal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
			overlay.style.opacity = '1';
			modal.style.opacity = '1';
			modal.style.transform = 'translate(-50%, -50%)';
		});

		return modal;
	}

	showBanner() {
		const banner = this.createBanner();

		document
			.getElementById('cookie-accept-all')
			.addEventListener('click', () => {
				this.acceptAll();
			});

		document
			.getElementById('cookie-reject-all')
			.addEventListener('click', () => {
				this.rejectAll();
			});

		document
			.getElementById('cookie-customize')
			.addEventListener('click', () => {
				this.showPreferencesModal();
			});
	}

	showPreferencesModal() {
		const banner = document.getElementById('cookie-consent-banner');
		if (banner) {
			banner.style.opacity = '0';
			banner.style.transform = 'translateY(100%)';
			setTimeout(() => banner.remove(), 500);
		}

		const modal = this.createPreferencesModal();

		document
			.getElementById('cookie-save-preferences')
			.addEventListener('click', () => {
				this.savePreferences();
			});
	}

	acceptAll() {
		const consent = Object.fromEntries(
			Object.keys(this.cookieTypes).map((type) => [type, true])
		);
		this.saveConsent(consent);
	}

	rejectAll() {
		const consent = Object.fromEntries(
			Object.keys(this.cookieTypes).map((type) => [
				type,
				this.cookieTypes[type].required,
			])
		);
		this.saveConsent(consent);
	}

	savePreferences() {
		const modal = document.getElementById('cookie-preferences-modal');
		const consent = {};

		Object.keys(this.cookieTypes).forEach((type) => {
			const checkbox = modal.querySelector(`input[name="${type}"]`);
			consent[type] = this.cookieTypes[type].required || checkbox.checked;
		});

		this.saveConsent(consent);
	}

	saveConsent(consent) {
		localStorage.setItem(this.consentKey, JSON.stringify(consent));
		this.applyConsent(consent);
		this.removeBannerAndModal();
	}

	applyConsent(consent) {
		// Here you would implement the actual cookie management based on consent
		console.log('Applied consent:', consent);
	}

	removeBannerAndModal() {
		const banner = document.getElementById('cookie-consent-banner');
		const modal = document.getElementById('cookie-preferences-modal');
		const overlay = document.querySelector('.cookie-modal-overlay');

		if (banner) {
			banner.style.opacity = '0';
			banner.style.transform = 'translateY(100%)';
			setTimeout(() => banner.remove(), 500);
		}

		if (modal && overlay) {
			modal.style.opacity = '0';
			modal.style.transform = 'translate(-50%, -40%)';
			overlay.style.opacity = '0';
			setTimeout(() => overlay.remove(), 500);
		}
	}
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', () => {
	new CookieConsent();
});
