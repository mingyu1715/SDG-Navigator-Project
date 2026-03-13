function cloneCard(cardEl) {
  const rect = cardEl.getBoundingClientRect();
  const clone = cardEl.cloneNode(true);
  clone.classList.add("nav-card-clone");
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.position = "fixed";
  document.body.appendChild(clone);
  return { clone, rect };
}

function createLayer(accent, rect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const layer = document.createElement("div");
  layer.className = "route-transition-layer";
  layer.style.setProperty("--detail-accent", accent);
  document.body.appendChild(layer);

  // Start from nothing at screen center, then expand to full.
  const maxRadius = Math.hypot(vw / 2, vh / 2) + 8;

  window.gsap.set(layer, {
    clipPath: "circle(0px at 50% 50%)",
    opacity: 1
  });

  return { layer, maxRadius };
}

export function transitionMainToDetail({ cardEl, accent, detailRoot, onHalfOpen, waitForReady }) {
  const gsap = window.gsap;
  if (!gsap || !cardEl) {
    if (onHalfOpen) onHalfOpen();
    return Promise.resolve();
  }

  const { clone, rect } = cloneCard(cardEl);
  const { layer, maxRadius } = createLayer(accent, rect);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardCenterX = rect.left + rect.width / 2;
  const cardCenterY = rect.top + rect.height / 2;
  const targetDx = vw / 2 - cardCenterX;
  const targetDy = vh * 0.38 - cardCenterY;

  gsap.set(clone, { x: 0, y: 0, scale: 1, opacity: 1 });
  gsap.set(detailRoot, { opacity: 0, y: 140 });

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (clone.parentNode) clone.parentNode.removeChild(clone);
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      gsap.set(detailRoot, { clearProps: "y" });
      resolve();
    };

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: finish,
      onInterrupt: finish
    });

    // Safety net: never leave transition stuck on paused timeline.
    const hardStop = window.setTimeout(() => {
      try {
        tl.kill();
      } catch {
        // ignore
      }
      finish();
    }, 9000);

    tl
      .to(clone, { duration: 1.25, x: targetDx, y: targetDy, scale: 1.58, ease: "power3.out" })
      .to(layer, { duration: 1.2, clipPath: `circle(${maxRadius}px at 50% 50%)`, ease: "power4.inOut" })
      .add(() => {
        if (onHalfOpen) onHalfOpen();
        if (waitForReady) {
          tl.pause();
          let resumed = false;
          const resume = () => {
            if (resumed) return;
            resumed = true;
            try {
              tl.play();
            } catch {
              // ignore
            }
          };
          const resumeTimer = window.setTimeout(resume, 4200);

          try {
            Promise.resolve(waitForReady())
              .catch(() => null)
              .finally(() => {
                window.clearTimeout(resumeTimer);
                resume();
              });
          } catch {
            window.clearTimeout(resumeTimer);
            resume();
          }
        }
      })
      .to(detailRoot, { duration: 0.88, opacity: 1, y: 0, ease: "power3.out" })
      .to([clone, layer], { duration: 0.92, y: `+=${vh}`, ease: "power2.inOut" }, "<");

    tl.eventCallback("onComplete", () => {
      window.clearTimeout(hardStop);
      finish();
    });
    tl.eventCallback("onInterrupt", () => {
      window.clearTimeout(hardStop);
      finish();
    });
  });
}

export function transitionDetailToMain({ detailRoot, targetRect }) {
  const gsap = window.gsap;
  if (!gsap || !detailRoot) {
    return Promise.resolve();
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = targetRect || {
    left: (vw - 250) / 2,
    top: (vh - 360) / 2,
    width: 250,
    height: 360
  };
  const targetCenterX = rect.left + rect.width / 2;
  const targetCenterY = rect.top + rect.height / 2;
  const dx = targetCenterX - vw / 2;
  const dy = targetCenterY - vh / 2;
  const inset = `inset(${Math.max(0, rect.top)}px ${Math.max(0, vw - (rect.left + rect.width))}px ${Math.max(0, vh - (rect.top + rect.height))}px ${Math.max(0, rect.left)}px round 14px)`;

  return new Promise((resolve) => {
    gsap.set(detailRoot, {
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      clipPath: "inset(0px 0px 0px 0px round 0px)",
      transformOrigin: "50% 50%"
    });

    gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(detailRoot, { clearProps: "transform,clipPath,filter,opacity" });
        resolve();
      }
    }).to(detailRoot, {
      duration: 0.9,
      // Use clipPath as the source of truth for exact card-bound matching.
      clipPath: inset,
      x: dx * 0.02,
      y: dy * 0.02,
      filter: "brightness(0.96)",
      opacity: 0
    });
  });
}
