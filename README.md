# webpack-custom-loader

compile typescript loader to javascript before using them

```typescript
npx tsc
```

make the bash script runnable
```bash
chmod +x script.sh
```


## img-loader-preview.js

custom loader that checks all webpack entry points and logs out images used in that entry point.
eg.

```bash
⬡ custom-loader: entry ./Country, images: img/logo.png
⬡ custom-loader: entry ./Category, images: img/avatar.png
⬡ custom-loader: entry ./App, images: img/avatar.png, img/logo.png
```

## img-loader-bash.js

Does the same thing except it returns them formatted for bash script
eg.

```bash
⬡ custom-loader: entry,Category,./img/avatar.png
⬡ custom-loader: entry,App,./img/avatar.png
⬡ custom-loader: entry,App,./img/logo.png
⬡ custom-loader: entry,Country,./img/logo.png
```

### webpack config example for multiple application entries

```javascript

  const buildFilePath = (modulePath) => {
    // skidam "/" sa početka i kraja stringa
    if (modulePath[0] !== "/") modulePath = `/${modulePath}`;
    if (modulePath.length > 1 && modulePath[modulePath.length - 1] !== "/") modulePath = `${modulePath}/`;

    return `.${modulePath}script/` + (devMode ? `[name]Entry.js` : `entry.[contenthash].js`);
  };

    entry: {
      main: { import: srcDir + "index.tsx", filename: buildFilePath("/") },
      sisCategory: {
        import: srcDir + "sisCategory.tsx",
        filename: buildFilePath("/sisCategory"),
      },
      sisCountry: {
        import: srcDir + "sisCountry.tsx",
        filename: buildFilePath("/sisCountry"),
      },
    },

```

### webpack config example for usage of custom loader

```javascript
rules: [
  {
    test: /\.(js|jsx|ts|tsx)?$/,
    use: ["ts-loader", path.resolve(__dirname, "img-loader-bash.js")],
    exclude: /node_modules/,
  },
];
```

## script.sh

Bash script that creates folder structure for images based on the category data. If image is used in multiple categories, creates a new folder called "shared". Reads data from input.txt

```bash
declare -A category_images
declare -A image_counts

# Read each line of the input file and process the data
while read line; do
  # Split the line into its components using IFS and read the values into variables
  IFS=',' read -r category sub_category image <<< "$line"

  # Clean up the image path by removing leading spaces and the leading dot
  image="$(echo $image | sed -e 's/^[[:space:]]*//' -e 's/^\.//' -e 's#//#/#g')"

  # Add the image to the list of images for the current sub-category
  category_images["$sub_category"]="${category_images["$sub_category"]} $image"

  # Increment the count for the current image
  image_counts["$image"]=$((image_counts["$image"] + 1))
done < input.txt

# Create the shared folder
mkdir -p shared/img

# Loop through each sub-category
for sub_category in "${!category_images[@]}"; do
  # Create the folder for the sub-category
  mkdir -p "$sub_category/img"

  # Loop through each image for the current sub-category
  for image in ${category_images[$sub_category]}; do
    # Check if the image is shared (appears in more than one category)
    if [ "${image_counts[$image]}" -gt 1 ]; then
      # Move the shared image to the shared folder
      mv "src/$image" "shared/img"
    else
      # Move the non-shared image to the sub-category folder
      mv "src/$image" "$sub_category/img"
    fi
  done
done
```
