import { browser } from '$app/environment';

// Lazy load images with Intersection Observer
export function lazyLoadImages(selector = 'img[data-src]') {
	if (!browser) return;

	const images = document.querySelectorAll(selector);
	
	if (!images.length) return;

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				const src = img.getAttribute('data-src');
				
				if (src) {
					img.src = src;
					img.removeAttribute('data-src');
					img.classList.remove('lazy');
					img.classList.add('loaded');
				}
				
				observer.unobserve(img);
			}
		});
	}, {
		rootMargin: '50px 0px',
		threshold: 0.01
	});

	images.forEach(img => imageObserver.observe(img));

	return () => {
		imageObserver.disconnect();
	};
}

// Monitor Core Web Vitals
export function monitorCoreWebVitals() {
	if (!browser) return;

	// Largest Contentful Paint (LCP)
	function measureLCP() {
		return new Promise((resolve) => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				const lastEntry = entries[entries.length - 1];
				resolve({
					name: 'LCP',
					value: lastEntry.startTime,
					rating: lastEntry.startTime <= 2500 ? 'good' : lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor'
				});
			}).observe({ entryTypes: ['largest-contentful-paint'] });
		});
	}

	// First Input Delay (FID)
	function measureFID() {
		return new Promise((resolve) => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach(entry => {
					resolve({
						name: 'FID',
						value: entry.processingStart - entry.startTime,
						rating: entry.processingStart - entry.startTime <= 100 ? 'good' : entry.processingStart - entry.startTime <= 300 ? 'needs-improvement' : 'poor'
					});
				});
			}).observe({ entryTypes: ['first-input'] });
		});
	}

	// Cumulative Layout Shift (CLS)
	function measureCLS() {
		return new Promise((resolve) => {
			let clsValue = 0;
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach(entry => {
					if (!entry.hadRecentInput) {
						clsValue += entry.value;
					}
				});
				resolve({
					name: 'CLS',
					value: clsValue,
					rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor'
				});
			}).observe({ entryTypes: ['layout-shift'] });
		});
	}

	// Time to First Byte (TTFB)
	function measureTTFB() {
		const navigation = performance.getEntriesByType('navigation')[0];
		const ttfb = navigation.responseStart - navigation.requestStart;
		return {
			name: 'TTFB',
			value: ttfb,
			rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor'
		};
	}

	// First Contentful Paint (FCP)
	function measureFCP() {
		return new Promise((resolve) => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				entries.forEach(entry => {
					if (entry.name === 'first-contentful-paint') {
						resolve({
							name: 'FCP',
							value: entry.startTime,
							rating: entry.startTime <= 1800 ? 'good' : entry.startTime <= 3000 ? 'needs-improvement' : 'poor'
						});
					}
				});
			}).observe({ entryTypes: ['paint'] });
		});
	}

	// Collect all metrics
	Promise.all([
		measureLCP(),
		measureFID(),
		measureCLS(),
		measureFCP(),
		Promise.resolve(measureTTFB())
	]).then(metrics => {
		console.log('Core Web Vitals:', metrics);
		
		// Send to analytics
		metrics.forEach(metric => {
			if (typeof gtag !== 'undefined') {
				gtag('event', metric.name, {
					event_category: 'Web Vitals',
					value: Math.round(metric.value),
					custom_parameter_1: metric.rating
				});
			}
		});
	});
}

// Preload critical resources
export function preloadCriticalResources(resources = []) {
	if (!browser) return;

	resources.forEach(resource => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.href = resource.href;
		link.as = resource.as || 'script';
		
		if (resource.type) {
			link.type = resource.type;
		}
		
		if (resource.crossorigin) {
			link.crossOrigin = resource.crossorigin;
		}
		
		document.head.appendChild(link);
	});
}

// Optimize fonts
export function optimizeFonts() {
	if (!browser) return;

	// Add font-display: swap to all font faces
	const style = document.createElement('style');
	style.textContent = `
		@font-face {
			font-display: swap;
		}
	`;
	document.head.appendChild(style);

	// Preload critical fonts
	const criticalFonts = [
		'/fonts/inter-var.woff2',
		'/fonts/inter-var-italic.woff2'
	];

	criticalFonts.forEach(font => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.href = font;
		link.as = 'font';
		link.type = 'font/woff2';
		link.crossOrigin = 'anonymous';
		document.head.appendChild(link);
	});
}

// Prevent layout shift
export function preventLayoutShift() {
	if (!browser) return;

	// Add aspect ratio containers for images
	const images = document.querySelectorAll('img:not([width]):not([height])');
	images.forEach(img => {
		img.addEventListener('load', function() {
			const aspectRatio = this.naturalWidth / this.naturalHeight;
			this.style.aspectRatio = aspectRatio;
		});
	});

	// Reserve space for ads and dynamic content
	const adSlots = document.querySelectorAll('.ad-slot');
	adSlots.forEach(slot => {
		if (!slot.style.minHeight) {
			slot.style.minHeight = '250px'; // Standard ad height
		}
	});
}

// Optimize for mobile
export function optimizeForMobile() {
	if (!browser) return;

	// Ensure touch targets are at least 44px
	const style = document.createElement('style');
	style.textContent = `
		button, a, input, select, textarea {
			min-height: 44px;
			min-width: 44px;
		}
		
		/* Optimize tap highlighting */
		* {
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
		}
		
		/* Prevent zoom on input focus */
		input, select, textarea {
			font-size: 16px;
		}
		
		/* Smooth scrolling */
		html {
			scroll-behavior: smooth;
		}
		
		/* Optimize animations for mobile */
		@media (prefers-reduced-motion: reduce) {
			* {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
			}
		}
	`;
	document.head.appendChild(style);
}

// Resource hints
export function addResourceHints() {
	if (!browser) return;

	// DNS prefetch for external domains
	const externalDomains = [
		'fonts.googleapis.com',
		'fonts.gstatic.com',
		'www.google-analytics.com',
		'www.googletagmanager.com'
	];

	externalDomains.forEach(domain => {
		const link = document.createElement('link');
		link.rel = 'dns-prefetch';
		link.href = `//${domain}`;
		document.head.appendChild(link);
	});

	// Preconnect to critical third-party origins
	const criticalOrigins = [
		'https://fonts.googleapis.com',
		'https://fonts.gstatic.com'
	];

	criticalOrigins.forEach(origin => {
		const link = document.createElement('link');
		link.rel = 'preconnect';
		link.href = origin;
		link.crossOrigin = 'anonymous';
		document.head.appendChild(link);
	});
}

// Service Worker registration
export function registerServiceWorker(swPath = '/sw.js') {
	if (!browser || !('serviceWorker' in navigator)) return;

	window.addEventListener('load', () => {
		navigator.serviceWorker.register(swPath)
			.then(registration => {
				console.log('SW registered: ', registration);
			})
			.catch(registrationError => {
				console.log('SW registration failed: ', registrationError);
			});
	});
}

// Performance observer for monitoring
export function createPerformanceObserver() {
	if (!browser || !('PerformanceObserver' in window)) return;

	const observer = new PerformanceObserver((list) => {
		const entries = list.getEntries();
		entries.forEach(entry => {
			// Log slow resources
			if (entry.duration > 1000) {
				console.warn('Slow resource:', entry.name, `${entry.duration}ms`);
			}
		});
	});

	observer.observe({ entryTypes: ['resource', 'navigation'] });

	return observer;
}

// Bundle analyzer helper
export function analyzeBundleSize() {
	if (!browser) return;

	const scripts = document.querySelectorAll('script[src]');
	const styles = document.querySelectorAll('link[rel="stylesheet"]');

	console.group('Bundle Analysis');
	console.log(`Scripts: ${scripts.length}`);
	console.log(`Stylesheets: ${styles.length}`);
	
	// Estimate total size (this is approximate)
	let totalEstimatedSize = 0;
	scripts.forEach(script => {
		// This is just an estimation - real size would need network analysis
		totalEstimatedSize += 50; // Assume 50KB average per script
	});
	
	console.log(`Estimated total JS size: ~${totalEstimatedSize}KB`);
	console.groupEnd();
}

