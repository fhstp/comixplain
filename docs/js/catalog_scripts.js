// imports
import imageData from "../assets.json" assert { type: "json" };

// ---------------------------------------------
// global variables
// ---------------------------------------------
let selectedAsset = [];
let filteredImagesByCategory = [];
let filteredImagesBySearch = [];
let activeFilter = [];
let activeCategory = "Templates";
let activeSubCategory = "Frames";
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");
const selectedImageContainer = document.getElementById(
  "selectedAssetsContainer"
);
const searchBarInput = document.getElementById("searchBarInput");

// ---------------------------------------------
//  functions
// ---------------------------------------------
// filter json data by category and subcategory
function filterAssetsByCategory(category, subcategory) {
  return imageData[category][subcategory]["assets"];
}

// filter json data by filter options
function filterAssetsByActiveFilter(imageData, activeFilter) {
  // COMMENT: THIS IS AN ALTERNATIVE WAY OF FILTERING THE DATA
  // let filteredData = [];
  // activeFilter.forEach((filter) => {
  //   imageData.forEach((item) => {
  //     if (item.keywords.includes(filter) && !filteredData.includes(item)) {
  //       filteredData.push(item);
  //     }
  //   });
  // });

  let filteredData = imageData.filter((item) => {
    return activeFilter.every((keyword) => item.keywords.includes(keyword));
  });
  renderImages(filteredData);
}

function getAllKeywords(imageData) {
  let keywords = [];
  for (const category in imageData) {
    const subCategories = imageData[category];

    for (const subCategory in subCategories) {
      const assets = subCategories[subCategory]["assets"];

      for (const asset of assets) {
        const assetKeywords = asset.keywords;
        assetKeywords.forEach((keyword) => {
          // only push the keyword if it is not already in the array
          if (!keywords.includes(keyword)) {
            keywords.push(keyword);
          }
        });
      }
    }
  }
  // sort the keywords
  keywords.sort();
  return keywords;
}

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
      "bg-white",
      "rounded",
      "m-2",
      "shadow"
    );

    // set isSelected to false initially
    item.isSelected = false;

    // click functionality
    imgElement.addEventListener("click", () => {
      if (!item.isSelected) {
        // add styling and add to beginning selectedAsset array
        item.isSelected = true;

        imgElement.classList.toggle("catalog-image-selected");
        selectedAsset.unshift(item);
        renderSelectedImages(selectedAsset);
      } else {
        // remove styling and remove from selectedAsset array
        item.isSelected = false;

        imgElement.classList.toggle("catalog-image-selected");
        selectedAsset.splice(selectedAsset.indexOf(item), 1);
        renderSelectedImages(selectedAsset);

        // remove from selectedImageContainer
        selectedImageContainer.childNodes.forEach((child) => {
          if (child.alt === item.name) {
            selectedImageContainer.removeChild(child);
          }
        });
      }

      displayMetaData(selectedAsset);
    });

    // Append the image to the document fragment
    fragment.appendChild(imgElement);
  });

  // handle case when filteredData is empty
  if (filteredData.length === 0) {
    const noImagesElement = document.createElement("p");
    noImagesElement.innerText =
      "No images found for the currently selected filters or search term.";
    noImagesElement.classList.add("text-center", "text-muted", "mt-5");
    fragment.appendChild(noImagesElement);
  }

  imageContainer.appendChild(fragment);

  // mark selected images as selected
  selectedAsset.forEach((item) => {
    imageContainer.childNodes.forEach((child) => {
      if (child.alt === item.name) {
        child.classList.toggle("catalog-image-selected");
        item.isSelected = true;
      }
    });
  });
}

// Render selected images
function renderSelectedImages(selectedAsset) {
  // selectedImageContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const noAssetsText = document.getElementById("noAssetsText");

  // hide the placeholder text
  noAssetsText.style.display = "none";

  selectedAsset.forEach((item) => {
    item.alreadyInContainer = false;

    selectedImageContainer.childNodes.forEach((child) => {
      if (child.alt === item.name) {
        item.alreadyInContainer = true;
      }
    });
    // check if the image is already in the selectedImageContainer
    if (!item.alreadyInContainer) {
      const imgElement = document.createElement("img");
      imgElement.src = item.file_location;
      imgElement.alt = item.name;

      // add classes to the image element
      imgElement.classList.add(
        "selected-image",
        "p-2",
        "bg-white",
        "rounded",
        "m-2",
        "shadow",
        "border",
        "border-secondary"
      );

      // Append the image to the document fragment
      fragment.appendChild(imgElement);

      // click functionality for removing the image
      imgElement.addEventListener("click", () => {
        // remove from selectedAsset array
        selectedAsset.splice(selectedAsset.indexOf(item), 1);
        item.isSelected = false;
        // remove from selectedImageContainer
        selectedImageContainer.removeChild(imgElement);
        // go over all images and remove the border
        const images = document.querySelectorAll(".catalog-image");
        images.forEach((image) => {
          if (image.alt === item.name) {
            image.classList.remove("border");
            image.classList.remove("catalog-image-selected");
          }
        });
        displayMetaData(selectedAsset);

        if (selectedAsset.length === 0) {
          noAssetsText.style.display = "block";
        }
      });
    }
  });

  selectedImageContainer.prepend(fragment);

  if (selectedAsset.length === 0) {
    // remove all images from the container
    selectedImageContainer.innerHTML = "";
    // show the placeholder text
    noAssetsText.style.display = "block";
  }
}

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
    });
  });

  // Append the entire document fragment to the container
  filterContainer.appendChild(fragment);
}

// display metadata
function displayMetaData(selectedAsset) {
  const metaDataContainer = document.getElementById("metaData-Image");
  metaDataContainer.innerHTML = "";
  const metaDataTable = document.getElementById("details-Table");

  // check if only one image is selected
  if (selectedAsset.length === 1) {
    // hide table
    metaDataTable.style.display = "none";

    const fragment = document.createDocumentFragment();
    let asset = selectedAsset[0];

    // image
    const imgElement = document.createElement("img");
    imgElement.src = asset.file_location;
    imgElement.alt = asset.name;

    imgElement.classList.add(
      "catalog-image",
      "p-2",
      "pt-4",
      "bg-white",
      "rounded",
      "m-2",
      "shadow"
    );

    // name
    const name = document.createElement("h6");
    name.innerText = `${asset.name}`;

    // metadata table
    metaDataTable.style.display = "block";

    const keywords = document.getElementById("td-Keywords");
    keywords.innerText = asset.keywords.join(", ");

    const createdBy = document.getElementById("td-Created");
    createdBy.innerText = `${asset.created_by}`;

    const fileLocation = document.getElementById("td-Location");
    fileLocation.innerText = `${
      asset.font_file_location || asset.file_location
    }`;
    fileLocation.href = asset.font_file_location || asset.file_location;

    // attach elements
    fragment.appendChild(imgElement);
    fragment.appendChild(name);
    metaDataContainer.appendChild(fragment);
  } else if (selectedAsset.length === 0) {
    // hide table
    metaDataTable.style.display = "none";

    const placeHolderText = document.createElement("p");
    placeHolderText.classList.add("text-center", "text-muted", "mt-5");
    placeHolderText.innerText = "Select an Asset to see details.";

    metaDataContainer.appendChild(placeHolderText);
  } else {
    // hide table
    metaDataTable.style.display = "none";
    // show how many assets are selected
    const assetCount = document.createElement("p");
    assetCount.classList.add("text-center", "text-muted", "mt-5");
    assetCount.innerText = `${selectedAsset.length} Assets selected`;

    metaDataContainer.appendChild(assetCount);
  }
}

// search functionality
function searchBar(imageData, searchTerm) {
  filteredImagesBySearch = [];

  for (const category in imageData) {
    const subCategories = imageData[category];

    for (const subCategory in subCategories) {
      const assets = subCategories[subCategory]["assets"];

      for (const asset of assets) {
        const keywords = asset.keywords;

        for (const keyword of keywords) {
          if (keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
            // check if the asset is already in the array
            if (!filteredImagesBySearch.includes(asset)) {
              filteredImagesBySearch.push(asset);
            }
          }
        }
      }
    }
  }

  return filteredImagesBySearch;
}

searchBarInput.addEventListener("search", (e) => {
  if (searchBarInput.value !== "") {
    const searchTerm = e.target.value;
    searchBar(imageData, searchTerm);
    renderImages(filteredImagesBySearch);
  } else {
    let filteredData = filterAssetsByCategory(
      activeCategory,
      activeSubCategory
    );
    renderImages(filteredData);
  }
});

// auto complete functionality using jquery ui
$(function () {
  const availableTags = getAllKeywords(imageData);
  $("#searchBarInput").autocomplete({
    source: availableTags,
    select: function (event, ui) {
      const selectedKeyWord = ui.item.value;
      searchBar(imageData, selectedKeyWord);
      renderImages(filteredImagesBySearch);
    },
  });
});

// button function - clear selection
function clearSelection() {
  console.log("button clicked");
  selectedAsset.forEach((item) => {
    item.isSelected = false;
  });

  selectedAsset = [];
  displayMetaData(selectedAsset);
  // also remove all borders
  const images = document.querySelectorAll(".catalog-image");
  images.forEach((image) => {
    image.classList.remove("border");
    image.classList.remove("catalog-image-selected");

    // set isSelected to false
  });

  // remove all images from the container
  selectedImageContainer.innerHTML = "";
  // show the placeholder text
  noAssetsText.style.display = "block";
}

// button function - download
async function downloadSelection(selectedAssets) {
  try {
    if (selectedAssets.length === 0) {
      // show alert
      alert("No assets to download selected.");
    } else if (selectedAssets.length === 1) {
      // download the asset directly
      const asset = selectedAssets[0];
      const assetUrl = asset.font_file_location || asset.file_location;
      const rawUrl = assetUrl
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error("Asset not found.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = asset.name;

      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(clickEvent);

      // Revoke the URL to free up resources
      window.URL.revokeObjectURL(url);
    } else {
      // download a zip file with all assets using JSZip
      const zip = new JSZip();

      for (const asset of selectedAssets) {
        const assetUrl = asset.font_file_location || asset.file_location;
        const rawUrl = assetUrl
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
        const response = await fetch(rawUrl);

        if (!response.ok) {
          throw new Error("Asset not found.");
        }

        const blob = await response.blob();
        zip.file(asset.name, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = window.URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.target = "_blank";
      link.download = "comixplain_assets.zip";

      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(clickEvent);

      // Revoke the URL to free up resources
      window.URL.revokeObjectURL(zipUrl);
    }
  } catch (error) {
    console.error("Error fetching or downloading assets:", error);
  }
}

// ---------------------------------------------
//  load the page
// ---------------------------------------------
// Render the fist images on page load
renderImages(filterAssetsByCategory(activeCategory, activeSubCategory));
// create the filter on page load
createFilter(activeCategory, activeSubCategory);
// display metadata
displayMetaData(selectedAsset);
// add event listener to the clear button
clearButton.addEventListener("click", clearSelection);
// add event listener to the download button
downloadButton.addEventListener("click", function () {
  downloadSelection(selectedAsset);
});

// ---------------------------------------------
// sidebar functionality
// ---------------------------------------------
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
      sideBarItem.classList.add("link-secondary");

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
