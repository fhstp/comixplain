window.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".guide-sidebar .nav-link");
  const sections = document.querySelectorAll(".guide-section");
  const sidebarPanel = document.getElementById("guideSidebarPanel");
  const sidebarToggle = document.getElementById("guideSidebarToggle");
  const sidebarClose = document.getElementById("guideSidebarClose");
  const sidebarOverlay = document.getElementById("guideSidebarOverlay");
  const mobileBreakpoint = window.matchMedia("(max-width: 991.98px)");

  const isMobileSidebar = () => mobileBreakpoint.matches;

  const openSidebar = () => {
    if (!sidebarPanel || !sidebarOverlay || !sidebarToggle) {
      return;
    }

    sidebarPanel.classList.add("is-open");
    sidebarOverlay.hidden = false;
    sidebarOverlay.classList.add("is-visible");
    sidebarToggle.classList.add("is-hidden");
    sidebarToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("guide-sidebar-open");
  };

  const closeSidebar = () => {
    if (!sidebarPanel || !sidebarOverlay || !sidebarToggle) {
      return;
    }

    sidebarPanel.classList.remove("is-open");
    sidebarOverlay.classList.remove("is-visible");
    sidebarToggle.classList.remove("is-hidden");
    sidebarToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("guide-sidebar-open");

    window.setTimeout(() => {
      if (!sidebarPanel.classList.contains("is-open")) {
        sidebarOverlay.hidden = true;
      }
    }, 300);
  };

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", openSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebarPanel?.classList.contains("is-open")) {
      closeSidebar();
    }
  });

  mobileBreakpoint.addEventListener("change", () => {
    if (!isMobileSidebar()) {
      closeSidebar();
    }
  });

  if (!sidebarLinks.length || !sections.length) {
    return;
  }

  const setActiveLink = (id) => {
    sidebarLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }

      if (isMobileSidebar()) {
        closeSidebar();
      }
    });
  });
});
