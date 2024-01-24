// function to access the json file and get the data
import imageData from "../assets.json" assert { type: "json" };

// global variables
let selectedAsset = [];
let filteredImagesByCategory = [];
let activeFilter = [];

// filter json data by category and subcategory
function filterAssetsByCategory(category, subcategory) {
  return imageData[category][subcategory]["assets"];
}

// filter json data by filter options
function filterAssetsByActiveFilter(imageData, activeFilter) {
  let filteredData = [];
  activeFilter.forEach((filter) => {
    imageData.forEach((item) => {
      if (item.keywords.includes(filter) && !filteredData.includes(item)) {
        filteredData.push(item);
      }
    });
  });
  renderImages(filteredData);
}

// console.log(filterAssetsByActiveFilter("old"));

// function to create the image card
function renderImages(filteredData) {
  // get the image container
  const imageContainer = document.getElementById("image-container");

  // Create a document fragment to hold the images
  const fragment = document.createDocumentFragment();

  // Clear previous content
  imageContainer.innerHTML = "";

  // Iterate over each item in the filtered data
  filteredData.forEach((item) => {
    const imgElement = document.createElement("img");
    imgElement.src = item.file_location;
    imgElement.alt = item.name;

    // add classes to the image element
    imgElement.classList.add(
      "catalog-image",
      "p-2",
      "pt-4",
      "bg-white",
      "rounded",
      "m-2",
      "shadow"
    );

    let isSelected = false;

    // COMMENT: SELECTION STILL NEEDS TO BE REFINED WITH KEEPING SELECTIONS WHEN SWITCHING CATEGORIES

    imgElement.addEventListener("click", () => {
      console.log("Clicked image " + item.name);

      if (!isSelected) {
        // add styling and push to selectedAsset array
        isSelected = true;
        imgElement.classList.toggle("border");
        imgElement.classList.toggle("border-secondary");
        selectedAsset.push(item.name);
      } else {
        // remove styling and remove from selectedAsset array
        isSelected = false;
        imgElement.classList.toggle("border");
        imgElement.classList.toggle("border-secondary");
        selectedAsset.splice(selectedAsset.indexOf(item.name), 1);
      }

      console.log(selectedAsset);
    });

    // Append the image to the document fragment
    fragment.appendChild(imgElement);
  });

  // Delay the append operation by 2 seconds
  // setTimeout(() => {
  //   // Append the entire document fragment to the container after the delay
  //   imageContainer.appendChild(fragment);
  // }, 500);

  imageContainer.appendChild(fragment);
}

let activeCategory = "Templates";
let activeSubCategory = "Frames";

let defaultImages = filterAssetsByCategory(activeCategory, activeSubCategory);

// console.log(defaultImages);

renderImages(defaultImages);

//

// get filter-options from JSON
function createFilter(category, subcategory) {
  const filterOptions = imageData[category][subcategory]["filter-options"];
  const filterContainer = document.getElementById("filter-container");

  // Create a document fragment to hold the filter options
  const fragment = document.createDocumentFragment();

  // Clear previous content
  filterContainer.innerHTML = "";

  // Iterate over each item in the filter options
  filterOptions.forEach((item) => {
    const filterElement = document.createElement("button");
    filterElement.innerText = item;
    filterElement.type = "button";
    filterElement.style.marginRight = "0.5rem";
    filterElement.style.marginBottom = "0.5rem";

    // add classes to the filter element
    filterElement.classList.add("btn", "btn-outline-secondary", "btn-sm");

    // Append the filter to the document fragment
    fragment.appendChild(filterElement);

    let isActive = false;

    // add a click event listener to each filter
    filterElement.addEventListener("click", () => {
      if (!isActive) {
        isActive = true;
        filterElement.classList.toggle("btn-outline-secondary");
        filterElement.classList.toggle("btn-secondary");

        activeFilter.push(item);
      } else {
        isActive = false;
        filterElement.classList.toggle("btn-outline-secondary");
        filterElement.classList.toggle("btn-secondary");

        activeFilter.splice(activeFilter.indexOf(item), 1);
      }

      // filter the images
      filterAssetsByActiveFilter(filteredImagesByCategory, activeFilter);

      console.log(activeFilter);
    });
  });

  // Append the entire document fragment to the container
  filterContainer.appendChild(fragment);
}

createFilter(activeCategory, activeSubCategory);

// add event listener to the DOMContentLoaded event
// this handles sidebar functionality
window.addEventListener("DOMContentLoaded", (event) => {
  // Get all elements with class 'sidebar-item'
  const sideBarItems = document.querySelectorAll(".sidebar-item");

  // Iterate over each 'sidebar-item'
  sideBarItems.forEach((sideBarItem) => {
    // Extract the numeric part from the 'id' attribute
    const sideBarItemId = sideBarItem.id.split("-")[1];

    // Find the corresponding 'sidebar-sub-items' based on the extracted ID
    const subCategories = document.getElementById(
      `sidebar-sub-items-${sideBarItemId}`
    );

    // get the sub-items as an array
    const subCategoriesArray = Array.from(subCategories.children);

    // get the icon
    const itemIcon = sideBarItem.querySelector("i");

    // Add a click event listener to each 'sidebar-item'
    sideBarItem.addEventListener("click", () => {
      // set the active category
      activeCategory = sideBarItem.innerText;
      // Toggle the visibility of the corresponding sub-items
      if (subCategories) {
        subCategories.classList.toggle("collapse");
      }

      // change the icon
      if (itemIcon) {
        itemIcon.classList.toggle("bi-chevron-right");
        itemIcon.classList.toggle("bi-chevron-down");
      }

      // add the "link-secondary" class to the clicked sidebar-item
      sideBarItem.classList.toggle("link-secondary");

      // other sidebar-items
      sideBarItems.forEach((item) => {
        if (item.id !== sideBarItem.id) {
          // remove the "link-secondary" class
          item.classList.remove("link-secondary");
          item.classList.remove("active");

          // collapse the sub-items
          const itemId = item.id.split("-")[1];
          const subItems = document.getElementById(
            `sidebar-sub-items-${itemId}`
          );
          if (subItems) {
            subItems.classList.add("collapse");
          }

          // change the icon
          const itemIcon = item.querySelector("i");
          itemIcon.classList.remove("bi-chevron-down");
          itemIcon.classList.add("bi-chevron-right");
        }
      });
    });

    // add a click event listener to each sub-item
    if (subCategories) {
      subCategoriesArray.forEach((subCategory) => {
        subCategory.addEventListener("click", () => {
          // set the active sub-category
          activeSubCategory = subCategory.innerText;
          // remove the "link-secondary" class from all sub-items of categories
          sideBarItems.forEach((item) => {
            const itemId = item.id.split("-")[1];
            const subItems = document.getElementById(
              `sidebar-sub-items-${itemId}`
            );
            if (subItems) {
              const subItemsArray = Array.from(subItems.children);
              subItemsArray.forEach((subItem) => {
                subItem.classList.remove("link-secondary");
              });
            }
          });

          // remove the "link-secondary" class
          subCategory.classList.toggle("link-secondary");

          filteredImagesByCategory = filterAssetsByCategory(
            activeCategory,
            activeSubCategory
          );

          // render the images and create the filter
          renderImages(filteredImagesByCategory);
          createFilter(activeCategory, activeSubCategory);

          // clear the active filter array
          activeFilter = [];
        });
      });
    }
  });
});