(() => {
  const embedded = window.parent !== window;
  let previousHeight = 0;
  let previousStep = "";
  let queued = false;
  let started = false;
  function trackStart(event) {
    if (!embedded || started || !(event.target instanceof Element) || !event.target.closest(".application-root")) return;
    if (!event.target.matches("input, select, textarea")) return;
    started = true;
    window.parent.postMessage({ type: "supreme:application-analytics", phase: "start" }, location.origin);
  }
  document.addEventListener("input", trackStart);
  document.addEventListener("change", trackStart);
  function sync() {
    queued = false;
    const root = document.querySelector(".application-root");
    if (
      !root ||
      !root.querySelector("header") ||
      root.querySelector("header")?.textContent?.includes("{{") ||
      !root.querySelector("footer button:last-child")?.textContent?.trim() ||
      root.querySelector("footer button:last-child")?.textContent?.includes("{{")
    )
      return;
    // The standalone runtime briefly exposes unbound template handlers. Keep
    // both pointer and keyboard input inert until the first render is complete.
    if (root.hasAttribute("inert")) {
      root.inert = false;
      root.removeAttribute("aria-busy");
    }
    if (!embedded) return;
    const height = Math.ceil(root.getBoundingClientRect().height + 2);
    if (height > 100 && height !== previousHeight) {
      previousHeight = height;
      window.parent.postMessage(
        { type: "supreme-application-height", height },
        location.origin,
      );
    }
    const step = root.querySelector("header > div")?.textContent?.trim() || "";
    if (previousStep && step && previousStep !== step)
      window.parent.postMessage(
        { type: "supreme-application-step" },
        location.origin,
      );
    previousStep = step;
  }
  function queue() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sync);
    }
  }
  const observer = new MutationObserver(queue);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  new ResizeObserver(queue).observe(document.body);
  window.addEventListener("resize", queue);
  queue();
})();
