// frontend/js/components/ImageUpload.js

export class ImageUpload {
  constructor(options = {}) {
    this.options = {
      maxSize: 5 * 1024 * 1024, // 5MB
      acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
      multiple: false,
      onUpload: () => {},
      onError: () => {},
      ...options,
    };

    this.element = this.createUploader();
  }

  createUploader() {
    const container = document.createElement("div");
    container.className = "image-upload";
    container.innerHTML = `
            <div class="image-upload__dropzone">
                <input type="file" class="image-upload__input" 
                       ${this.options.multiple ? "multiple" : ""}
                       accept="${this.options.acceptedTypes.join(",")}">
                <div class="image-upload__placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag & Drop or Click to Upload</p>
                    <span class="image-upload__info">
                        Max size: ${this.formatSize(this.options.maxSize)}
                    </span>
                </div>
            </div>
            <div class="image-upload__preview"></div>
        `;

    this.attachEventListeners(container);
    return container;
  }

  attachEventListeners(container) {
    const dropzone = container.querySelector(".image-upload__dropzone");
    const input = container.querySelector(".image-upload__input");

    // Handle drag and drop
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("image-upload__dropzone--active");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("image-upload__dropzone--active");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("image-upload__dropzone--active");
      this.handleFiles(Array.from(e.dataTransfer.files));
    });

    // Handle click upload
    input.addEventListener("change", () => {
      this.handleFiles(Array.from(input.files));
    });
  }

  handleFiles(files) {
    files.forEach((file) => {
      if (!this.validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.createPreview(file, e.target.result);
        this.options.onUpload(file);
      };
      reader.readAsDataURL(file);
    });
  }

  validateFile(file) {
    if (!this.options.acceptedTypes.includes(file.type)) {
      this.options.onError("Invalid file type");
      return false;
    }

    if (file.size > this.options.maxSize) {
      this.options.onError("File too large");
      return false;
    }

    return true;
  }

  createPreview(file, url) {
    const preview = this.element.querySelector(".image-upload__preview");
    const previewItem = document.createElement("div");
    previewItem.className = "image-upload__preview-item";
    previewItem.innerHTML = `
            <img src="${url}" alt="${file.name}">
            <button class="image-upload__remove">&times;</button>
        `;

    previewItem
      .querySelector(".image-upload__remove")
      .addEventListener("click", () => {
        previewItem.remove();
      });

    preview.appendChild(previewItem);
  }

  formatSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  clear() {
    const preview = this.element.querySelector(".image-upload__preview");
    preview.innerHTML = "";
    this.element.querySelector(".image-upload__input").value = "";
  }
}
