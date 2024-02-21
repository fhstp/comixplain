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
const selectedImageContainer = document.getElementById(
  "selectedAssetsContainer"
);
const filterContainer = document.getElementById("filter-container");
const searchBarInput = document.getElementById("searchBarInput");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");
const selectedAssetsHeadline = document.getElementById(
  "selectedAssetsHeadline"
);

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
  console.log(filteredData);
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
          selectedAssetsHeadline.innerText = `Selected Assets`;
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
    // remove asset count
    selectedAssetsHeadline.innerText = "Selected Assets";
  }
}

// get filter-options from JSON
function createFilter(category, subcategory) {
  const filterOptions = imageData[category][subcategory]["filter-options"];

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

  // check if no image is selected
  if (selectedAsset.length === 0) {
    // hide table
    metaDataTable.style.display = "none";

    const placeHolderText = document.createElement("p");
    placeHolderText.classList.add("text-center", "text-muted", "mt-5");
    placeHolderText.innerText = "Select an Asset to see details.";

    metaDataContainer.appendChild(placeHolderText);
  } else {
    // get selectedAsset headline and add selectedAsset.length
    selectedAssetsHeadline.innerText = `Selected Assets (${selectedAsset.length})`;
    // display meta data for the last selected asset
    metaDataTable.style.display = "none";

    const fragment = document.createDocumentFragment();
    let asset = selectedAsset[0];

    // image
    // create link element for image
    const linkElement = document.createElement("a");
    linkElement.href = asset.download_location || asset.file_location;
    linkElement.target = "_blank";

    const imgElement = document.createElement("img");
    imgElement.src = asset.file_location;
    imgElement.alt = asset.name;

    imgElement.classList.add(
      "metaData-Image",
      "p-2",
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
      asset.download_location || asset.file_location
    }`;
    fileLocation.href = asset.download_location || asset.file_location;

    // attach elements
    linkElement.appendChild(imgElement);
    fragment.appendChild(linkElement);
    fragment.appendChild(name);
    metaDataContainer.appendChild(fragment);
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

  // hide filter container
  filterContainer.style.display = "none";

  return filteredImagesBySearch;
}

searchBarInput.addEventListener("search", (e) => {
  filteredImagesByCategory = filterAssetsByCategory(
    activeCategory,
    activeSubCategory
  );

  if (searchBarInput.value !== "") {
    const searchTerm = e.target.value;
    searchBar(imageData, searchTerm);
    renderImages(filteredImagesBySearch);
  } else {
    renderImages(filteredImagesByCategory);
    // show filter container
    filterContainer.style.display = "flex";
    filterAssetsByActiveFilter(filteredImagesByCategory, activeFilter);
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
  // remove asset count
  selectedAssetsHeadline.innerText = "Selected Assets";
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
      const assetUrl = asset.download_location || asset.file_location;
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
        const assetUrl = asset.download_location || asset.file_location;
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

    // get the icon
    const itemIcon = sideBarItem.querySelector("i");

    // Add a click event listener to each 'sidebar-item'
    sideBarItem.addEventListener("click", () => {
      // Toggle the visibility of the corresponding sub-items
      if (subCategories) {
        subCategories.classList.toggle("collapse");
        // Toggle the chevron icon
        if (itemIcon) {
          itemIcon.classList.toggle("bi-chevron-right");
          itemIcon.classList.toggle("bi-chevron-down");
        }
      }
    });

    // add a click event listener to each sub-item
    if (subCategories) {
      const subCategoriesArray = Array.from(subCategories.children);
      subCategoriesArray.forEach((subCategory) => {
        subCategory.addEventListener("click", () => {
          // set the active sub-category
          activeSubCategory = subCategory.innerText;
          // set the active category
          activeCategory = sideBarItem.innerText;

          // Remove 'link-secondary' class from all sub-items
          sideBarItems.forEach((item) => {
            const subItems = document.getElementById(
              `sidebar-sub-items-${item.id.split("-")[1]}`
            );
            if (subItems) {
              Array.from(subItems.children).forEach((subItem) => {
                subItem.classList.remove("link-secondary");
              });
            }
          });

          // Add 'link-secondary' class to clicked sub-item
          subCategory.classList.add("link-secondary");

          // Remove 'link-secondary' class from all sidebar items
          sideBarItems.forEach((item) => {
            item.classList.remove("link-secondary");
          });

          // Add 'link-secondary' class to corresponding sidebar item
          sideBarItem.classList.add("link-secondary");

          // render the images and create the filter
          filteredImagesByCategory = filterAssetsByCategory(
            activeCategory,
            activeSubCategory
          );
          renderImages(filteredImagesByCategory);
          createFilter(activeCategory, activeSubCategory);

          // clear the active filter array
          activeFilter = [];

          // clear the search bar
          searchBarInput.value = "";
          // show filter container
          filterContainer.style.display = "flex";
        });
      });
    }
  });
});
