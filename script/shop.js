const shopHeroStage = document.querySelector("[data-shop-hero-stage]");
const shopHero = document.querySelector(".shop-hero");
const shopHeroPanels = document.querySelectorAll(".shop-hero__media-panel");
const shopHeroContent = document.querySelector(".shop-hero__content");
const shopProductsIntro = document.querySelector(".shop-products__intro");
const shopProductsScrollArt = document.querySelector(".shop-products__scroll-art");
const shopProductCards = Array.from(document.querySelectorAll(".shop-product__image-card"));
const shopProductName = document.querySelector(".shop-product__headline h3");
const shopProductPrice = document.querySelector(".shop-product__headline p");
const shopProductDescription = document.querySelector(".shop-product__description");
const shopProductColorList = document.querySelector(".shop-product__color-list");
const shopProductSpecRows = Array.from(document.querySelectorAll(".shop-product__spec-row"));
const shopPanelTimings = [
    [0, 0.56],
    [0.08, 0.66],
    [0.24, 0.82],
    [0.4, 0.96],
];
const shopProductDetails = [
    {
        name: "ACTON lll",
        price: "460,000",
        description: "컴팩트한 사이즈에 담아낸 시그니처 마샬 사운드",
        colorCount: 5,
        weight: "2.85kg",
        output: "60W",
    },
    {
        name: "STANMORE lll",
        price: "950,000",
        description: "강력한 퍼포먼스와 균형 잡힌 사운드의 베스트 셀러",
        colorCount: 3,
        weight: "4.25kg",
        output: "80W",
    },
    {
        name: "WOBURN lll",
        price: "950,000",
        description: "압도적인 출력으로 공간을 가득 채우는 플래그십 스피커",
        colorCount: 4,
        weight: "7.45kg",
        output: "150W",
    },
    {
        name: "HESTON 120",
        price: "460,000",
        description: "Dolby Atmos로 완성한 입체 음향",
        colorCount: 2,
        weight: "7.04kg",
        output: "150W",
    },
    {
        name: "HESTON SUB 200",
        price: "1,090,000",
        description: "깊고 강력한 저음을 더하는 무선 서브우퍼",
        colorCount: 2,
        weight: "7.62kg",
        output: "236W",
    },
];
const shopProductColorClasses = [
    "shop-product__color--cream",
    "shop-product__color--brown",
    "shop-product__color--gray",
    "shop-product__color--black",
];

let shopTargetProgress = 0;
let shopRenderedProgress = 0;
let shopAnimationFrame = null;
let shopArtTargetProgress = 0;
let shopArtRenderedProgress = 0;
let shopArtAnimationFrame = null;
let shopActiveProductIndex = -1;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function easeSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

function renderShopProductColors(colorCount) {
    if (!shopProductColorList) return;

    const plainCount = Math.max(colorCount - 1, 0);
    const colorNodes = shopProductColorClasses.slice(0, plainCount).map((colorClass) => {
        return `<span class="shop-product__color ${colorClass}"></span>`;
    });

    colorNodes.push('<span class="shop-product__color shop-product__color--selected"></span>');
    shopProductColorList.innerHTML = colorNodes.join("");
}

function renderShopProductDetails(index) {
    const product = shopProductDetails[index];
    if (!product) return;

    shopProductName.textContent = product.name;
    shopProductPrice.innerHTML = `<strong>₩</strong> ${product.price}`;
    shopProductDescription.textContent = product.description;
    renderShopProductColors(product.colorCount);

    const weightRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Weight");
    const outputRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Output");

    if (weightRow) weightRow.querySelector("dd").textContent = product.weight;
    if (outputRow) outputRow.querySelector("dd").textContent = product.output;
}

function updateShopProductDetails() {
    if (!shopProductCards.length || !shopProductName || !shopProductPrice || !shopProductDescription) return;

    const switchLine = window.innerWidth * 0.0359;
    const activeIndex = shopProductCards.reduce((currentIndex, card, index) => {
        return card.getBoundingClientRect().top <= switchLine + 1 ? index : currentIndex;
    }, 0);

    if (activeIndex === shopActiveProductIndex) return;

    shopActiveProductIndex = activeIndex;
    renderShopProductDetails(activeIndex);
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
    updateShopProductDetails();
}

renderShopHeroPanels(0);
renderShopProductDetails(0);
window.addEventListener("scroll", updateShopScrollEffects, { passive: true });
window.addEventListener("resize", updateShopScrollEffects);
updateShopScrollEffects();
