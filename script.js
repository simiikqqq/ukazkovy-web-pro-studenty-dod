const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  if (prefersReducedMotion) {
    element.textContent = target;
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

const bookingForm = document.querySelector(".booking-form");
const formStatus = document.querySelector(".form-status");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = bookingForm.elements.name;
  const date = bookingForm.elements.date;
  const time = bookingForm.elements.time;

  if (!name.value.trim()) {
    formStatus.textContent = "Napište prosím své jméno.";
    name.focus();
    return;
  }

  if (!date.value || !time.value) {
    formStatus.textContent = "Vyberte prosím datum i čas návštěvy.";
    (!date.value ? date : time).focus();
    return;
  }

  formStatus.textContent = `Děkujeme, ${name.value.trim()}. Přípitek a stůl jsme pro vás předběžně rezervovali na ${date.value} v ${time.value}.`;
  bookingForm.reset();
  bookingForm.elements.time.value = "10:30";
});

document.getElementById("year").textContent = new Date().getFullYear();
