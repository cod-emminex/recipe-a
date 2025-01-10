// frontend/js/components/Modal.js

export class Modal {
  constructor(id, options = {}) {
    this.id = id;
    this.options = {
      closeable: true,
      onClose: () => {},
      onOpen: () => {},
      ...options,
    };
    this.element = document.getElementById(id);
    this.setupModal();
  }

  setupModal() {
    if (!this.element) {
      this.element = document.createElement("div");
      this.element.id = this.id;
      this.element.className = "modal";
      document.body.appendChild(this.element);
    }

    this.element.innerHTML = `
            <div class="modal__overlay"></div>
            <div class="modal__container">
                ${this.options.closeable ? '<button class="modal__close">&times;</button>' : ""}
                <div class="modal__content"></div>
            </div>
        `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    if (this.options.closeable) {
      const closeButton = this.element.querySelector(".modal__close");
      const overlay = this.element.querySelector(".modal__overlay");

      closeButton?.addEventListener("click", () => this.close());
      overlay?.addEventListener("click", () => this.close());
    }

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.options.closeable) {
        this.close();
      }
    });
  }

  setContent(content) {
    const contentContainer = this.element.querySelector(".modal__content");
    if (typeof content === "string") {
      contentContainer.innerHTML = content;
    } else if (content instanceof Element) {
      contentContainer.innerHTML = "";
      contentContainer.appendChild(content);
    }
  }

  open() {
    document.body.classList.add("modal-open");
    this.element.classList.add("modal--open");
    this.options.onOpen();
  }

  close() {
    document.body.classList.remove("modal-open");
    this.element.classList.remove("modal--open");
    this.options.onClose();
  }

  destroy() {
    this.element.remove();
  }
}
