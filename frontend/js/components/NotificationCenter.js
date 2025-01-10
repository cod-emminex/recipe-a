// frontend/js/components/NotificationCenter.js

class NotificationCenter {
  constructor() {
    this.container = this.createContainer();
    this.notifications = new Map();
    this.setupStateSubscription();
  }

  createContainer() {
    const container = document.createElement("div");
    container.className = "notification-center";
    document.body.appendChild(container);
    return container;
  }

  setupStateSubscription() {
    state.subscribe("notifications", (notifications) => {
      notifications.forEach((notification) => {
        if (!this.notifications.has(notification.id)) {
          this.showNotification(notification);
        }
      });
    });
  }

  showNotification(notification) {
    const element = document.createElement("div");
    element.className = `notification notification--${notification.type || "info"} notification--enter`;
    element.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">
                    ${this.getIconForType(notification.type)}
                </div>
                <div class="notification__message">
                    <h4>${notification.title || "Notification"}</h4>
                    <p>${notification.message}</p>
                </div>
                <button class="notification__close">&times;</button>
            </div>
            <div class="notification__progress"></div>
        `;

    this.container.appendChild(element);
    this.notifications.set(notification.id, {
      element,
      timeout: setTimeout(() => this.removeNotification(notification.id), 5000),
    });

    element
      .querySelector(".notification__close")
      .addEventListener("click", () =>
        this.removeNotification(notification.id)
      );
  }

  removeNotification(id) {
    const notification = this.notifications.get(id);
    if (notification) {
      clearTimeout(notification.timeout);
      notification.element.classList.add("notification--exit");
      setTimeout(() => {
        notification.element.remove();
        this.notifications.delete(id);
      }, 300);
    }
  }

  getIconForType(type) {
    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>',
    };
    return icons[type] || icons.info;
  }
}

export const notificationCenter = new NotificationCenter();
