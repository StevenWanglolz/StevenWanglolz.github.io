// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add active class to current navigation item
const navLinks = document.querySelectorAll(".nav-link");
const currentLocation = window.location.pathname;

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentLocation.split("/").pop()) {
    link.classList.add("active");
  }
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll(".progress-bar");
const animateSkills = () => {
  skillBars.forEach((bar) => {
    const value = bar.getAttribute("aria-valuenow");
    bar.style.width = value + "%";
  });
};

// Intersection Observer for skill bars
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateSkills();
    }
  });
});

skillBars.forEach((bar) => observer.observe(bar));
