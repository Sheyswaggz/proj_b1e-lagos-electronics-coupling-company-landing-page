/**
 * Button Morphing Interactions Module
 * Handles button state management, morphing effects, loading states, and user feedback
 * @module interactions
 */

/**
 * Button state constants
 */
const ButtonState = Object.freeze({
  IDLE: 'idle',
  HOVER: 'hover',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
});

/**
 * Configuration for button interactions
 */
const config = {
  loadingDuration: 2000,
  successDuration: 2000,
  errorDuration: 3000,
  rippleEffect: true,
  hapticFeedback: false,
};

/**
 * Manages button state and provides morphing interactions
 */
class ButtonInteractionManager {
  constructor(buttonElement) {
    if (!buttonElement) {
      throw new Error('Button element is required');
    }

    this.button = buttonElement;
    this.state = ButtonState.IDLE;
    this.originalText = buttonElement.textContent;
    this.init();
  }

  /**
   * Initialize button interactions
   */
  init() {
    this.attachEventListeners();
    this.setupAccessibility();
  }

  /**
   * Attach event listeners for button interactions
   */
  attachEventListeners() {
    // Hover effects
    this.button.addEventListener(
      'mouseenter',
      this.handleMouseEnter.bind(this)
    );
    this.button.addEventListener(
      'mouseleave',
      this.handleMouseLeave.bind(this)
    );

    // Click handler
    this.button.addEventListener('click', this.handleClick.bind(this));

    // Keyboard support
    this.button.addEventListener('keydown', this.handleKeydown.bind(this));

    // Touch support for mobile
    this.button.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: true }
    );
    this.button.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility() {
    if (!this.button.hasAttribute('role')) {
      this.button.setAttribute('role', 'button');
    }

    if (!this.button.hasAttribute('tabindex')) {
      this.button.setAttribute('tabindex', '0');
    }
  }

  /**
   * Handle mouse enter event
   */
  handleMouseEnter() {
    if (this.state === ButtonState.IDLE) {
      this.setState(ButtonState.HOVER);
    }
  }

  /**
   * Handle mouse leave event
   */
  handleMouseLeave() {
    if (this.state === ButtonState.HOVER) {
      this.setState(ButtonState.IDLE);
    }
  }

  /**
   * Handle click event with async action simulation
   */
  async handleClick(event) {
    if (this.state === ButtonState.LOADING) {
      return;
    }

    event.preventDefault();

    // Create ripple effect
    if (config.rippleEffect) {
      this.createRipple(event);
    }

    // Simulate async action (e.g., form submission)
    await this.simulateAsyncAction();
  }

  /**
   * Handle keyboard events
   */
  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  /**
   * Handle touch start event
   */
  handleTouchStart() {
    if (this.state === ButtonState.IDLE) {
      this.button.style.transform = 'scale(0.98)';
    }
  }

  /**
   * Handle touch end event
   */
  handleTouchEnd() {
    if (this.state !== ButtonState.LOADING) {
      this.button.style.transform = '';
    }
  }

  /**
   * Create ripple effect on button click
   */
  createRipple(event) {
    const ripple = document.createElement('span');
    const rect = this.button.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple-animation 0.6s ease-out;
      left: ${x}px;
      top: ${y}px;
    `;

    this.button.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  /**
   * Simulate async action (form submission, API call, etc.)
   */
  async simulateAsyncAction() {
    try {
      // Set loading state
      this.setState(ButtonState.LOADING);

      // Simulate network delay
      await this.sleep(config.loadingDuration);

      // Simulate success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        this.setState(ButtonState.SUCCESS);
        await this.sleep(config.successDuration);
      } else {
        this.setState(ButtonState.ERROR);
        await this.sleep(config.errorDuration);
      }

      // Reset to idle state
      this.setState(ButtonState.IDLE);
    } catch (error) {
      console.error('Button action failed:', error);
      this.setState(ButtonState.ERROR);
      await this.sleep(config.errorDuration);
      this.setState(ButtonState.IDLE);
    }
  }

  /**
   * Set button state with appropriate visual feedback
   */
  setState(newState) {
    if (this.state === newState) {
      return;
    }

    const previousState = this.state;
    this.state = newState;

    this.updateButtonAppearance(previousState, newState);
    this.updateAriaAttributes(newState);

    // Emit state change event
    this.button.dispatchEvent(
      new CustomEvent('buttonStateChange', {
        detail: { previousState, newState },
      })
    );
  }

  /**
   * Update button appearance based on state
   */
  updateButtonAppearance(previousState, newState) {
    // Remove previous state classes
    this.button.removeAttribute('data-loading');
    this.button.removeAttribute('data-state');

    switch (newState) {
      case ButtonState.IDLE:
        this.button.textContent = this.originalText;
        break;

      case ButtonState.LOADING:
        this.button.setAttribute('data-loading', 'true');
        this.button.textContent = this.originalText;
        break;

      case ButtonState.SUCCESS:
        this.button.setAttribute('data-state', 'success');
        this.button.textContent = '';
        break;

      case ButtonState.ERROR:
        this.button.setAttribute('data-state', 'error');
        this.button.textContent = 'Try Again';
        break;

      case ButtonState.HOVER:
        // Handled by CSS
        break;
    }
  }

  /**
   * Update ARIA attributes for accessibility
   */
  updateAriaAttributes(state) {
    switch (state) {
      case ButtonState.LOADING:
        this.button.setAttribute('aria-busy', 'true');
        this.button.setAttribute('aria-disabled', 'true');
        break;

      case ButtonState.SUCCESS:
        this.button.setAttribute('aria-label', 'Action completed successfully');
        this.button.removeAttribute('aria-busy');
        this.button.removeAttribute('aria-disabled');
        break;

      case ButtonState.ERROR:
        this.button.setAttribute(
          'aria-label',
          'Action failed, please try again'
        );
        this.button.removeAttribute('aria-busy');
        this.button.removeAttribute('aria-disabled');
        break;

      default:
        this.button.removeAttribute('aria-busy');
        this.button.removeAttribute('aria-disabled');
        this.button.setAttribute(
          'aria-label',
          this.button.getAttribute('aria-label') || this.originalText
        );
    }
  }

  /**
   * Sleep utility for async operations
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Destroy button interactions and cleanup
   */
  destroy() {
    this.button.removeEventListener('mouseenter', this.handleMouseEnter);
    this.button.removeEventListener('mouseleave', this.handleMouseLeave);
    this.button.removeEventListener('click', this.handleClick);
    this.button.removeEventListener('keydown', this.handleKeydown);
    this.button.removeEventListener('touchstart', this.handleTouchStart);
    this.button.removeEventListener('touchend', this.handleTouchEnd);
  }
}

/**
 * Initialize all morphing buttons on the page
 */
function initializeMorphingButtons() {
  const buttons = document.querySelectorAll('.btn-morph');
  const buttonManagers = [];

  buttons.forEach(button => {
    try {
      const manager = new ButtonInteractionManager(button);
      buttonManagers.push(manager);
    } catch (error) {
      console.error('Failed to initialize button:', error);
    }
  });

  return buttonManagers;
}

/**
 * Add ripple animation styles to document
 */
function injectRippleStyles() {
  if (document.getElementById('ripple-animation-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'ripple-animation-styles';
  style.textContent = `
    @keyframes ripple-animation {
      to {
        transform: translate(-50%, -50%) scale(20);
        opacity: 0;
      }
    }

    .btn-morph {
      position: relative;
      overflow: hidden;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Check for reduced motion preference
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize module when DOM is ready
 */
function init() {
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
  // Respect user's reduced motion preference
  if (prefersReducedMotion()) {
    config.rippleEffect = false;
    config.loadingDuration = 500;
    config.successDuration = 500;
    config.errorDuration = 500;
  }

  // Inject ripple animation styles
  injectRippleStyles();

  // Initialize all morphing buttons
  const managers = initializeMorphingButtons();

  // Expose for debugging in development
  if (typeof window !== 'undefined') {
    window.buttonInteractions = {
      managers,
      config,
      ButtonState,
    };
  }

  console.log(`Initialized ${managers.length} morphing button(s)`);
}

// Auto-initialize
init();

// Export for module usage
export {
  ButtonInteractionManager,
  ButtonState,
  config,
  initializeMorphingButtons,
};
