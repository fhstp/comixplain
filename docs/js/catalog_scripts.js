// function to access the json file and get the data
import imageData from "../assets.json" assert { type: "json" };

console.log(typeof imageData);

// filter json data by category and subcategory
function filterDataByCategory(category, subcategory) {
  const filteredData = imageData[category].filter(
    (item) => item.subcategory === subcategory
  );
  return filteredData;
}

// function to create the image card
function renderImages(filteredData) {
  // Example: Rendering images
  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = ""; // Clear previous content

  filteredData.forEach((item) => {
    const imgElement = document.createElement("img");
    imgElement.src = item.file_location;
    imgElement.alt = item.name;
    imgElement.height = 100;
    imgElement.addEventListener("click", () => {
        console.log("Clicked image" + item.name)
    });
    imageContainer.appendChild(imgElement);
  });
}

let activeCategory = "Templates";
let activeSubCategory = "Frames";

let defaultImages = filterDataByCategory(activeCategory, activeSubCategory);    

renderImages(defaultImages);

console.log(filterDataByCategory(activeCategory, activeSubCategory));

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

          const filteredImagesByCategory = filterDataByCategory(
            activeCategory,
            activeSubCategory
          );

          renderImages(filteredImagesByCategory);
        });
      });
    }
  });
});
