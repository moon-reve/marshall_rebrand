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
let shopArtPaths = [];

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function easeSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

function prepareShopArtPaths() {
    if (!shopProductsScrollArt || shopArtPaths.length) return Boolean(shopArtPaths.length);

    const svgDocument = shopProductsScrollArt.contentDocument;
    if (!svgDocument) return false;

    const svgNamespace = "http://www.w3.org/2000/svg";
    const svgRoot = svgDocument.documentElement;
    let defs = svgRoot.querySelector("defs");

    if (!defs) {
        defs = svgDocument.createElementNS(svgNamespace, "defs");
        svgRoot.prepend(defs);
    }

    shopArtPaths = Array.from(svgDocument.querySelectorAll("path"))
        .sort((firstPath, secondPath) => firstPath.getBBox().x - secondPath.getBBox().x)
        .map((sourcePath, index) => {
        const mask = svgDocument.createElementNS(svgNamespace, "mask");
        const maskId = `shop-products-art-mask-${index}`;
        mask.setAttribute("id", maskId);
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "-1000");
        mask.setAttribute("y", "-1000");
        mask.setAttribute("width", "4000");
        mask.setAttribute("height", "4000");

        const path = sourcePath.cloneNode(false);
        const length = path.getTotalLength();
        const firstPoint = path.getPointAtLength(0);
        const lastPoint = path.getPointAtLength(length);
        const shouldRevealFromEnd = lastPoint.x < firstPoint.x;

        path.style.fill = "none";
        path.style.stroke = "#ffffff";
        path.style.strokeWidth = "8";
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${shouldRevealFromEnd ? -length : length}`;

        mask.appendChild(path);
        defs.appendChild(mask);

        sourcePath.style.fill = "#000000";
        sourcePath.style.stroke = "none";
        sourcePath.setAttribute("mask", `url(#${maskId})`);

        return { path, length, shouldRevealFromEnd };
        });

    return Boolean(shopArtPaths.length);
}

function updateShopArtReveal() {
    if (!shopProductsIntro || !shopProductsScrollArt || !prepareShopArtPaths()) return;

    const introRect = shopProductsIntro.getBoundingClientRect();
    const revealDistance = Math.max(introRect.height * 1.1, 1);
    shopArtTargetProgress = clamp((window.innerHeight - introRect.top) / revealDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        shopArtPaths.forEach(({ path }) => path.style.strokeDashoffset = "0");
        return;
    }

    if (shopArtAnimationFrame) return;

    function renderShopArtReveal() {
        const distance = shopArtTargetProgress - shopArtRenderedProgress;
        shopArtRenderedProgress += distance * 0.025;

        if (Math.abs(distance) < 0.0001) {
            shopArtRenderedProgress = shopArtTargetProgress;
        }

        const pathCount = shopArtPaths.length;

        shopArtPaths.forEach(({ path, length, shouldRevealFromEnd }, index) => {
            const pathStart = index / pathCount;
            const pathProgress = clamp((shopArtRenderedProgress - pathStart) * pathCount, 0, 1);
            const hiddenOffset = shouldRevealFromEnd ? -length : length;

            path.style.strokeDashoffset = `${hiddenOffset * (1 - pathProgress)}`;
        });

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

shopProductsScrollArt?.addEventListener("load", updateShopArtReveal);
renderShopHeroPanels(0);
window.addEventListener("scroll", updateShopScrollEffects, { passive: true });
window.addEventListener("resize", updateShopScrollEffects);
updateShopScrollEffects();
