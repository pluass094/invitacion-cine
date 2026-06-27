const movieInput = document.querySelector("#movieInput");
const dateInput = document.querySelector("#dateInput");
const timeInput = document.querySelector("#timeInput");
const ticketMovie = document.querySelector("#ticketMovie");
const ticketDate = document.querySelector("#ticketDate");
const ticketSeats = document.querySelector("#ticketSeats");
const seatsContainer = document.querySelector("#seats");
const yesBtn = document.querySelector("#yesBtn");
const surpriseBtn = document.querySelector("#surpriseBtn");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const countdown = document.querySelector("#countdown");
const musicBtn = document.querySelector("#musicBtn");
const musicStatus = document.querySelector("#musicStatus");
const loveSong = document.querySelector("#loveSong");
const canvas = document.querySelector("#sparkles");
const ctx = canvas.getContext("2d");

const seatNames = ["D1", "D2", "D3", "D4", "D5", "D6", "E1", "E2", "E3", "E4", "E5", "E6"];
let selectedSeats = ["D1", "D2"];
let stars = [];
let isMusicPlaying = false;

function updateTicket() {
  const movie = movieInput.value.trim() || "Spider-Man: Brand New Day";
  const date = dateInput.value.trim() || "jueves 30 de julio";
  const time = timeInput.value.trim() || "17:20 PM";

  ticketMovie.textContent = movie;
  ticketDate.textContent = `${date} - ${time}`;
  ticketSeats.textContent = `Asientos: ${selectedSeats.join(" + ")}`;
}

function renderSeats() {
  seatsContainer.innerHTML = "";

  seatNames.forEach((seat) => {
    const button = document.createElement("button");
    button.className = "seat";
    button.type = "button";
    button.textContent = seat;
    button.setAttribute("aria-label", `Asiento ${seat}`);

    if (selectedSeats.includes(seat)) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      if (selectedSeats.includes(seat)) {
        selectedSeats = selectedSeats.filter((item) => item !== seat);
      } else {
        selectedSeats = [...selectedSeats, seat].slice(-2);
      }

      if (selectedSeats.length === 0) {
        selectedSeats = [seat];
      }

      renderSeats();
      updateTicket();
    });

    seatsContainer.appendChild(button);
  });
}

function openModal(mode) {
  const movie = movieInput.value.trim() || "Spider-Man: Brand New Day";

  if (mode === "yes") {
    modalTitle.textContent = "Boleto confirmado: cita aceptada.";
    modalText.textContent = `Queda oficialmente reservada una noche para ver ${movie}, comer palomitas y convertir una salida sencilla en un recuerdo bonito.`;
    countdown.textContent = "Nos vemos en la sala, mi amor.";
    launchConfetti();
  } else {
    modalTitle.textContent = "Trailer secreto";
    modalText.textContent = "Escena 1: llegamos al cine. Escena 2: compro tus snacks favoritos. Escena 3: termino sonriendo porque estoy contigo.";
    startCountdown();
  }

  modal.showModal();
}

function toggleMusic() {
  isMusicPlaying = !isMusicPlaying;
  musicBtn.classList.toggle("playing", isMusicPlaying);
  musicBtn.textContent = isMusicPlaying ? "Pausa" : "Play";
  musicBtn.setAttribute("aria-label", isMusicPlaying ? "Pausar musica" : "Reproducir musica");
  musicStatus.textContent = isMusicPlaying
    ? "Sonando Gone, Gone, Gone para nuestra funcion."
    : "Presiona play para disfrutarla.";

  if (isMusicPlaying) {
    loveSong.play().catch(() => {
      isMusicPlaying = false;
      musicBtn.classList.remove("playing");
      musicBtn.textContent = "Play";
      musicStatus.textContent = "No se pudo reproducir. Abre el HTML con Live Server e intenta otra vez.";
    });
  } else {
    loveSong.pause();
  }
}

function startCountdown() {
  const lines = ["Luces...", "Camara...", "Tu sonrisa...", "Accion: dime que si"];
  let index = 0;
  countdown.textContent = lines[index];

  const timer = setInterval(() => {
    index += 1;
    countdown.textContent = lines[index] || lines[lines.length - 1];

    if (index >= lines.length - 1) {
      clearInterval(timer);
    }
  }, 850);
}

function launchConfetti() {
  const colors = ["#f6c85f", "#d93f4b", "#8fd8c7", "#4c7bd9", "#fff6df"];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 3800);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.min(120, Math.floor(window.innerWidth / 8)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.35 + 0.08,
    alpha: Math.random() * 0.7 + 0.2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 246, 223, ${star.alpha})`;
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height + 4) {
      star.y = -4;
      star.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(drawStars);
}

[movieInput, dateInput, timeInput].forEach((input) => {
  input.addEventListener("input", updateTicket);
});

yesBtn.addEventListener("click", () => openModal("yes"));
surpriseBtn.addEventListener("click", () => openModal("surprise"));
musicBtn.addEventListener("click", toggleMusic);
loveSong.addEventListener("ended", () => {
  isMusicPlaying = false;
  musicBtn.classList.remove("playing");
  musicBtn.textContent = "Play";
  musicBtn.setAttribute("aria-label", "Reproducir musica");
  musicStatus.textContent = "Presiona play para disfrutarla otra vez.";
});
closeModal.addEventListener("click", () => modal.close());
window.addEventListener("resize", resizeCanvas);

renderSeats();
updateTicket();
resizeCanvas();
drawStars();
