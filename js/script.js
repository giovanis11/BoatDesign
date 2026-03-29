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
  const contactForm = document.querySelector(".contact-form");
  const contactSubmitButton = document.getElementById("contactSubmitButton");
  const contactFormStatus = document.getElementById("contactFormStatus");
  const preferredDateInput = document.getElementById("date");

  const formatPreferredDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const [year, month, day] = dateValue.split("-");

    if (!year || !month || !day) {
      return dateValue;
    }

    return `${day}/${month}/${year}`;
  };

  const setupContactForm = () => {
    if (!contactForm || !contactSubmitButton || !contactFormStatus) {
      return;
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const originalButtonLabel = "Send Inquiry";
      const formData = new FormData(contactForm);
      const formattedPreferredDate = formatPreferredDate(preferredDateInput?.value || "");

      if (formattedPreferredDate) {
        formData.set("preferred-date", formattedPreferredDate);
      }

      contactSubmitButton.disabled = true;
      contactSubmitButton.classList.remove("is-success");
      contactSubmitButton.classList.add("is-submitting");
      contactSubmitButton.textContent = "Sending...";
      contactFormStatus.className = "form-status";
      contactFormStatus.textContent = "";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        contactForm.reset();
        contactSubmitButton.classList.remove("is-submitting");
        contactSubmitButton.classList.add("is-success");
        contactSubmitButton.textContent = "Inquiry Sent";
        contactFormStatus.className = "form-status is-success";
        contactFormStatus.textContent = "Your message was sent successfully.";
      } catch (error) {
        contactSubmitButton.disabled = false;
        contactSubmitButton.classList.remove("is-submitting");
        contactSubmitButton.textContent = originalButtonLabel;
        contactFormStatus.className = "form-status is-error";
        contactFormStatus.textContent = "Something went wrong. Please try again.";
      }
    });
  };

  setupContactForm();

  const updateNavbar = () => {
    if (!navbar) {
      return;
    }

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
      if (!galleryModalImage || !galleryModalLabel) {
        return;
      }

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
