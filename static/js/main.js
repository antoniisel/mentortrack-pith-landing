const slides = [...document.querySelectorAll(".slide")];
const currentLabel = document.querySelector("[data-current]");
const totalLabel = document.querySelector("[data-total]");
const progress = document.querySelector("[data-progress]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");

let currentIndex = 0;
let touchStartY = 0;

const formatNumber = (number) => String(number).padStart(2, "0");

function updateControls(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentLabel.textContent = formatNumber(currentIndex + 1);
  totalLabel.textContent = formatNumber(slides.length);
  progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;
  document.title = `MentorTrack — ${slides[currentIndex].dataset.title}`;
}

function goTo(index) {
  const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });
  updateControls(targetIndex);
}

prevButton.addEventListener("click", () => goTo(currentIndex - 1));
nextButton.addEventListener("click", () => goTo(currentIndex + 1));

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex + 1);
  }

  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex - 1);
  }

  if (event.key === "Home") goTo(0);
  if (event.key === "End") goTo(slides.length - 1);
});

document.addEventListener("touchstart", (event) => {
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const distance = touchStartY - event.changedTouches[0].screenY;
  if (Math.abs(distance) < 60) return;
  goTo(currentIndex + (distance > 0 ? 1 : -1));
}, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) updateControls(slides.indexOf(visible.target));
  },
  { threshold: [0.5, 0.75] },
);

slides.forEach((slide) => observer.observe(slide));
updateControls(0);
