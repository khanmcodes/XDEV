# XDEV - Web Inspector

A modern Web extension that provides detailed styling information for web elements with a beautiful, intuitive interface.

![image](https://github.com/user-attachments/assets/45dc8986-cbf2-4fcd-8366-b22ca022f530)

## Features

### 🎯 Text Properties
- Font family and size
- Line height
- Letter spacing
- Text color with hex values

### 📦 Container Properties
- Padding and margin values
- Layout information (Flex/Grid)
- Background colors and images
- Border details
- Box shadow information

### 🎨 Visual Features
- Clean, modern interface
- Color swatches with hex values
- Intuitive icons for different properties
- Smooth transitions and hover effects
- Organized sections with clear separation

### ⚙️ Functionality
- Toggle inspector on/off
- Automatic property detection
- Smart element type detection
- Persistent settings
- Non-intrusive overlay

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/khanmcodes/XDEV.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned directory

## Usage

1. Click the XDEV extension icon in your Chrome toolbar
2. Toggle the inspector on/off using the switch
3. Hover over any element on the webpage to see its styling details
4. Properties are automatically grouped and displayed based on element type

## Property Details

### Text Elements
- Font family (with preview)
- Font size
- Line height
- Letter spacing
- Text color (with hex value)

### Container Elements
- Layout type (Flex/Grid)
- Layout properties (direction, alignment, gap)
- Padding and margin values
- Background properties
- Border details (width, style, color, radius)
- Box shadow (offset, blur, spread, color)

## Development

The extension is built with vanilla JavaScript and uses:
- Chrome Extension Manifest V3
- Chrome Storage API for persistence
- Chrome Messaging API for popup-content script communication

### Project Structure
```
xdev-extension/
├── manifest.json     # Extension configuration
├── popup.html       # Toggle interface
├── popup.js         # Popup functionality
├── content.js       # Main inspector logic
└── icon.png         # Extension icon
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Khanm** - [khanmcodes](https://khanmcodes.vercel.app)

## Acknowledgments

- Icons from [icons8.com](https://icons8.com)
- Inspired by modern design tools and browser dev tools 
