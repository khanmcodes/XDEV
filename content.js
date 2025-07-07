// Create the tooltip
const tooltip = document.createElement('div');
tooltip.style.position = 'fixed';
tooltip.style.pointerEvents = 'none';
tooltip.style.padding = '12px 16px';
tooltip.style.background = 'rgba(33, 33, 33, 0.95)';
tooltip.style.color = '#ffffff';
tooltip.style.borderRadius = '8px';
tooltip.style.fontSize = '13px';
tooltip.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
tooltip.style.zIndex = '999999';
tooltip.style.transition = 'all 0.2s ease';
tooltip.style.opacity = '0';
tooltip.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
tooltip.style.backdropFilter = 'blur(5px)';
tooltip.style.border = '1px solid rgba(255, 255, 255, 0.1)';

// Define icons
const icons = {
  font: 'https://img.icons8.com/ios-filled/100/sentence-case.png',
  size: 'https://img.icons8.com/fluency-systems-filled/100/sentence-case.png',
  lineHeight: 'https://img.icons8.com/ios-glyphs/100/add-white-space.png',
  spacing: 'https://img.icons8.com/ios-glyphs/100/add-white-space.png'
};

document.body.appendChild(tooltip);

// Convert RGB/RGBA color to Hex
const colorToHex = (color) => {
  // Create a temporary div to compute the color
  const div = document.createElement('div');
  div.style.color = color;
  document.body.appendChild(div);
  const computed = getComputedStyle(div).color;
  document.body.removeChild(div);
  
  // Extract RGB values
  const match = computed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return color; // Return original if conversion fails
  
  // Convert to hex
  const hex = '#' + match.slice(1).map(n => {
    const hex = parseInt(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
  
  return hex.toUpperCase();
};

let tooltipTimeout;

// Track mouse and update tooltip
document.addEventListener('mousemove', (e) => {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  
  // Clear any existing timeout
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }

  if (!el || el === tooltip) {
    // Start fade out
    tooltipTimeout = setTimeout(() => {
      tooltip.style.opacity = '0';
    }, 100);
    return;
  }

  const style = getComputedStyle(el);
  const font = style.fontFamily;
  const color = style.color;
  const fontSize = style.fontSize;
  const lineHeight = style.lineHeight;
  const letterSpacing = style.letterSpacing;
  const hexColor = colorToHex(color);

  // Only show tooltip if element has text content
  if (el.textContent.trim()) {
    // Format the tooltip content with icons
    tooltip.innerHTML = `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <img src="${icons.font}" width="16" height="16" style="filter: invert(1);">
          <span style="font-size: 15px; font-weight: 500;">${font}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px; color: rgba(255,255,255,0.9);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${icons.size}" width="12" height="12" style="filter: invert(1);">
            <span>${fontSize}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${icons.lineHeight}" width="12" height="12" style="filter: invert(1); transform: rotate(90deg);">
            <span>${lineHeight}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${icons.spacing}" width="12" height="12" style="filter: invert(1);">
            <span>${letterSpacing !== "normal" ? letterSpacing : "0px"}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.72);"></span>
            <span>${hexColor}</span>
          </div>
        </div>
      </div>
    `;
    
    // Position tooltip with smooth follow
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = e.clientX + 12;
    let top = e.clientY + 12;
    
    // Prevent tooltip from going off-screen
    if (left + tooltipRect.width > viewportWidth) {
      left = e.clientX - tooltipRect.width - 12;
    }
    if (top + tooltipRect.height > viewportHeight) {
      top = e.clientY - tooltipRect.height - 12;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.opacity = '1';
  } else {
    tooltip.style.opacity = '0';
  }
});

// Hide tooltip when mouse leaves text
document.addEventListener('mouseout', (e) => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  tooltip.style.opacity = '0';
});
