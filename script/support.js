const supportHero = document.querySelector(".support-hero");
const supportHeroLightDuration = 1050;
let supportHeroLightsOn = false;
let supportHeroLightsAnimating = false;
let supportHeroLightFrame = null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function smoothStep(progress) {
    return progress * progress * (3 - 2 * progress);
}

function setSupportHeroLight(progress) {
    if (!supportHero) return;

    const easedProgress = smoothStep(clamp(progress, 0, 1));
    const darkOpacity = 0.8 - easedProgress * 0.8;
    const midOpacity = 0.32 - easedProgress * 0.24;
    const bottomOpacity = 0.5 - easedProgress * 0.36;

    supportHero.style.setProperty("--support-hero-dark-opacity", `${darkOpacity}`);
    supportHero.style.setProperty("--support-hero-mid-opacity", `${midOpacity}`);
    supportHero.style.setProperty("--support-hero-bottom-opacity", `${bottomOpacity}`);
}

function isSupportHeroAtStart() {
    if (!supportHero) return false;
    const rect = supportHero.getBoundingClientRect();
    return rect.top >= -10 && rect.bottom > window.innerHeight * 0.55;
}

function turnOnSupportHeroLight() {
    if (!supportHero || supportHeroLightsOn || supportHeroLightsAnimating) return;

    supportHeroLightsAnimating = true;
    const startTime = performance.now();

    function render(now) {
        const progress = clamp((now - startTime) / supportHeroLightDuration, 0, 1);
        setSupportHeroLight(progress);

        if (progress < 1) {
            supportHeroLightFrame = requestAnimationFrame(render);
            return;
        }

        setSupportHeroLight(1);
        supportHeroLightsOn = true;
        supportHeroLightsAnimating = false;
        supportHeroLightFrame = null;
    }

    supportHeroLightFrame = requestAnimationFrame(render);
}

function blockScrollUntilSupportHeroLightsOn(event) {
    if (!supportHero || supportHeroLightsOn || !isSupportHeroAtStart()) return false;

    event.preventDefault();
    event.stopImmediatePropagation();
    turnOnSupportHeroLight();
    return true;
}

function handleSupportHeroWheel(event) {
    if (event.deltaY <= 0) return;
    blockScrollUntilSupportHeroLightsOn(event);
}

function handleSupportHeroKeydown(event) {
    const scrollDownKeys = [" ", "Spacebar", "PageDown", "ArrowDown"];
    if (!scrollDownKeys.includes(event.key)) return;
    blockScrollUntilSupportHeroLightsOn(event);
}

setSupportHeroLight(0);
window.addEventListener("wheel", handleSupportHeroWheel, { passive: false, capture: true });
window.addEventListener("keydown", handleSupportHeroKeydown, { capture: true });
