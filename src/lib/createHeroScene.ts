import * as THREE from "three";
import {
  coverScale,
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_WIDTH,
  normalizedPointer,
  photoDepth,
  scrollProgress,
} from "./heroMotion";

export type HeroSceneController = {
  dispose: () => void;
  setPaused: (paused: boolean) => void;
};

export async function createHeroScene(
  canvas: HTMLCanvasElement,
  hero: HTMLElement,
  signal: AbortSignal,
  onFailure: () => void,
): Promise<HeroSceneController | null> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const textures: THREE.Texture[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  let disposed = false;
  let frame = 0;
  let paused = false;
  let visible = true;
  let resizeObserver: ResizeObserver | undefined;
  let intersectionObserver: IntersectionObserver | undefined;
  let removeEvents = () => {};
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    removeEvents();
    textures.forEach((texture) => texture.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    signal.removeEventListener("abort", dispose);
  };
  signal.addEventListener("abort", dispose, { once: true });
  const load = async (url: string) => {
    const texture = await new THREE.TextureLoader().loadAsync(url);
    if (disposed) {
      texture.dispose();
      throw new Error("Hero scene disposed");
    }
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return texture;
  };

  try {
    if (signal.aborted) {
      dispose();
      return null;
    }
    const photoTexture = await load("/images/hero-premium.jpg");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.z = 3.4;
    const aspect = HERO_IMAGE_WIDTH / HERO_IMAGE_HEIGHT;
    const geometry = new THREE.PlaneGeometry(aspect, 1, 160, 96);
    const material = new THREE.MeshBasicMaterial({ map: photoTexture });
    geometries.push(geometry);
    materials.push(material);
    const photo = new THREE.Mesh(geometry, material);
    scene.add(photo);
    const position = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");

    let baseScale = 1;
    let baseX = 0;
    const current = { x: 0, y: 0, scroll: 0 };
    const target = { x: 0, y: 0, scroll: 0 };
    const render = () => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      current.x += (target.x - current.x) * 0.065;
      current.y += (target.y - current.y) * 0.065;
      current.scroll += (target.scroll - current.scroll) * 0.085;
      camera.position.set(
        current.x * 0.07,
        -current.y * 0.035 - current.scroll * 0.035,
        3.4 - current.x * 0.09 - current.scroll * 0.32,
      );
      renderer.render(scene, camera);
      if (
        Math.abs(target.x - current.x) +
          Math.abs(target.y - current.y) +
          Math.abs(target.scroll - current.scroll) >
        0.0002
      )
        schedule();
    };
    const schedule = () => {
      if (!disposed && !frame && visible && !document.hidden)
        frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const { width, height } = hero.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(35 / 2)) * 3.4;
      const viewWidth = viewHeight * camera.aspect;
      baseScale = coverScale(viewWidth, viewHeight, aspect) * 1.1;
      // Keep the cab in frame when a portrait viewport crops the landscape photo.
      baseX = width <= 700 ? (baseScale * aspect - viewWidth) * 0.26 : 0;
      for (let i = 0; i < position.count; i++) {
        const u = uv.getX(i);
        const v = 1 - uv.getY(i);
        const z = photoDepth(u, v) * baseScale;
        const perspective = (3.4 - z) / 3.4;
        position.setXYZ(
          i,
          ((u - 0.5) * aspect * baseScale + baseX) * perspective,
          (0.5 - v) * baseScale * perspective,
          z,
        );
      }
      position.needsUpdate = true;
      geometry.computeBoundingSphere();
      schedule();
    };
    const pointerMove = (event: PointerEvent) => {
      if (paused || event.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      target.x = normalizedPointer(event.clientX, rect.left, rect.width);
      target.y = normalizedPointer(event.clientY, rect.top, rect.height);
      schedule();
    };
    const reset = () => {
      if (!paused) {
        target.x = 0;
        target.y = 0;
        schedule();
      }
    };
    const scroll = () => {
      if (paused || !visible) return;
      const rect = hero.getBoundingClientRect();
      target.scroll = scrollProgress(rect.top, rect.height);
      schedule();
    };
    const visibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      dispose();
      onFailure();
    };
    hero.addEventListener("pointermove", pointerMove, { passive: true });
    hero.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibilityChange);
    canvas.addEventListener("webglcontextlost", contextLost);
    removeEvents = () => {
      hero.removeEventListener("pointermove", pointerMove);
      hero.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibilityChange);
      canvas.removeEventListener("webglcontextlost", contextLost);
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        scroll();
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(hero);
    resize();
    scroll();
    cancelAnimationFrame(frame);
    render();
    return {
      dispose,
      setPaused(value) {
        paused = value;
        if (paused) {
          Object.assign(target, current);
          cancelAnimationFrame(frame);
          frame = 0;
        } else scroll();
      },
    };
  } catch (error) {
    dispose();
    if (!signal.aborted) throw error;
    return null;
  }
}
