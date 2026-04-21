let volume = 50;

const btn = document.getElementById("volumeBtn");
const display = document.getElementById("volumeDisplay");

// initial position
btn.style.left = "200px";
btn.style.top = "200px";

function updateVolume() {
  display.textContent = "Volume: " + volume + "%";
}

// move away when mouse gets close (but NOT impossible)
document.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();

  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 120) {
    let moveX = (Math.random() - 0.5) * 100;
    let moveY = (Math.random() - 0.5) * 100;

    let newLeft = rect.left + moveX;
    let newTop = rect.top + moveY;

    // keep inside screen (IMPORTANT fix)
    newLeft = Math.max(0, Math.min(window.innerWidth - 100, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - 50, newTop));

    btn.style.left = newLeft + "px";
    btn.style.top = newTop + "px";
  }
});

// click to change volume (small increments = frustration)
btn.addEventListener("click", () => {
  volume = Math.min(100, volume + 5);
  updateVolume();
});

updateVolume();