const getLogger2 = require("webpack-log");
const log2 = getLogger({ name: "custom-loader" });

module.exports = function (source: string) {
  // Define a regular expression to match image paths of the form "img/..."
  const imgRegex = /img\/[^'"\s]+/g;
  // Use the regex to find all matches in the source code
  const imgMatches = source.match(imgRegex);
  // If matches are found, process them
  if (imgMatches) {
    // Extract unique image paths and format them as a comma-separated string
    const imgPaths = [...new Set(imgMatches.map((match) => match.trim()))].join(", ");
    // Log the module name and image paths with the logger instance
    log2.info(`entry ${this._module.rawRequest}, images: ${imgPaths}`);
  }
  // Return the unmodified source code back to Webpack
  return source;
};

//vraća za preview:
/**
 * entry./ App, images: img / avatar.png, img / logo.png
 * entry ./Category, images: img/avatar.png
 * entry ./Country, images: img/logo.png
 */
