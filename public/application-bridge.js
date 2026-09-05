(() => {
  if (window.parent === window) return;
  let previousHeight = 0;
  let previousStep = "";
  let queued = false;
  function sync() {
    queued = false;
    const root = document.querySelector(".application-root");
    if (
      !root ||
      !root.querySelector("header") ||
      root.querySelector("header")?.textContent?.includes("{{")
    )
      return;
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
