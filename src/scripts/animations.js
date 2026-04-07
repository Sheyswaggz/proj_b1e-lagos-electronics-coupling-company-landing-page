/**
 * Scroll-Triggered Animations and Lazy Loading Module
 * Implements Intersection Observer for reveal animations and image lazy loading
 * @module animations
 */

/**
 * Configuration for animations and lazy loading
 */
const config = {
  revealThreshold: 0.15,
  revealRootMargin: '0px 0px -50px 0px',
  staggerDelay: 120,
  slideDistance: 30,
  animationDuration: 600,
  imageLoadRetryAttempts: 3,
  imageLoadRetryDelay: 1000,
  reducedMotion: false,
};

/**
 * Animation state tracking
 */
const state = {
  revealObserver: null,
  imageObserver: null,
  revealedElements: new Set(),
  loadedImages: new Set(),
  initialized: false,
};

/**
 * Initialize scroll-triggered reveal animations
 */
function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length === 0) {
    return;
  }

  // Create Intersection Observer for reveal animations
  const observerOptions = {
    threshold: config.revealThreshold,
    rootMargin: config.revealRootMargin,
  };

  state.revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && !state.revealedElements.has(entry.target)) {
        // Calculate stagger delay based on element index
        const delay = index * config.staggerDelay;

        setTimeout(() => {
          revealElement(entry.target);
          state.revealedElements.add(entry.target);
        }, delay);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  revealElements.forEach(element => {
    // Add initial hidden state for animation
    prepareElementForReveal(element);
    state.revealObserver.observe(element);
  });

  console.log(
    `Initialized scroll reveal for ${revealElements.length} element(s)`
  );
}

/**
 * Prepare element for reveal animation
 */
function prepareElementForReveal(element) {
  if (config.reducedMotion) {
    // Skip animation preparation if reduced motion is preferred
    element.style.opacity = '1';
    element.style.transform = 'none';
    return;
  }

  const revealType = element.getAttribute('data-reveal') || 'fade-up';

  // Set initial state based on reveal type
  switch (revealType) {
    case 'fade-up':
      element.style.opacity = '0';
      element.style.transform = `translateY(${config.slideDistance}px)`;
      break;
    case 'fade-down':
      element.style.opacity = '0';
      element.style.transform = `translateY(-${config.slideDistance}px)`;
      break;
    case 'fade-left':
      element.style.opacity = '0';
      element.style.transform = `translateX(${config.slideDistance}px)`;
      break;
    case 'fade-right':
      element.style.opacity = '0';
      element.style.transform = `translateX(-${config.slideDistance}px)`;
      break;
    case 'fade':
    default:
      element.style.opacity = '0';
      element.style.transform = 'none';
      break;
  }

  element.style.transition = `opacity ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
}

/**
 * Reveal element with animation
 */
function revealElement(element) {
  if (config.reducedMotion) {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.dispatchEvent(
      new CustomEvent('elementRevealed', { detail: { element } })
    );
    return;
  }

  // Trigger reflow to ensure transition works
  void element.offsetWidth;

  // Apply revealed state
  element.style.opacity = '1';
  element.style.transform = 'translateY(0) translateX(0)';

  // Remove inline styles after animation completes
  setTimeout(() => {
    element.style.transition = '';
    element.removeAttribute('data-reveal');
    element.dispatchEvent(
      new CustomEvent('elementRevealed', { detail: { element } })
    );
  }, config.animationDuration);
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if (lazyImages.length === 0) {
    return;
  }

  // Check if browser supports native lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach(img => {
      setupImageLoadHandlers(img);
    });
    console.log(`Using native lazy loading for ${lazyImages.length} image(s)`);
    return;
  }

  // Fallback: Use Intersection Observer for lazy loading
  const observerOptions = {
    threshold: 0.01,
    rootMargin: '50px 0px',
  };

  state.imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.loadedImages.has(entry.target)) {
        loadImage(entry.target);
        state.imageObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  lazyImages.forEach(img => {
    // Set loading state
    img.setAttribute('data-loading', 'true');

    // Store src and remove it to prevent immediate loading
    if (img.hasAttribute('src')) {
      img.setAttribute('data-src', img.getAttribute('src'));
      img.removeAttribute('src');
    }

    setupImageLoadHandlers(img);
    state.imageObserver.observe(img);
  });

  console.log(`Initialized lazy loading for ${lazyImages.length} image(s)`);
}

/**
 * Setup image load event handlers
 */
function setupImageLoadHandlers(img) {
  img.addEventListener(
    'load',
    () => {
      handleImageLoad(img);
    },
    { once: true }
  );

  img.addEventListener(
    'error',
    () => {
      handleImageError(img);
    },
    { once: true }
  );
}

/**
 * Load image with retry logic
 */
async function loadImage(img, attempt = 1) {
  const src = img.getAttribute('data-src') || img.getAttribute('src');

  if (!src) {
    console.error('Image has no src attribute:', img);
    return;
  }

  try {
    // Set src to trigger loading
    img.src = src;
    state.loadedImages.add(img);
  } catch (error) {
    console.error('Error loading image:', error);

    // Retry loading if attempts remaining
    if (attempt < config.imageLoadRetryAttempts) {
      console.log(
        `Retrying image load (attempt ${attempt + 1}/${config.imageLoadRetryAttempts})`
      );
      await sleep(config.imageLoadRetryDelay);
      loadImage(img, attempt + 1);
    } else {
      handleImageError(img);
    }
  }
}

/**
 * Handle successful image load
 */
function handleImageLoad(img) {
  img.removeAttribute('data-loading');
  img.removeAttribute('data-src');

  // Add loaded class for CSS animations
  img.classList.add('loaded');

  // Dispatch custom event
  img.dispatchEvent(new CustomEvent('imageLoaded', { detail: { img } }));

  console.log('Image loaded successfully:', img.alt || img.src);
}

/**
 * Handle image load error
 */
function handleImageError(img) {
  img.removeAttribute('data-loading');
  img.setAttribute('data-error', 'true');

  // Set fallback or placeholder
  const fallbackSrc = img.getAttribute('data-fallback');
  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  } else {
    // Create error placeholder
    img.alt = img.alt || 'Image failed to load';
    console.error(
      'Failed to load image:',
      img.alt,
      img.getAttribute('data-src') || img.src
    );
  }

  // Dispatch custom event
  img.dispatchEvent(new CustomEvent('imageError', { detail: { img } }));
}

/**
 * Check for reduced motion preference
 */
function checkReducedMotion() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  config.reducedMotion = mediaQuery.matches;

  // Update config for reduced motion
  if (config.reducedMotion) {
    config.animationDuration = 1;
    config.staggerDelay = 0;
    config.slideDistance = 0;
  }

  // Listen for changes
  mediaQuery.addEventListener('change', e => {
    config.reducedMotion = e.matches;
    if (config.reducedMotion) {
      config.animationDuration = 1;
      config.staggerDelay = 0;
      config.slideDistance = 0;
    } else {
      config.animationDuration = 600;
      config.staggerDelay = 120;
      config.slideDistance = 30;
    }
  });
}

/**
 * Cleanup observers and event listeners
 */
function cleanup() {
  if (state.revealObserver) {
    state.revealObserver.disconnect();
    state.revealObserver = null;
  }

  if (state.imageObserver) {
    state.imageObserver.disconnect();
    state.imageObserver = null;
  }

  state.revealedElements.clear();
  state.loadedImages.clear();
  state.initialized = false;

  console.log('Animation module cleaned up');
}

/**
 * Sleep utility for async operations
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initialize module when DOM is ready
 */
function init() {
  if (state.initialized) {
    console.warn('Animation module already initialized');
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModule);
  } else {
    initializeModule();
  }
}

/**
 * Main initialization function
 */
function initializeModule() {
  // Check for reduced motion preference
  checkReducedMotion();

  // Initialize scroll reveal animations
  initializeScrollReveal();

  // Initialize lazy loading
  initializeLazyLoading();

  state.initialized = true;

  // Expose for debugging in development
  if (typeof window !== 'undefined') {
    window.scrollAnimations = {
      config,
      state,
      cleanup,
      revealElement,
    };
  }

  console.log('Animation module initialized successfully');
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    console.log('Page hidden - animations paused');
  } else {
    // Resume animations when page is visible
    console.log('Page visible - animations resumed');
  }
});

// Cleanup on page unload
window.addEventListener('unload', cleanup);

// Auto-initialize
init();

// Export for module usage
export {
  initializeScrollReveal,
  initializeLazyLoading,
  revealElement,
  loadImage,
  cleanup,
  config,
  state,
};
