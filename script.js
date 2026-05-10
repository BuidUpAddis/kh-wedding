const stage = document.getElementById("stage");
const field = document.getElementById("petal-field");
const coverButton = document.getElementById("cover-button");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".flower-petal").forEach((petal, index) => {
  petal.style.setProperty("--turn", `${index * 60}deg`);
});

const makePetals = () => {
  const petalCount = window.innerWidth < 700 ? 24 : 38;

  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement("span");
    const size = 7 + Math.random() * 13;
    const start = -34 + Math.random() * 68;
    const end = start + (-28 + Math.random() * 56);
    const duration = 11 + Math.random() * 16;
    const delay = -Math.random() * duration;

    petal.className = "petal";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--x-start", `${start}vw`);
    petal.style.setProperty("--x-end", `${end}vw`);
    petal.style.setProperty("--depth", `${-220 + Math.random() * 440}px`);
    petal.style.setProperty("--spin", `${Math.random() * 360}deg`);
    petal.style.setProperty("--duration", `${duration}s`);
    petal.style.setProperty("--delay", `${delay}s`);
    petal.style.setProperty("--opacity", `${0.22 + Math.random() * 0.5}`);
    field.appendChild(petal);
  }
};

const burstSparks = () => {
  const sparkCount = window.innerWidth < 700 ? 18 : 28;

  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.setProperty("--angle", `${(360 / sparkCount) * index + Math.random() * 12}deg`);
    spark.style.setProperty("--distance", `${80 + Math.random() * 160}px`);
    spark.style.setProperty("--size", `${4 + Math.random() * 7}px`);
    field.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
};

const revealInvitation = () => {
  if (stage.classList.contains("is-revealed")) {
    return;
  }

  stage.classList.remove("is-closed");
  stage.classList.add("is-revealed");
  document.body.classList.add("invitation-open");
  coverButton.setAttribute("aria-expanded", "true");
  coverButton.setAttribute("aria-label", "Invitation revealed");

  if (!reduceMotion) {
    burstSparks();
  }
};

coverButton.addEventListener("click", revealInvitation);

if (!reduceMotion) {
  makePetals();

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const setTargetTilt = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    targetX = y * -9;
    targetY = x * 13;
  };

  window.addEventListener("pointermove", (event) => {
    setTargetTilt(event.clientX, event.clientY);
  });

  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  window.addEventListener(
    "deviceorientation",
    (event) => {
      if (event.beta === null || event.gamma === null) {
        return;
      }

      targetX = Math.max(-7, Math.min(7, event.beta - 48)) * -0.38;
      targetY = Math.max(-9, Math.min(9, event.gamma)) * 0.58;
    },
    { passive: true }
  );

  const animateTilt = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    stage.style.setProperty("--rx", `${currentX.toFixed(2)}deg`);
    stage.style.setProperty("--ry", `${currentY.toFixed(2)}deg`);
    requestAnimationFrame(animateTilt);
  };

  animateTilt();
}
