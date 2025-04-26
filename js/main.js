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
    let currentText = word.substring(0, letterIndex);
    typed.textContent = `> ${base}${currentText}`;

    if (!isDeleting && letterIndex < word.length) {
      letterIndex++;
      setTimeout(typeLoop, 100);
    } else if (isDeleting && letterIndex > 0) {
      letterIndex--;
      setTimeout(typeLoop, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) currentWord = (currentWord + 1) % words.length;
      setTimeout(typeLoop, 1000);
    }
  }

  typeLoop();
}

// ========== PARTICLES ==========
function startParticles() {
  if (!document.getElementById("particles-js")) return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 100 },
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
        width: 3.5
      }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" }
      }
    }
  });
}

// ========== MARKDOWN LOADER ==========
function loadMarkdown(file) {
  fetch(file)
    .then(res => res.text())
    .then(md => {
      const html = marked.parse(md);
      document.getElementById("markdown-container").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("markdown-container").innerHTML = "<p>Error loading writeup.</p>";
      console.error(err);
    });
}

// ========== INIT ==========
window.onload = () => {
  startTypeEffect();
  startParticles();
};

// Cargar el footer desde un archivo externo
window.addEventListener('DOMContentLoaded', () => {
  fetch('/footer.html')
    .then(res => res.text())
    .then(html => {
      const footerContainer = document.createElement('div');
      footerContainer.innerHTML = html;
      document.body.appendChild(footerContainer);
      
      // Insertar el año actual automáticamente
      const yearSpan = document.getElementById('year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    })
    .catch(err => console.error('Error loading footer:', err));
});


