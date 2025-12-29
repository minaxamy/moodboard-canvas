class MoodboardApp {
  constructor() {
    this.canvas = document.getElementById("moodboardCanvas");
    this.imageUpload = document.getElementById("imageUpload");
    this.exportBtn = document.getElementById("exportBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.addSampleBtn = document.getElementById("addSample");

    this.imageCount = document.getElementById("imageCount");
    this.selectedInfo = document.getElementById("selectedInfo");

    this.currentZIndex = 100;
    this.selectedElement = null;
    this.images = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // File upload
    this.imageUpload.addEventListener("change", (e) =>
      this.handleFileUpload(e)
    );
    this.addSampleBtn.addEventListener("click", () => this.addSampleImages());

    // Buttons
    this.exportBtn.addEventListener("click", () => this.exportAsPNG());
    this.clearBtn.addEventListener("click", () => this.clearAll());

    // Canvas click to deselect
    this.canvas.addEventListener("click", (e) => {
      if (e.target === this.canvas) {
        this.deselectAll();
      }
    });

    // Keyboard
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Drag and drop
    this.canvas.addEventListener("dragover", (e) => e.preventDefault());
    this.canvas.addEventListener("drop", (e) => {
      e.preventDefault();
      this.handleFileDrop(e.dataTransfer.files);
    });
  }

  handleFileUpload(event) {
    const files = Array.from(event.target.files);
    this.addImages(files);
    this.imageUpload.value = "";
  }

  handleFileDrop(files) {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    this.addImages(fileArray);
  }

  addImages(files) {
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.createImageElement(e.target.result, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  addSampleImages() {
    const sampleImages = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop",
    ];

    sampleImages.forEach((url, index) => {
      this.createImageElement(url, `sample-${index + 1}.jpg`);
    });
  }

  createImageElement(src, name) {
    // Hide placeholder
    document.getElementById("placeholder").style.display = "none";

    // Create container
    const container = document.createElement("div");
    container.className = "image-item";
    container.dataset.name = name;

    // Create image
    const img = document.createElement("img");
    img.src = src;
    img.draggable = false;

    // Create resize handles
    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${pos}`;
      container.appendChild(handle);
    });

    // Random position and size
    const x = Math.random() * (this.canvas.clientWidth - 200);
    const y = Math.random() * (this.canvas.clientHeight - 200);

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.width = "200px";
    container.style.height = "200px";
    container.style.zIndex = ++this.currentZIndex;

    container.appendChild(img);
    this.canvas.appendChild(container);

    // Make draggable and resizable
    this.makeInteractable(container);

    // Click to select and bring to front
    container.addEventListener("mousedown", () => {
      this.selectElement(container);
      container.style.zIndex = ++this.currentZIndex;
    });

    // Right-click to rotate
    container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.selectElement(container);
      const rotation = prompt("Enter rotation angle (0-360):", "0");
      if (rotation !== null) {
        container.style.transform = `rotate(${rotation}deg)`;
      }
    });

    this.images.push(container);
    this.updateImageCount();
  }

  makeInteractable(element) {
    const self = this;

    // Make draggable
    interact(element).draggable({
      listeners: {
        start(event) {
          self.selectElement(element);
        },
        move(event) {
          const x = (parseFloat(element.style.left) || 0) + event.dx;
          const y = (parseFloat(element.style.top) || 0) + event.dy;

          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
        },
      },
    });

    // Make resizable from corners
    interact(element).resizable({
      edges: { left: false, right: false, bottom: false, top: false },
      listeners: {
        move(event) {
          Object.assign(element.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
          });
        },
      },
    });

    // Make handles resizable
    element.querySelectorAll(".resize-handle").forEach((handle) => {
      interact(handle).draggable({
        listeners: {
          move(event) {
            const rect = element.getBoundingClientRect();
            const dx = event.dx;
            const dy = event.dy;

            if (handle.classList.contains("se")) {
              element.style.width = `${rect.width + dx}px`;
              element.style.height = `${rect.height + dy}px`;
            } else if (handle.classList.contains("sw")) {
              element.style.width = `${rect.width - dx}px`;
              element.style.height = `${rect.height + dy}px`;
              element.style.left = `${parseFloat(element.style.left) + dx}px`;
            } else if (handle.classList.contains("ne")) {
              element.style.width = `${rect.width + dx}px`;
              element.style.height = `${rect.height - dy}px`;
              element.style.top = `${parseFloat(element.style.top) + dy}px`;
            } else if (handle.classList.contains("nw")) {
              element.style.width = `${rect.width - dx}px`;
              element.style.height = `${rect.height - dy}px`;
              element.style.left = `${parseFloat(element.style.left) + dx}px`;
              element.style.top = `${parseFloat(element.style.top) + dy}px`;
            }
          },
        },
      });
    });
  }

  selectElement(element) {
    // Deselect current
    if (this.selectedElement) {
      this.selectedElement.classList.remove("selected");
    }

    // Select new
    this.selectedElement = element;
    element.classList.add("selected");

    // Update UI
    this.selectedInfo.textContent = element.dataset.name || "Image";
  }

  deselectAll() {
    if (this.selectedElement) {
      this.selectedElement.classList.remove("selected");
      this.selectedElement = null;
      this.selectedInfo.textContent = "None";
    }
  }

  handleKeyPress(e) {
    if (!this.selectedElement) return;

    const step = 10;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.nudgeSelected(0, -step);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.nudgeSelected(0, step);
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.nudgeSelected(-step, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        this.nudgeSelected(step, 0);
        break;
      case "Delete":
        e.preventDefault();
        this.removeSelected();
        break;
    }
  }

  nudgeSelected(dx, dy) {
    const element = this.selectedElement;
    const x = (parseFloat(element.style.left) || 0) + dx;
    const y = (parseFloat(element.style.top) || 0) + dy;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  removeSelected() {
    if (this.selectedElement) {
      const index = this.images.indexOf(this.selectedElement);
      if (index > -1) this.images.splice(index, 1);

      this.selectedElement.remove();
      this.deselectAll();
      this.updateImageCount();

      // Show placeholder if empty
      if (this.images.length === 0) {
        document.getElementById("placeholder").style.display = "block";
      }
    }
  }

  clearAll() {
    if (confirm("Clear all images?")) {
      this.images.forEach((img) => img.remove());
      this.images = [];
      this.deselectAll();
      this.updateImageCount();
      document.getElementById("placeholder").style.display = "block";
    }
  }

  updateImageCount() {
    this.imageCount.textContent = this.images.length;
  }

  async exportAsPNG() {
    try {
      this.exportBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Exporting...';
      this.exportBtn.disabled = true;

      const canvas = await html2canvas(this.canvas, {
        backgroundColor: "#f8fafc",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `moodboard-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      alert("Export failed. Please try again.");
      console.error(error);
    } finally {
      this.exportBtn.innerHTML =
        '<i class="fas fa-download"></i> Export as PNG';
      this.exportBtn.disabled = false;
    }
  }
}

// Start the app when page loads
window.addEventListener("DOMContentLoaded", () => {
  new MoodboardApp();
});
