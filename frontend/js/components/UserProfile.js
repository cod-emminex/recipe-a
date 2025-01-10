// frontend/js/components/UserProfile.js

class UserProfile {
  constructor() {
    this.currentUser = null;
    this.profileForm = null;
    this.passwordForm = null;
    this.init();
  }

  async init() {
    try {
      await this.loadUserData();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      showNotification("Failed to load profile data", "error");
    }
  }

  async loadUserData() {
    const response = await fetch("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load user data");
    this.currentUser = await response.json();
  }

  render() {
    const container = document.getElementById("profile-container");
    if (!container) return;

    container.innerHTML = `
            <div class="profile">
                <div class="profile__header">
                    <div class="profile__avatar">
                        <img src="${this.currentUser.profileImage || "/assets/images/default-avatar.png"}" 
                             alt="Profile picture" id="profile-avatar">
                        <button class="profile__avatar-upload" id="avatar-upload">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                    <div class="profile__info">
                        <h2>${this.currentUser.username}</h2>
                        <p>${this.currentUser.email}</p>
                    </div>
                </div>

                <div class="profile__tabs">
                    <button class="tab active" data-tab="general">General Info</button>
                    <button class="tab" data-tab="security">Security</button>
                    <button class="tab" data-tab="preferences">Preferences</button>
                </div>

                <div class="profile__content">
                    <!-- General Info Tab -->
                    <div class="tab-content active" id="general">
                        <form id="profile-form" class="form">
                            <div class="form__group">
                                <label class="form__label">Username</label>
                                <input type="text" class="form__input" name="username" 
                                       value="${this.currentUser.username}">
                            </div>
                            <div class="form__group">
                                <label class="form__label">Bio</label>
                                <textarea class="form__input form__textarea" name="bio">${this.currentUser.bio || ""}</textarea>
                            </div>
                            <div class="form__group">
                                <label class="form__label">Social Links</label>
                                <input type="url" class="form__input" name="facebook" 
                                       placeholder="Facebook URL" value="${this.currentUser.socialLinks?.facebook || ""}">
                                <input type="url" class="form__input" name="twitter" 
                                       placeholder="Twitter URL" value="${this.currentUser.socialLinks?.twitter || ""}">
                                <input type="url" class="form__input" name="instagram" 
                                       placeholder="Instagram URL" value="${this.currentUser.socialLinks?.instagram || ""}">
                            </div>
                            <button type="submit" class="btn btn--primary">Save Changes</button>
                        </form>
                    </div>

                    <!-- Security Tab -->
                    <div class="tab-content" id="security">
                        <form id="password-form" class="form">
                            <div class="form__group">
                                <label class="form__label">Current Password</label>
                                <input type="password" class="form__input" name="currentPassword">
                            </div>
                            <div class="form__group">
                                <label class="form__label">New Password</label>
                                <input type="password" class="form__input" name="newPassword">
                            </div>
                            <div class="form__group">
                                <label class="form__label">Confirm New Password</label>
                                <input type="password" class="form__input" name="confirmPassword">
                            </div>
                            <button type="submit" class="btn btn--primary">Update Password</button>
                        </form>
                    </div>

                    <!-- Preferences Tab -->
                    <div class="tab-content" id="preferences">
                        <form id="preferences-form" class="form">
                            <div class="form__group">
                                <label class="form__checkbox">
                                    <input type="checkbox" name="emailNotifications"
                                           ${this.currentUser.preferences?.notifications?.email ? "checked" : ""}>
                                    Receive email notifications
                                </label>
                            </div>
                            <div class="form__group">
                                <label class="form__checkbox">
                                    <input type="checkbox" name="showEmail"
                                           ${this.currentUser.preferences?.privacy?.showEmail ? "checked" : ""}>
                                    Show email on public profile
                                </label>
                            </div>
                            <button type="submit" class="btn btn--primary">Save Preferences</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

    this.profileForm = document.getElementById("profile-form");
    this.passwordForm = document.getElementById("password-form");
    this.preferencesForm = document.getElementById("preferences-form");
  }

  attachEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
    });

    // Avatar upload
    document.getElementById("avatar-upload")?.addEventListener("click", () => {
      this.handleAvatarUpload();
    });

    // Form submissions
    this.profileForm?.addEventListener("submit", (e) =>
      this.handleProfileUpdate(e)
    );
    this.passwordForm?.addEventListener("submit", (e) =>
      this.handlePasswordUpdate(e)
    );
    this.preferencesForm?.addEventListener("submit", (e) =>
      this.handlePreferencesUpdate(e)
    );
  }

  switchTab(tabId) {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("active", content.id === tabId);
    });
  }

  async handleProfileUpdate(event) {
    event.preventDefault();
    const formData = new FormData(this.profileForm);
    const data = {
      username: formData.get("username"),
      bio: formData.get("bio"),
      socialLinks: {
        facebook: formData.get("facebook"),
        twitter: formData.get("twitter"),
        instagram: formData.get("instagram"),
      },
    };

    try {
      const response = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      this.currentUser = await response.json();
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  async handlePasswordUpdate(event) {
    event.preventDefault();
    const formData = new FormData(this.passwordForm);

    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch("/api/v1/users/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword"),
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      this.passwordForm.reset();
      showNotification("Password updated successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  async handlePreferencesUpdate(event) {
    event.preventDefault();
    const formData = new FormData(this.preferencesForm);

    const preferences = {
      notifications: {
        email: formData.get("emailNotifications") === "on",
      },
      privacy: {
        showEmail: formData.get("showEmail") === "on",
      },
    };

    try {
      const response = await fetch("/api/v1/users/me/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error("Failed to update preferences");

      this.currentUser = await response.json();
      showNotification("Preferences updated successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  async handleAvatarUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/api/v1/users/me/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload avatar");

        const data = await response.json();
        document.getElementById("profile-avatar").src = data.profileImage;
        showNotification("Avatar updated successfully", "success");
      } catch (error) {
        showNotification(error.message, "error");
      }
    };

    input.click();
  }
}

export const userProfile = new UserProfile();
