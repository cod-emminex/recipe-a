// client/src/services/featureFlags.js
class FeatureFlags {
  constructor() {
    this.flags = new Map();
    this.userGroups = new Set();
    this.initialized = false;
  }

  async initialize(userId) {
    try {
      const response = await fetch("/api/features/flags");
      const data = await response.json();

      this.flags = new Map(Object.entries(data.flags));
      this.userGroups = new Set(data.userGroups);
      this.initialized = true;

      // Track user assignment
      this.trackAssignment(userId);
    } catch (error) {
      console.error("Error initializing feature flags:", error);
      // Use default flags in case of error
      this.setDefaultFlags();
    }
  }

  setDefaultFlags() {
    this.flags.set("newRecipeEditor", false);
    this.flags.set("advancedSearch", false);
    this.flags.set("socialFeatures", true);
    this.initialized = true;
  }

  isEnabled(flagName) {
    if (!this.initialized) {
      console.warn("Feature flags not initialized");
      return false;
    }
    return this.flags.get(flagName) || false;
  }

  isUserInGroup(groupName) {
    return this.userGroups.has(groupName);
  }

  getVariant(experimentName, defaultVariant = "control") {
    if (!this.initialized) return defaultVariant;

    const experiment = this.flags.get(`experiment_${experimentName}`);
    return experiment?.variant || defaultVariant;
  }

  trackAssignment(userId) {
    // Track which features/experiments were assigned to the user
    const assignment = {
      userId,
      timestamp: new Date().toISOString(),
      flags: Object.fromEntries(this.flags),
      groups: Array.from(this.userGroups),
    };

    fetch("/api/features/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment),
    }).catch(console.error);
  }
}

export default new FeatureFlags();
