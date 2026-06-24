const shopHeroStage = document.querySelector("[data-shop-hero-stage]");
const shopHero = document.querySelector(".shop-hero");
const shopHeroPanels = document.querySelectorAll(".shop-hero__media-panel");
const shopHeroContent = document.querySelector(".shop-hero__content");
const shopProductsIntro = document.querySelector(".shop-products__intro");
const shopProductsScrollArt = document.querySelector(".shop-products__scroll-art");
const shopPanelTimings = [
    [0, 0.56],
    [0.08, 0.66],
    [0.24, 0.82],
    [0.4, 0.96],
];

let shopTargetProgress = 0;
let shopRenderedProgress = 0;
let shopAnimationFrame = null;
let shopArtTargetProgress = 0;
let shopArtRenderedProgress = 0;
let shopArtAnimationFrame = null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function easeSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

function updateShopArtReveal() {
    if (!shopProductsIntro || !shopProductsScrollArt) return;

    const introRect = shopProductsIntro.getBoundingClientRect();
    const revealStart = window.innerHeight * 0.85;
    const revealDistance = Math.max(introRect.height * 0.8, 1);
    shopArtTargetProgress = clamp((revealStart - introRect.top) / revealDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        shopProductsScrollArt.style.setProperty("--shop-art-reveal", "100%");
        return;
    }

    if (shopArtAnimationFrame) return;

    function renderShopArtReveal() {
        const distance = shopArtTargetProgress - shopArtRenderedProgress;
        shopArtRenderedProgress += distance * 0.025;

        if (Math.abs(distance) < 0.0001) {
            shopArtRenderedProgress = shopArtTargetProgress;
        }

        shopProductsScrollArt.style.setProperty("--shop-art-reveal", `${shopArtRenderedProgress * 100}%`);

        if (shopArtRenderedProgress !== shopArtTargetProgress) {
            shopArtAnimationFrame = requestAnimationFrame(renderShopArtReveal);
        } else {
            shopArtAnimationFrame = null;
        }
    }

    shopArtAnimationFrame = requestAnimationFrame(renderShopArtReveal);
}

function renderShopHeroPanels(progress) {
    shopHeroPanels.forEach((panel, index) => {
        const [start, end] = shopPanelTimings[index];
        const panelProgress = easeSmooth(sequenceProgress(progress, start, end));

        panel.style.setProperty("--shop-panel-y", `${-panelProgress * 100}%`);
    });

    const [contentStart, contentEnd] = shopPanelTimings[0];
    const contentProgress = easeSmooth(sequenceProgress(progress, contentStart, contentEnd));
    shopHeroContent?.style.setProperty("--shop-content-y", `${-contentProgress * 100}%`);
}

function updateShopHeroTransition() {
    if (!shopHeroStage || !shopHero || !shopHeroPanels.length) return;

    const stageRect = shopHeroStage.getBoundingClientRect();
    const scrollDistance = Math.max(shopHeroStage.offsetHeight - shopHero.offsetHeight, 1);
    shopTargetProgress = clamp(-stageRect.top / scrollDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (shopAnimationFrame) cancelAnimationFrame(shopAnimationFrame);
        shopAnimationFrame = null;
        shopHeroPanels.forEach((panel) => panel.style.removeProperty("--shop-panel-y"));
        shopHeroContent?.style.removeProperty("--shop-content-y");
        return;
    }

    if (shopAnimationFrame) return;

    function renderTransition() {
        const distance = shopTargetProgress - shopRenderedProgress;
        shopRenderedProgress += distance * 0.085;

        if (Math.abs(distance) < 0.0001) {
            shopRenderedProgress = shopTargetProgress;
        }

        renderShopHeroPanels(shopRenderedProgress);

        if (shopRenderedProgress !== shopTargetProgress) {
            shopAnimationFrame = requestAnimationFrame(renderTransition);
        } else {
            shopAnimationFrame = null;
        }
    }

    shopAnimationFrame = requestAnimationFrame(renderTransition);
}

function updateShopScrollEffects() {
    updateShopHeroTransition();
    updateShopArtReveal();
}

renderShopHeroPanels(0);
window.addEventListener("scroll", updateShopScrollEffects, { passive: true });
window.addEventListener("resize", updateShopScrollEffects);
updateShopScrollEffects();
