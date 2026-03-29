document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const galleryButtons = document.querySelectorAll(".gallery-item");
  const galleryModalImage = document.getElementById("galleryModalImage");
  const galleryModalLabel = document.getElementById("galleryModalLabel");
  const currentYear = document.getElementById("currentYear");
  const navbarCollapse = document.getElementById("navbarContent");
  const mobileMenuMedia = window.matchMedia("(max-width: 991.98px)");

  const updateNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar);

  const openMobileMenu = () => {
    if (!navbarCollapse || !navbarToggler) {
      return;
    }

    navbarCollapse.classList.add("menu-visible");
    document.body.classList.add("menu-open");
    navbarToggler.setAttribute("aria-expanded", "true");
  };

  const closeMobileMenu = () => {
    if (!navbarCollapse || !navbarToggler) {
      return;
    }

    navbarCollapse.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
    navbarToggler.setAttribute("aria-expanded", "false");
  };

  navbarToggler?.addEventListener("click", (event) => {
    if (!mobileMenuMedia.matches) {
      return;
    }

    event.preventDefault();

    if (navbarCollapse.classList.contains("menu-visible")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!mobileMenuMedia.matches) {
      closeMobileMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetSelector = link.getAttribute("href");

      if (!targetSelector || !targetSelector.startsWith("#")) {
        return;
      }

      const target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      event.preventDefault();

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 78;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });

      if (mobileMenuMedia.matches && navbarCollapse?.classList.contains("menu-visible")) {
        closeMobileMenu();
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.dataset.image;
      const title = button.dataset.title || "Luxury yacht gallery image";

      galleryModalImage.src = image;
      galleryModalImage.alt = title;
      galleryModalLabel.textContent = title;
    });
  });

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
