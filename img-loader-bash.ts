const getLogger = require("webpack-log");
const log = getLogger({ name: "custom-loader" });

module.exports = function (source: string) {
  // Define a regular expression to match image paths of the form "img/..."
  const imgRegex = /img\/[^'"\s]+/g;
  // Use the regex to find all matches in the source code
  const imgMatches = source.match(imgRegex);
  // If matches are found, process them
  if (imgMatches) {
    // Get the module path without the "./" prefix
    const modulePath = this._module.rawRequest.replace(/^\.\//, "");
    // Extract unique image paths and format them for logging
    const imgPaths = [...new Set(imgMatches.map((match) => match.trim()))];
    imgPaths.forEach((imgPath) => {
      // Log the module name, image path, and the "entry" label
      log.info(`entry,${modulePath},./${imgPath}`);
    });
  }
  // Return the unmodified source code back to Webpack
  return source;
};

//vraća za bash scriptu:
/**
 * entry,Category,./img/avatar.png
 * entry,App,./img/avatar.png
 * entry,App,./img/logo.png
 * entry,Country,./img/logo.png
 */
