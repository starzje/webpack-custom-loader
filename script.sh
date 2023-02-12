#!/bin/bash
## This script reads a CSV file containing category, sub-category and image path data
## and creates a folder structure for the images based on the category and sub-category
## data. If an image is shared between multiple sub-categories, it is moved to a shared
## folder. The script assumes that the images are stored in a folder called "src" and
## that the CSV file is called "input.txt".


# Declare associative arrays to store the category images and image counts
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




