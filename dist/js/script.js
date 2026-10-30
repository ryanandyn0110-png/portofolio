const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
  menu.classList.toggle("menu-active");
});

window.addEventListener("scroll", () => {
  hamburger.classList.remove("is-active");
  menu.classList.remove("menu-active");
});

const loader = document.querySelector(".loader");

function loaderActive() {
  loader.classList.add("loader-active");
}

function loaderActiveTime() {
  setInterval(loaderActive, 3000);
}

window.onload = loaderActiveTime();


/* Horizontal experience carousel controls */
const experienceTrack = document.querySelector(".experience-track");
const experienceNext = document.querySelector(".experience-next");
const experiencePrev = document.querySelector(".experience-prev");
if (experienceTrack && experienceNext && experiencePrev) {
  const scrollExperience = (direction) => {
    const card = experienceTrack.querySelector(".experience-card");
    const distance = card ? card.getBoundingClientRect().width + 22 : 340;
    experienceTrack.scrollBy({ left: direction * distance, behavior: "smooth" });
  };
  experienceNext.addEventListener("click", () => scrollExperience(1));
  experiencePrev.addEventListener("click", () => scrollExperience(-1));
}

/* ===== EXPERIENCE CATEGORY INTERACTION ===== */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".experience-tab");
  const panels = document.querySelectorAll(".experience-panel");

  function activateExperience(category, moveFocus = false) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.category === category;

      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      if (isActive && moveFocus) {
        tab.focus();
      }
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `panel-${category}`;

      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);

      // Reset horizontal scroll when opening a category.
      if (isActive) {
        const track = panel.querySelector(".experience-track");

        if (track) {
          track.scrollTo({
            left: 0,
            behavior: "auto"
          });
        }
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateExperience(tab.dataset.category);
    });

    // Keyboard navigation between category tabs.
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();

      activateExperience(
        tabs[nextIndex].dataset.category,
        true
      );
    });
  });

  // Horizontal navigation for each category.
  panels.forEach((panel) => {
    const track = panel.querySelector(".experience-track");
    const prev = panel.querySelector(".experience-prev");
    const next = panel.querySelector(".experience-next");

    if (!track || !prev || !next) return;

    function getScrollAmount() {
      const card = track.querySelector(".experience-card");

      if (!card) return 300;

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap) || 20;

      return card.getBoundingClientRect().width + gap;
    }

    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth"
      });
    });
  });

  // Set the initial category.
  activateExperience("internship");
});

/* ===== INTERNSHIP GALLERY AUTOPLAY ===== */

document.querySelectorAll(".experience-gallery").forEach((gallery) => {
  const images = Array.from(
    gallery.querySelectorAll(".gallery-image")
  );

  const prevButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  const indicators = gallery.querySelector(".gallery-indicators");
  const dots = Array.from(
    gallery.querySelectorAll(".gallery-dot")
  );

  if (images.length === 0) return;

  let currentIndex = Math.max(
    0,
    images.findIndex((image) => image.classList.contains("active"))
  );

  let autoplayInterval;

  // Make sure the number of indicators matches the number of images.
  if (indicators) {
    indicators.innerHTML = "";

    images.forEach((_, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", `Show photo ${index + 1}`);

      dot.addEventListener("click", () => {
        showImage(index);
        restartAutoplay();
      });

      indicators.appendChild(dot);
    });
  }

  const galleryDots = Array.from(
    gallery.querySelectorAll(".gallery-dot")
  );

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    images.forEach((image, i) => {
      const isActive = i === currentIndex;

      image.classList.toggle("active", isActive);
      image.setAttribute("aria-hidden", String(!isActive));
    });

    galleryDots.forEach((dot, i) => {
      const isActive = i === currentIndex;

      dot.classList.toggle("active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    // Hide arrows and indicators when there is only one image.
    const hasMultipleImages = images.length > 1;

    if (prevButton) {
      prevButton.hidden = !hasMultipleImages;
    }

    if (nextButton) {
      nextButton.hidden = !hasMultipleImages;
    }

    if (indicators) {
      indicators.hidden = !hasMultipleImages;
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function startAutoplay() {
    stopAutoplay();

    if (
      images.length > 1 &&
      !gallery.matches(":hover") &&
      !gallery.contains(document.activeElement) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      autoplayInterval = setInterval(() => {
        showImage(currentIndex + 1);
      }, 4000);
    }
  }

  function restartAutoplay() {
    startAutoplay();
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showImage(currentIndex - 1);
      restartAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showImage(currentIndex + 1);
      restartAutoplay();
    });
  }

  // Pause while the visitor hovers over or focuses the gallery.
  gallery.addEventListener("mouseenter", stopAutoplay);

  gallery.addEventListener("mouseleave", startAutoplay);

  gallery.addEventListener("focusin", stopAutoplay);

  gallery.addEventListener("focusout", (event) => {
    if (!gallery.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  showImage(currentIndex);
  startAutoplay();
});
