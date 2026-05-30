const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sliders = new Map();

function setSlider(slider, index) {
  const total = slider.children.length;
  const current = (index + total) % total;
  sliders.set(slider.id, current);
  slider.style.transform = `translateX(-${current * 100}%)`;

  if (slider.id === "main-hero-slider") {
    document.querySelectorAll("#hero-dots button").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  }
}

function moveSlider(sliderId, direction) {
  const slider = document.getElementById(sliderId);
  setSlider(slider, (sliders.get(sliderId) || 0) + direction);
}

const heroSlider = document.getElementById("main-hero-slider");
const heroDots = document.getElementById("hero-dots");

[...heroSlider.children].forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir para imagem ${index + 1}`);
  dot.addEventListener("click", () => setSlider(heroSlider, index));
  heroDots.appendChild(dot);
});

setSlider(heroSlider, 0);

document.querySelectorAll(".slider-btn").forEach((button) => {
  button.addEventListener("click", () => moveSlider(button.dataset.slider, Number(button.dataset.direction)));
});

setInterval(() => moveSlider("main-hero-slider", 1), 5000);

document.querySelectorAll(".auto-slider").forEach((slider) => {
  setSlider(slider, 0);
  setInterval(() => moveSlider(slider.id, 1), 3600);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveNav() {
  const offset = window.innerHeight * 0.36;
  const orderedSections = [...navSections].sort((a, b) => a.offsetTop - b.offsetTop);
  const current = orderedSections.reduce((active, section) => {
    return section.getBoundingClientRect().top <= offset ? section : active;
  }, orderedSections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
