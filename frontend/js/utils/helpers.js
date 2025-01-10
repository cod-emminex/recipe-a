// frontend/js/utils/helpers.js

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${remainingMinutes}min`;
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
        <div class="notification__content">
            <p>${message}</p>
            <button class="notification__close">&times;</button>
        </div>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("notification--show"), 10);

  // Auto dismiss
  const dismissTimeout = setTimeout(() => {
    dismissNotification(notification);
  }, 5000);

  // Close button
  const closeBtn = notification.querySelector(".notification__close");
  closeBtn.addEventListener("click", () => {
    clearTimeout(dismissTimeout);
    dismissNotification(notification);
  });
}

function dismissNotification(notification) {
  notification.classList.remove("notification--show");
  setTimeout(() => notification.remove(), 300);
}

export const setupEventListeners = () => {
  // Form submissions
  document.addEventListener("submit", (e) => {
    if (e.target.matches("form")) {
      e.preventDefault();
      handleFormSubmit(e.target);
    }
  });

  // Dynamic content loading
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-load-more]")) {
      loadMoreContent(e.target.dataset.loadMore);
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
      );
    });
  }

  // Mobile menu
  const menuToggle = document.querySelector(".nav__toggle");
  const mobileMenu = document.querySelector(".nav__menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("show-menu");
    });
  }
};

async function handleFormSubmit(form) {
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Get form-specific validator
    const validatorName = form.dataset.validator;
    if (validatorName && validators[validatorName]) {
      const validator = validators[validatorName];
      if (!validator.validate(data)) {
        showFormErrors(form, validator.errors);
        return;
      }
    }

    // Show loading state
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Loading...";

    // Submit form
    const endpoint = form.action;
    const method = form.method.toUpperCase();
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    // Show success message
    showNotification("Success!", "success");
    form.reset();
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

function showFormErrors(form, errors) {
  // Clear existing errors
  form.querySelectorAll(".form__error").forEach((el) => el.remove());
  form.querySelectorAll(".form__input--invalid").forEach((el) => {
    el.classList.remove("form__input--invalid");
  });

  // Show new errors
  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add("form__input--invalid");

      const error = document.createElement("div");
      error.className = "form__error";
      error.textContent = message;

      input.parentNode.appendChild(error);
    }
  });
}

async function loadMoreContent(endpoint) {
  try {
    const button = document.querySelector(`[data-load-more="${endpoint}"]`);
    const container = document.querySelector(button.dataset.container);

    if (!container) return;

    const page = parseInt(button.dataset.page) || 1;
    const response = await fetch(`${endpoint}?page=${page + 1}`);
    const data = await response.json();

    if (data.items?.length) {
      // Append new content
      container.insertAdjacentHTML("beforeend", data.html);
      button.dataset.page = page + 1;

      // Hide button if no more pages
      if (page + 1 >= data.totalPages) {
        button.style.display = "none";
      }
    } else {
      button.style.display = "none";
    }
  } catch (error) {
    showNotification("Failed to load more content", "error");
  }
}
