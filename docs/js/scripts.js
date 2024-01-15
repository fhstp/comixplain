/*!
 * Start Bootstrap - New Age v6.0.6 (https://startbootstrap.com/theme/new-age)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
});

// sidebar toogle items
window.addEventListener("DOMContentLoaded", (event) => {
  // Get all elements with class 'sidebar-item'
  const navItems = document.querySelectorAll(".sidebar-item");

  let activeSubCategory = null;
  let activeCagtory = null;

  // Iterate over each 'sidebar-item'
  navItems.forEach((navItem) => {
    // Extract the numeric part from the 'id' attribute
    const navItemId = navItem.id.split("-")[1];

    // Find the corresponding 'sidebar-sub-items' based on the extracted ID
    const subNavItems = document.getElementById(
      `sidebar-sub-items-${navItemId}`
    );

    // get the sub-items as an array
    const subItemsArray = Array.from(subNavItems.children);

    // get the i element inside the navItem
    const navItemIcon = navItem.querySelector("i");

    // Add a click event listener to each 'sidebar-item'
    navItem.addEventListener("click", () => {
      // set the active category
      activeCagtory = navItem.innerText;
      console.log(activeCagtory);
      // Toggle the visibility of the corresponding sub-items
      if (subNavItems) {
        subNavItems.classList.toggle("collapse");
      }

      // change the icon
      if (navItemIcon) {
        navItemIcon.classList.toggle("bi-chevron-right");
        navItemIcon.classList.toggle("bi-chevron-down");
      }

      // add the "link-secondary" class to the clicked navItem
      navItem.classList.toggle("link-secondary");

      // other navItems
      navItems.forEach((item) => {
        if (item.id !== navItem.id) {
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
    if (subNavItems) {
      subItemsArray.forEach((subItem) => {
        subItem.addEventListener("click", () => {
          // set the active sub-category
          activeSubCategory = subItem.innerText;
          console.log(activeSubCategory);
          // remove the "link-secondary" class from all sub-items of all navItems
          navItems.forEach((item) => {
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
          subItem.classList.toggle("link-secondary");
        });
      });
    }
  });
});