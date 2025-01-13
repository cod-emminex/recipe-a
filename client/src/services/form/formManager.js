// client/src/services/form/formManager.js
import { validate } from "../../utils/validation";
import { eventBus } from "../eventBus";

class FormManager {
  constructor() {
    this.forms = new Map();
    this.validators = new Map();
    this.transformers = new Map();
  }

  registerForm(formId, config = {}) {
    const form = {
      values: config.initialValues || {},
      errors: {},
      touched: {},
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      validate: config.validate || (() => ({})),
      onSubmit: config.onSubmit || (() => {}),
    };

    this.forms.set(formId, form);
    return this.getFormControls(formId);
  }

  getFormControls(formId) {
    const form = this.forms.get(formId);
    if (!form) throw new Error(`Form ${formId} not found`);

    return {
      values: form.values,
      errors: form.errors,
      touched: form.touched,
      isDirty: form.isDirty,
      isSubmitting: form.isSubmitting,
      submitCount: form.submitCount,

      setValue: (field, value) => this.setValue(formId, field, value),
      setValues: (values) => this.setValues(formId, values),
      setError: (field, error) => this.setError(formId, field, error),
      setTouched: (field, isTouched = true) =>
        this.setTouched(formId, field, isTouched),
      reset: () => this.resetForm(formId),
      validate: () => this.validateForm(formId),
      handleSubmit: (e) => this.handleSubmit(formId, e),
    };
  }

  async setValue(formId, field, value) {
    const form = this.forms.get(formId);
    if (!form) return;

    // Apply transformers
    if (this.transformers.has(field)) {
      value = this.transformers.get(field)(value);
    }

    form.values = {
      ...form.values,
      [field]: value,
    };
    form.isDirty = true;

    // Validate field
    const validator = this.validators.get(field);
    if (validator) {
      const error = await validator(value, form.values);
      if (error) {
        form.errors[field] = error;
      } else {
        delete form.errors[field];
      }
    }

    eventBus.emit(`form:${formId}:change`, {
      field,
      value,
      values: form.values,
      errors: form.errors,
    });
  }

  setValues(formId, values) {
    const form = this.forms.get(formId);
    if (!form) return;

    form.values = { ...values };
    form.isDirty = true;
    this.validateForm(formId);
  }

  setError(formId, field, error) {
    const form = this.forms.get(formId);
    if (!form) return;

    if (error) {
      form.errors[field] = error;
    } else {
      delete form.errors[field];
    }
  }

  setTouched(formId, field, isTouched) {
    const form = this.forms.get(formId);
    if (!form) return;

    form.touched[field] = isTouched;
  }

  async validateForm(formId) {
    const form = this.forms.get(formId);
    if (!form) return;

    const errors = await form.validate(form.values);
    form.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(formId, e) {
    e?.preventDefault();

    const form = this.forms.get(formId);
    if (!form) return;

    form.isSubmitting = true;
    form.submitCount++;

    try {
      const isValid = await this.validateForm(formId);
      if (!isValid) {
        throw new Error("Form validation failed");
      }

      await form.onSubmit(form.values);

      eventBus.emit(`form:${formId}:submit:success`, {
        values: form.values,
      });
    } catch (error) {
      eventBus.emit(`form:${formId}:submit:error`, {
        error,
        values: form.values,
      });
      throw error;
    } finally {
      form.isSubmitting = false;
    }
  }

  resetForm(formId) {
    const form = this.forms.get(formId);
    if (!form) return;

    form.values = {};
    form.errors = {};
    form.touched = {};
    form.isDirty = false;
    form.isSubmitting = false;

    eventBus.emit(`form:${formId}:reset`);
  }

  registerValidator(field, validator) {
    this.validators.set(field, validator);
  }

  registerTransformer(field, transformer) {
    this.transformers.set(field, transformer);
  }
}

export const formManager = new FormManager();

// Register common validators
formManager.registerValidator("email", validate.email);
formManager.registerValidator("password", validate.password);

// Register common transformers
formManager.registerTransformer("email", (value) => value.trim().toLowerCase());
