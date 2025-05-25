// ========== TYPEWRITER EFFECT ==========
const words = ["payloads", "exploits", "malware", "worms", "shells", "stagers", "scripts"];

function startTypeEffect() {
  const typed = document.getElementById("typed");
  if (!typed) return;

  let currentWord = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const base = "Loading ";
    const word = words[currentWord];
    const currentText = word.substring(0, letterIndex);
    typed.textContent = `> ${base}${currentText}`;

    if (isDeleting) {
      if (letterIndex > 0) {
        letterIndex--;
        setTimeout(typeLoop, 50);
      } else {
        isDeleting = false;
        currentWord = (currentWord + 1) % words.length;
        setTimeout(typeLoop, 500);
      }
    } else {
      if (letterIndex < word.length) {
        letterIndex++;
        setTimeout(typeLoop, 100);
      } else {
        isDeleting = true;
        setTimeout(typeLoop, 1000);
      }
    }
  }

  typeLoop();
}

// ========== PARTICLES ==========
function startParticles() {
  const particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 150 },
      color: { value: "#AEFF00" },
      shape: { type: "edge" },
      opacity: { value: 0.2 },
      size: { value: 1 },
      move: { enable: true, speed: 1.5 },
      line_linked: {
        enable: true,
        distance: 110,
        color: "#00FF9C",
        opacity: 0.5,
        width: 3.5,
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
      },
    },
  });
}

// ========== MARKDOWN LOADER ==========
function loadMarkdown(file) {
  const markdownContainer = document.getElementById("markdown-container");
  if (!markdownContainer) return;

  fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.text();
    })
    .then((md) => {
      const html = marked.parse(md);
      markdownContainer.innerHTML = html;
    })
    .catch((err) => {
      markdownContainer.innerHTML = "<p>Error loading writeup.</p>";
      console.error("Markdown loading error:", err);
    });
}

// ========== FOOTER LOADER ==========
function loadFooter() {
  fetch("/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const footerContainer = document.createElement("div");
      footerContainer.innerHTML = html;
      document.body.appendChild(footerContainer);

      // Insert the current year automatically
      const yearSpan = document.getElementById("year");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    })
    .catch((err) => console.error("Error loading footer:", err));
}

// ========== INIT ==========
window.addEventListener("DOMContentLoaded", () => {
  startTypeEffect();
  startParticles();
  loadFooter();
});
