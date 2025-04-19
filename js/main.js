const words = ["payloads", "exploits", "malware", "worms", "shells", "stagers", "scripts"];
const typed = document.getElementById("typed");
let currentWord = 0;
let letterIndex = 0;
let isDeleting = false;


function typeEffect() {
    const base = "Loading ";
    const word = words[currentWord];
    let currentText = word.substring(0, letterIndex);
  
    typed.textContent = `>_ ${base}${currentText}`;
  
    if (!isDeleting && letterIndex < word.length) {
      letterIndex++;
      setTimeout(typeEffect, 100);
    } else if (isDeleting && letterIndex > 0) {
      letterIndex--;
      setTimeout(typeEffect, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        currentWord = (currentWord + 1) % words.length;
      }
      setTimeout(typeEffect, 1000);
    }
  }

window.onload = () => {
  typeEffect();

  // Particles
  particlesJS("particles-js", {
    particles: {
      number: { value: 150 },
      color: { value: "#AEFF00" },
      shape: { type: "edge" },
      opacity: { value: 0.2 },
      size: { value: 1 },
      move: { speed: 0.8},
      line_linked: {
        enable: true,
        distance: 100,
        color: "#00FF9C",
        opacity: 0.5,
        width: 1.5
      },
      move: { enable: true, speed: 1.2 }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" }
      }
    }
  });
};

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
  
  // Ejemplo de uso: cargar un writeup desde URL o botón
  // loadMarkdown('writeups/htb-sneakymailer.md');


