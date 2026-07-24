let volume = 50;
let escapeCount = 0;
let successfulClicks = 0;
let canEscape = true;
let interactionComplete = false;

const playArea = document.getElementById("playArea");
const volumeBtn = document.getElementById("volumeBtn");
const volumeDisplay = document.getElementById("volumeDisplay");
const meterFill = document.getElementById("meterFill");
const statusMessage = document.getElementById("statusMessage");
const escapeCountDisplay = document.getElementById("escapeCount");
const submitBtn = document.getElementById("submitBtn");
const resultCard = document.getElementById("resultCard");
const finalResult = document.getElementById("finalResult");
const restartBtn = document.getElementById("restartBtn");

const statusMessages = [
  "Almost. The button noticed you.",
  "Too slow.",
  "It moved for absolutely no reason.",
  "This would be easier with a normal slider.",
  "The volume button has trust issues.",
  "You were emotionally close.",
  "Excellent effort. No result.",
  "The interface is working exactly as badly as intended."
];

function updateVolume() {
  volumeDisplay.textContent = `${volume}%`;
  meterFill.style.width = `${volume}%`;
}

function moveButton() {
  if (!canEscape || interactionComplete) {
    return;
  }

  const areaRect = playArea.getBoundingClientRect();
  const buttonRect = volumeBtn.getBoundingClientRect();

  const padding = 18;

  const maxLeft =
    areaRect.width -
    buttonRect.width -
    padding;

  const maxTop =
    areaRect.height -
    buttonRect.height -
    padding;

  const newLeft = Math.max(
    padding,
    Math.min(
      maxLeft,
      padding +
        Math.random() *
        (maxLeft - padding)
    )
  );

  const newTop = Math.max(
    padding,
    Math.min(
      maxTop,
      padding +
        Math.random() *
        (maxTop - padding)
    )
  );

  volumeBtn.style.transform = "none";
  volumeBtn.style.left = `${newLeft}px`;
  volumeBtn.style.top = `${newTop}px`;

  escapeCount += 1;
  escapeCountDisplay.textContent = escapeCount;

  statusMessage.textContent =
    statusMessages[
      Math.floor(
        Math.random() * statusMessages.length
      )
    ];

  canEscape = false;

  window.setTimeout(() => {
    canEscape = true;
  }, 420);
}

function cursorIsNearButton(event) {
  const rect =
    volumeBtn.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height / 2;

  const distance = Math.hypot(
    event.clientX - centerX,
    event.clientY - centerY
  );

  return distance < 92;
}

playArea.addEventListener(
  "pointermove",
  (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    /*
      The button escapes only some of the time.
      This keeps the interface frustrating,
      but still possible to complete.
    */

    if (
      cursorIsNearButton(event) &&
      Math.random() < 0.38
    ) {
      moveButton();
    }
  }
);

volumeBtn.addEventListener(
  "click",
  () => {
    if (interactionComplete) {
      return;
    }

    successfulClicks += 1;

    /*
      Every fourth successful catch subtracts
      five instead of adding it.
    */

    if (
      successfulClicks % 4 === 0 &&
      volume >= 5
    ) {
      volume -= 5;

      statusMessage.textContent =
        "Unexpected system correction: volume decreased by 5%.";
    } else {
      volume = Math.min(
        100,
        volume + 5
      );

      statusMessage.textContent =
        volume === 100
          ? "Maximum volume reached. Your neighbors have been notified."
          : "Success. Somehow.";
    }

    updateVolume();

    volumeBtn.classList.remove("caught");

    void volumeBtn.offsetWidth;

    volumeBtn.classList.add("caught");

    window.setTimeout(
      moveButton,
      170
    );
  }
);

volumeBtn.addEventListener(
  "pointerdown",
  () => {
    /*
      Once the user presses the button,
      temporarily stop it from escaping.
      This allows the click to register.
    */

    canEscape = false;

    window.setTimeout(() => {
      canEscape = true;
    }, 300);
  }
);

submitBtn.addEventListener(
  "click",
  () => {
    if (interactionComplete) {
      return;
    }

    /*
      The first submission is rejected.
      The second submission completes the task.
    */

    if (!submitBtn.dataset.rejected) {
      submitBtn.dataset.rejected = "true";

      submitBtn.textContent =
        "No, Really—Set It";

      statusMessage.textContent =
        "Submission rejected. The interface needed additional confidence.";

      submitBtn.classList.add("shake");

      window.setTimeout(() => {
        submitBtn.classList.remove("shake");
      }, 380);

      return;
    }

    interactionComplete = true;

    playArea.hidden = true;

    document.querySelector(
      ".controls"
    ).hidden = true;

    statusMessage.textContent =
      "Against all odds, the task is complete.";

    finalResult.textContent =
      `You set the volume to ${volume}% after ` +
      `${escapeCount} escape attempts and ` +
      `${successfulClicks} successful catches. ` +
      `Thank you for choosing an interface that ` +
      `actively works against you.`;

    resultCard.hidden = false;

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
);

restartBtn.addEventListener(
  "click",
  () => {
    window.location.reload();
  }
);

updateVolume();