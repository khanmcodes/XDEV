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
  spacing: 'https://img.icons8.com/ios-glyphs/100/add-white-space.png',
  padding: 'https://img.icons8.com/ios-filled/100/resize-four-directions.png',
  margin: 'https://img.icons8.com/ios-filled/100/move.png',
  layout: 'https://img.icons8.com/ios-filled/100/grid.png',
  border: 'https://img.icons8.com/ios-filled/100/rectangle.png'
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

// Function to format spacing values
const formatSpacing = (top, right, bottom, left) => {
  if (top === right && right === bottom && bottom === left) {
    return top; // All sides equal
  }
  if (top === bottom && left === right) {
    return `${top} ${right}`; // Vertical | Horizontal
  }
  return `${top} ${right} ${bottom} ${left}`; // All different
};

let tooltipTimeout;
let lastHighlightedElement = null;

// Function to remove highlight from element
const removeHighlight = (element) => {
  if (element && element.style) {
    element.style.outline = '';
    element.style.boxShadow = '';
  }
};

// Function to add highlight to element
const addHighlight = (element) => {
  if (element && element.style) {
    element.style.outline = '2px solid rgba(49, 49, 49, 0.8)';
    element.style.boxShadow = '0 0 0 4px rgba(204, 204, 204, 0.8)';
  }
};

// Function to check if element is primarily text-based
const isTextElement = (element) => {
  const textTags = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'STRONG', 'EM', 'LABEL', 'LI'];
  return textTags.includes(element.tagName) || 
         (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3);
};

// Function to parse border string
const parseBorder = (borderStr) => {
  if (borderStr === 'none') return null;
  const parts = borderStr.split(' ');
  return {
    width: parts[0] || '0px',
    style: parts[1] || 'none',
    color: parts.slice(2).join(' ') || 'transparent'
  };
};

// Function to parse box shadow
const parseBoxShadow = (shadowStr) => {
  if (shadowStr === 'none') return null;
  const parts = shadowStr.split(' ');
  return {
    offsetX: parts[0] || '0px',
    offsetY: parts[1] || '0px',
    blur: parts[2] || '0px',
    spread: parts[3] || '0px',
    color: parts.slice(4).join(' ') || 'transparent'
  };
};

// Function to generate combined tooltip content
const getElementTooltipContent = (el, style) => {
  const hasText = el.textContent.trim();
  const isContainer = !isTextElement(el) || el.tagName === 'BUTTON';
  
  // Get text properties
  const textContent = hasText ? `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <img src="${icons.font}" width="16" height="16" style="filter: invert(1);">
        <span style="font-size: 15px; font-weight: 500;">${style.fontFamily}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px; color: rgba(255,255,255,0.9);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <img src="${icons.size}" width="12" height="12" style="filter: invert(1);">
          <span>${style.fontSize}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <img src="${icons.lineHeight}" width="12" height="12" style="filter: invert(1); transform: rotate(90deg);">
          <span>${style.lineHeight}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <img src="${icons.spacing}" width="12" height="12" style="filter: invert(1);">
          <span>${style.letterSpacing !== "normal" ? style.letterSpacing : "0px"}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${style.color}; border-radius: 2px;"></span>
          <span>${colorToHex(style.color)}</span>
        </div>
      </div>
    </div>
  ` : '';

  // Get container properties if applicable
  let containerContent = '';
  if (isContainer) {
    const display = style.display;
    const isGrid = display === 'grid';
    const isFlex = display === 'flex' || display === 'inline-flex';
    
    // Get layout properties
    const layoutDetails = [];
    if (isGrid) {
      layoutDetails.push(
        `grid-template-columns: ${style.gridTemplateColumns}`,
        `grid-template-rows: ${style.gridTemplateRows}`,
        `gap: ${style.gap}`
      );
    } else if (isFlex) {
      layoutDetails.push(
        `flex-direction: ${style.flexDirection}`,
        `justify-content: ${style.justifyContent}`,
        `align-items: ${style.alignItems}`,
        `gap: ${style.gap}`
      );
    }

    // Get spacing values
    const padding = formatSpacing(
      style.paddingTop,
      style.paddingRight,
      style.paddingBottom,
      style.paddingLeft
    );
    const margin = formatSpacing(
      style.marginTop,
      style.marginRight,
      style.marginBottom,
      style.marginLeft
    );

    // Parse border and shadow
    const border = parseBorder(style.border);
    const shadow = parseBoxShadow(style.boxShadow);
    const backgroundColor = style.backgroundColor;
    const backgroundImage = style.backgroundImage;

    containerContent = `
      <div style="color: rgba(255,255,255,0.9);">
          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${icons.padding}" width="12" height="12" style="filter: invert(1);">
              <span>Padding: ${padding}</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${icons.margin}" width="12" height="12" style="filter: invert(1);">
              <span>Margin: ${margin}</span>
            </div>
          </div>
        ${(isGrid || isFlex) ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">Layout: ${display}</div>
            ${layoutDetails.map(detail => `<div style="font-family: monospace; font-size: 12px;">${detail}</div>`).join('')}
          </div>
        ` : ''}
        ${backgroundColor !== 'rgba(0, 0, 0, 0)' || backgroundImage !== 'none' ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Background</div>
            ${backgroundColor !== 'rgba(0, 0, 0, 0)' ? `
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 12px; height: 12px; background: ${backgroundColor}; border-radius: 2px;"></span>
                <span>${colorToHex(backgroundColor)}</span>
              </div>
            ` : ''}
            ${backgroundImage !== 'none' ? `
              <div style="font-family: monospace; font-size: 12px;">${backgroundImage}</div>
            ` : ''}
          </div>
        ` : ''}
        ${border ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Border</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div>Width: ${border.width} ${border.style}</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                Color: 
                <span style="display: inline-block; width: 12px; height: 12px; background: ${border.color}; border-radius: 2px;"></span>
                <span>${colorToHex(border.color)}</span>
              </div>
              ${style.borderRadius !== '0px' ? `<div>Border Radius: ${style.borderRadius}</div>` : ''}
            </div>
          </div>
        ` : ''}
        ${shadow ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Shadow</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div>Offset: ${shadow.offsetX} ${shadow.offsetY}</div>
              <div>Blur: ${shadow.blur}</div>
              ${shadow.spread !== '0px' ? `<div>Spread: ${shadow.spread}</div>` : ''}
              <div style="display: flex; align-items: center; gap: 6px;">
                Color: 
                <span style="display: inline-block; width: 12px; height: 12px; background: ${shadow.color}; border-radius: 2px;"></span>
                <span>${colorToHex(shadow.color)}</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  return textContent + containerContent;
};

// Track mouse and update tooltip
document.addEventListener('mousemove', (e) => {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  
  // Clear any existing timeout
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }

  // Remove highlight from last element
  if (lastHighlightedElement && lastHighlightedElement !== el) {
    removeHighlight(lastHighlightedElement);
  }

  if (!el || el === tooltip) {
    // Start fade out
    tooltipTimeout = setTimeout(() => {
      tooltip.style.opacity = '0';
      if (lastHighlightedElement) {
        removeHighlight(lastHighlightedElement);
        lastHighlightedElement = null;
      }
    }, 100);
    return;
  }

  const style = getComputedStyle(el);

  // Show tooltip if element is valid
  if (el.textContent.trim() || !isTextElement(el)) {
    // Add highlight to current element
    addHighlight(el);
    lastHighlightedElement = el;

    // Generate tooltip content
    tooltip.innerHTML = getElementTooltipContent(el, style);
    
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
    if (lastHighlightedElement) {
      removeHighlight(lastHighlightedElement);
      lastHighlightedElement = null;
    }
  }
});

// Hide tooltip when mouse leaves text
document.addEventListener('mouseout', (e) => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  tooltip.style.opacity = '0';
  if (lastHighlightedElement) {
    removeHighlight(lastHighlightedElement);
    lastHighlightedElement = null;
  }
});
