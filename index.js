"use strict";

const plugin = require("tailwindcss/plugin");

exports.__esModule = true;

exports.default = plugin(({ addUtilities, theme, addVariant }) => {
  const colors = theme("colors")();
  const utilities = {
    "@keyframes ripple-effect": Object.fromEntries(
      Array.from({ length: 50 }, (_, n) => [
        `${n * 2}%`,
        { "--ripple-scale": `${n}%` },
      ])
    ),
    ".ripple-effect": {
      "--ripple-speed": "0.2s",
      "--ripple-color": "14 165 233",
      "--ripple-on": "0",
      "background-position": "var(--ripple-unset)",
      "background-size": "var(--ripple-unset)",
      "background-origin": "var(--ripple-unset)",
      "background-clip": "var(--ripple-unset)",
      "background-attachment": "var(--ripple-unset)",
      "background-repeat": "var(--ripple-no-repeat)",
      "background-image":
        "radial-gradient(circle at var(--ripple-offset-x) var(--ripple-offset-y), rgb(var(--ripple-color) / calc(100% - var(--ripple-on) * var(--ripple-scale))) calc(2 * var(--ripple-on) * var(--ripple-scale)), transparent calc(1.5 * var(--ripple-on) * var(--ripple-scale) + 1%))",
      animation: "ripple-effect var(--ripple-speed) linear",
    },
    ".ripple-slow": {
      "--ripple-speed": "0.5s",
    },
  };

  for (const colorKey of Object.keys(colors)) {
    const colorVariants = colors[colorKey];
    if (typeof colorVariants === "object") {
      for (const variantKey of Object.keys(colorVariants)) {
        const rippleColor = colorToRGBPlain(colorVariants[variantKey]);
        if (rippleColor) {
          utilities[`.ripple-${colorKey}-${variantKey}`] = {
            "--ripple-color": rippleColor,
          };
        }
      }
    }
  }

  addVariant("ripple-bg", ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.ripple-bg${separator}${className}`;
    });
  });

  addUtilities(utilities, ["responsive", "hover", "ripple-bg"]);
});

// Helper function to convert Hex or RGB to Oklch
function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {  // 3 digits
    r = Number("0x" + hex[1] + hex[1]);
    g = Number("0x" + hex[2] + hex[2]);
    b = Number("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {  // 6 digits
    r = Number("0x" + hex[1] + hex[2]);
    g = Number("0x" + hex[3] + hex[4]);
    b = Number("0x" + hex[5] + hex[6]);
  }

  return `${r} ${g} ${b}`;
}

function rgbToRGBPlain(rgb) {
  return rgb.slice(4, -1).replace(/,\s*/g, " ");
}

// Function to convert any color to Oklch
function colorToRGBPlain(color) {
  if (typeof color !== "string") {
    return null;
  }
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }
  if (color.startsWith("rgb(")) {
    return rgbToRGBPlain(color);
  }
  if (color.startsWith("oklch(")) {
    return color; // Return the Oklch color as is
  }
  if (/^(\d+)\s+(\d+)\s+(\d+)$/.test(color)) {
    return color;
  }
  return null;
}
