document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  const revealElements = document.querySelectorAll("[data-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    document.body.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    revealElements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay);
      if (Number.isFinite(delay) && delay > 0) element.style.setProperty("--reveal-delay", `${delay}ms`);
      revealObserver.observe(element);
    });
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const showing = input.type === "password";
      input.type = showing ? "text" : "password";
      button.textContent = showing ? "Hide" : "Show";
      button.setAttribute("aria-label", `${showing ? "Hide" : "Show"} password`);
      button.setAttribute("aria-pressed", String(showing));
      input.focus();
    });
  });

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (finePointer.matches && !reducedMotion) {
    const aura = document.querySelector(".pointer-aura");
    const art = document.querySelector(".orbit-art");
    const buttons = document.querySelectorAll(".primary-button");
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let framePending = false;

    const updatePointerEffects = () => {
      framePending = false;
      document.body.classList.add("has-pointer");
      document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
      if (aura) aura.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;

      if (art) {
        const bounds = art.getBoundingClientRect();
        const offsetX = (pointerX - (bounds.left + bounds.width / 2)) / bounds.width;
        const offsetY = (pointerY - (bounds.top + bounds.height / 2)) / bounds.height;
        art.style.setProperty("--art-tilt-x", `${Math.max(-1, Math.min(1, offsetX)) * 5}deg`);
        art.style.setProperty("--art-tilt-y", `${Math.max(-1, Math.min(1, -offsetY)) * 5}deg`);
        art.style.setProperty("--art-x", `${Math.max(-1, Math.min(1, offsetX)) * 8}px`);
        art.style.setProperty("--art-y", `${Math.max(-1, Math.min(1, offsetY)) * 8}px`);
      }

      buttons.forEach((button) => {
        const bounds = button.getBoundingClientRect();
        const offsetX = (pointerX - (bounds.left + bounds.width / 2)) / bounds.width;
        const offsetY = (pointerY - (bounds.top + bounds.height / 2)) / bounds.height;
        if (Math.abs(offsetX) <= 1.2 && Math.abs(offsetY) <= 1.8) {
          button.style.setProperty("--magnet-x", `${offsetX * 5}px`);
          button.style.setProperty("--magnet-y", `${offsetY * 4}px`);
        } else {
          button.style.removeProperty("--magnet-x");
          button.style.removeProperty("--magnet-y");
        }
      });
    };

    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(updatePointerEffects);
      }
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      document.body.classList.remove("has-pointer");
      buttons.forEach((button) => {
        button.style.removeProperty("--magnet-x");
        button.style.removeProperty("--magnet-y");
      });
      if (art) {
        art.style.removeProperty("--art-tilt-x");
        art.style.removeProperty("--art-tilt-y");
        art.style.removeProperty("--art-x");
        art.style.removeProperty("--art-y");
      }
    });

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const bounds = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        const x = event.clientX ? event.clientX - bounds.left : bounds.width / 2;
        const y = event.clientY ? event.clientY - bounds.top : bounds.height / 2;
        ripple.className = "button-ripple";
        ripple.setAttribute("aria-hidden", "true");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        button.append(ripple);
      });
    });
  }

  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      const button = form.querySelector("[type='submit']");
      const label = button.dataset.submitLabel;
      if (label) {
        button.disabled = true;
        button.querySelector("span").textContent = label;
        button.setAttribute("aria-busy", "true");
      }
    });
  });
});
