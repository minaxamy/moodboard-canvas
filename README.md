# 🎨 Drag & Stack Moodboard

![Moodboard Demo](demo.gif)

An interactive web application for creating visual moodboards with drag-and-drop, stacking, and export functionality.

## ✨ Features

### 🖱️ **Core Features**

- **Drag & Drop**: Upload and arrange multiple images
- **Z-Index Stacking**: Last clicked item comes to front
- **Resize**: Drag corners to resize images
- **Rotate**: Right-click to set rotation angle
- **Snap-to-Grid**: Visual grid for alignment

### 🎮 **Interactive Controls**

- **Keyboard Navigation**: Arrow keys to nudge selected images
- **Bring to Front**: Automatic on click/drag
- **Delete**: Remove selected images with Delete key
- **Clear All**: Reset the entire board

### 📤 **Export**

- **PNG Export**: Save your moodboard as high-quality image
- **Sample Images**: Quick-start with built-in images
- **Responsive Design**: Works on desktop and tablet

## 🚀 Quick Start

1. **Open `index.html`** in your browser
2. **Upload images** or use sample images
3. **Drag** images to arrange
4. **Click** to select and bring to front
5. **Resize** from corners
6. **Right-click** to rotate
7. **Export** as PNG

No installation required - pure HTML/CSS/JS!

## 🛠️ Tech Stack

- **Vanilla JavaScript** (no frameworks)
- **Interact.js** for drag-and-drop
- **html2canvas** for PNG export
- **Modern CSS** with Flexbox
- **Font Awesome** icons

## 🎓 What I Learned

### **Technical Skills:**

- **DOM Manipulation**: Dynamic element creation and positioning
- **Event Handling**: Mouse, keyboard, drag, drop, right-click
- **Canvas Operations**: Coordinate systems and transformations
- **Library Integration**: Interact.js and html2canvas
- **State Management**: Tracking selected items and z-index

### **UI/UX Principles:**

- **Intuitive Design**: Visual feedback for all interactions
- **Responsive Layout**: Adapts to different screen sizes
- **User Flow**: Clear instructions and feedback
- **Performance**: Efficient event handling and rendering

## 🔧 Implementation Details

### **Z-Index Management:**

```javascript
// Global counter for stacking order
currentZIndex = 100;
element.style.zIndex = ++currentZIndex;
```
