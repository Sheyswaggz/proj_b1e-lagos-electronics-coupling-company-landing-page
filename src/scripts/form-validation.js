/**
 * Contact Form Validation and Submission Module
 * Handles comprehensive form validation, submission, and user feedback
 * for the Lagos Electronics Coupling Company contact form.
 */

// Configuration
const config = {
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  submitTimeout: 10000,
  successMessageDuration: 5000,
  validationDebounceDelay: 300,
};

// State management
const state = {
  isSubmitting: false,
  validationTimers: {},
  formData: {},
};

// Validation patterns
const validationRules = {
  name: {
    pattern: /^[a-zA-Z\s'-]{2,50}$/,
    message:
      'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes',
  },
  email: {
    pattern:
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^(\+234|0)[789][01]\d{8}$/,
    message:
      'Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)',
  },
  message: {
    minLength: 10,
    maxLength: 1000,
    message: 'Message must be between 10 and 1000 characters',
  },
};

/**
 * Validates a name field
 * @param {string} value - The name value to validate
 * @returns {Object} Validation result with isValid and message
 */
function validateName(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: false,
      message: 'Name is required',
    };
  }

  if (!validationRules.name.pattern.test(trimmedValue)) {
    return {
      isValid: false,
      message: validationRules.name.message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validates an email field using RFC-compliant pattern
 * @param {string} value - The email value to validate
 * @returns {Object} Validation result with isValid and message
 */
function validateEmail(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  if (!validationRules.email.pattern.test(trimmedValue)) {
    return {
      isValid: false,
      message: validationRules.email.message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validates a Nigerian phone number
 * Accepts formats: +2348012345678, 08012345678
 * @param {string} value - The phone value to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePhone(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: false,
      message: 'Phone number is required',
    };
  }

  if (!validationRules.phone.pattern.test(trimmedValue)) {
    return {
      isValid: false,
      message: validationRules.phone.message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validates a message field
 * @param {string} value - The message value to validate
 * @returns {Object} Validation result with isValid and message
 */
function validateMessage(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: false,
      message: 'Message is required',
    };
  }

  if (trimmedValue.length < validationRules.message.minLength) {
    return {
      isValid: false,
      message: `Message must be at least ${validationRules.message.minLength} characters`,
    };
  }

  if (trimmedValue.length > validationRules.message.maxLength) {
    return {
      isValid: false,
      message: `Message must not exceed ${validationRules.message.maxLength} characters`,
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

/**
 * Gets the appropriate validator for a field
 * @param {string} fieldName - The name of the field
 * @returns {Function} Validation function
 */
function getValidator(fieldName) {
  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
  };

  return validators[fieldName] || (() => ({ isValid: true, message: '' }));
}

/**
 * Updates field UI based on validation state
 * @param {HTMLElement} field - The input/textarea element
 * @param {Object} validationResult - The validation result
 */
function updateFieldUI(field, validationResult) {
  const errorElement = document.getElementById(`${field.id}-error`);

  if (!errorElement) {
    console.warn(`Error element not found for field: ${field.id}`);
    return;
  }

  if (validationResult.isValid) {
    field.setAttribute('aria-invalid', 'false');
    field.classList.add('validated');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  } else {
    field.setAttribute('aria-invalid', 'true');
    field.classList.remove('validated');
    errorElement.textContent = validationResult.message;
    errorElement.classList.add('visible');
  }
}

/**
 * Validates a single field with debouncing
 * @param {HTMLElement} field - The input/textarea element
 */
function validateField(field) {
  const fieldName = field.name;
  const fieldValue = field.value;

  // Clear existing timer
  if (state.validationTimers[fieldName]) {
    clearTimeout(state.validationTimers[fieldName]);
  }

  // Debounce validation
  state.validationTimers[fieldName] = setTimeout(() => {
    const validator = getValidator(fieldName);
    const validationResult = validator(fieldValue);
    updateFieldUI(field, validationResult);

    // Store validation result
    state.formData[fieldName] = {
      value: fieldValue,
      isValid: validationResult.isValid,
    };
  }, config.validationDebounceDelay);
}

/**
 * Validates all form fields
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} True if all fields are valid
 */
function validateAllFields(form) {
  const fields = form.querySelectorAll('input, textarea');
  let allValid = true;

  fields.forEach(field => {
    if (!field.name) return;

    const validator = getValidator(field.name);
    const validationResult = validator(field.value);
    updateFieldUI(field, validationResult);

    if (!validationResult.isValid) {
      allValid = false;
    }

    // Store validation result
    state.formData[field.name] = {
      value: field.value,
      isValid: validationResult.isValid,
    };
  });

  return allValid;
}

/**
 * Shows feedback message to user
 * @param {HTMLElement} feedbackElement - The feedback container
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showFeedback(feedbackElement, type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = `form-feedback ${type} visible`;
  feedbackElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
  feedbackElement.setAttribute('aria-live', 'polite');

  if (type === 'success') {
    setTimeout(() => {
      feedbackElement.classList.remove('visible');
    }, config.successMessageDuration);
  }
}

/**
 * Sets button loading state
 * @param {HTMLButtonElement} button - The submit button
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.setAttribute('data-loading', 'true');
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
  } else {
    button.removeAttribute('data-loading');
    button.removeAttribute('aria-busy');
    button.disabled = false;
  }
}

/**
 * Sets button success state
 * @param {HTMLButtonElement} button - The submit button
 */
function setButtonSuccess(button) {
  button.setAttribute('data-state', 'success');

  setTimeout(() => {
    button.removeAttribute('data-state');
  }, 2000);
}

/**
 * Submits form data to external service
 * @param {FormData} formData - The form data to submit
 * @returns {Promise<Object>} Response from the service
 */
async function submitFormData(formData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.submitTimeout);

  try {
    const response = await fetch(config.formspreeEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(
        'Request timed out. Please check your connection and try again.'
      );
    }

    throw error;
  }
}

/**
 * Handles form submission
 * @param {Event} event - The submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  if (state.isSubmitting) {
    return;
  }

  const form = event.target;
  const submitButton = form.querySelector('.form-submit');
  const feedbackElement = form.querySelector('.form-feedback');

  // Validate all fields
  const isValid = validateAllFields(form);

  if (!isValid) {
    showFeedback(
      feedbackElement,
      'error',
      'Please correct the errors above before submitting.'
    );

    // Focus first invalid field
    const firstInvalidField = form.querySelector('[aria-invalid="true"]');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return;
  }

  // Set loading state
  state.isSubmitting = true;
  setButtonLoading(submitButton, true);
  feedbackElement.classList.remove('visible');

  try {
    const formData = new FormData(form);

    // Log submission attempt
    console.log('Submitting form data:', {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      messageLength: formData.get('message')?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // Submit to external service
    const response = await submitFormData(formData);

    console.log('Form submission successful:', response);

    // Show success feedback
    setButtonLoading(submitButton, false);
    setButtonSuccess(submitButton);
    showFeedback(
      feedbackElement,
      'success',
      'Thank you for your message! We will get back to you within 24 hours.'
    );

    // Reset form
    form.reset();

    // Clear validation state
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.setAttribute('aria-invalid', 'false');
      field.classList.remove('validated');
      const errorElement = document.getElementById(`${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
      }
    });

    state.formData = {};
  } catch (error) {
    console.error('Form submission error:', {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    setButtonLoading(submitButton, false);
    showFeedback(
      feedbackElement,
      'error',
      'Sorry, there was an error submitting your message. Please try again or contact us directly by phone.'
    );
  } finally {
    state.isSubmitting = false;
  }
}

/**
 * Initializes form validation and submission handling
 */
function initializeFormValidation() {
  const form = document.getElementById('contact-form');

  if (!form) {
    console.warn('Contact form not found. Form validation not initialized.');
    return;
  }

  console.log('Initializing contact form validation');

  // Add input event listeners for real-time validation
  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    if (!field.name) return;

    field.addEventListener('input', () => {
      validateField(field);
    });

    field.addEventListener('blur', () => {
      // Clear debounce timer on blur and validate immediately
      if (state.validationTimers[field.name]) {
        clearTimeout(state.validationTimers[field.name]);
      }

      const validator = getValidator(field.name);
      const validationResult = validator(field.value);
      updateFieldUI(field, validationResult);
    });
  });

  // Add submit event listener
  form.addEventListener('submit', handleFormSubmit);

  console.log('Contact form validation initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFormValidation);
} else {
  initializeFormValidation();
}

// Export functions for testing and external use
export {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateField,
  validateAllFields,
  handleFormSubmit,
  initializeFormValidation,
  config,
  state,
};
