const shopHeroStage = document.querySelector("[data-shop-hero-stage]");
const shopHero = document.querySelector(".shop-hero");
const shopHeroPanels = document.querySelectorAll(".shop-hero__media-panel");
const shopHeroContent = document.querySelector(".shop-hero__content");
const shopProductsIntro = document.querySelector(".shop-products__intro");
const shopProductsScrollArt = document.querySelector(".shop-products__scroll-art");
const shopMenuToggle = document.querySelector("[data-shop-menu-toggle]");
const shopCategoryDrawer = document.querySelector("[data-shop-category-drawer]");
const shopCategoryButtons = document.querySelectorAll("[data-shop-category]");
const shopBestCards = document.querySelectorAll("[data-shop-product-card]");
const shopProductSection = document.querySelector(".shop-product");
const shopProductCards = Array.from(document.querySelectorAll(".shop-product__image-card"));
const shopProductName = document.querySelector(".shop-product__headline h3");
const shopProductPrice = document.querySelector(".shop-product__headline p");
const shopProductDescription = document.querySelector(".shop-product__description");
const shopProductCategoryTitle = document.querySelector(".shop-product__category-title");
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
        id: "acton-iii",
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "ACTON lll",
        price: "460,000",
        description: "컴팩트한 사이즈에 담아낸 시그니처 마샬 사운드",
        colorCount: 5,
        weight: "2.85kg",
        output: "60W",
    },
    {
        id: "stanmore-iii",
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "STANMORE lll",
        price: "950,000",
        description: "강력한 퍼포먼스와 균형 잡힌 사운드의 베스트 셀러",
        colorCount: 3,
        weight: "4.25kg",
        output: "80W",
    },
    {
        id: "woburn-iii",
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "WOBURN lll",
        price: "950,000",
        description: "압도적인 출력으로 공간을 가득 채우는 플래그십 스피커",
        colorCount: 4,
        weight: "7.45kg",
        output: "150W",
    },
    {
        id: "heston-120",
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "HESTON 120",
        price: "460,000",
        description: "Dolby Atmos로 완성한 입체 음향",
        colorCount: 2,
        weight: "7.04kg",
        output: "150W",
    },
    {
        id: "heston-sub-200",
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "HESTON SUB 200",
        price: "1,090,000",
        description: "깊고 강력한 저음을 더하는 무선 서브우퍼",
        colorCount: 2,
        weight: "7.62kg",
        output: "236W",
    },
];
const shopBestProductDetails = {
    "major-v": {
        category: "headphones",
        categoryLabel: "HEADPHONES",
        name: "MAJOR V",
        price: "199,000",
        description: "긴 재생 시간과 접이식 구조의 온이어 헤드폰",
        colorCount: 2,
        weight: "186g",
        output: "해당없음",
    },
    "stockwell-iii": {
        category: "speaker",
        categoryLabel: "SPEAKER",
        name: "STOCKWELL III",
        price: "399,000",
        description: "이동하는 하루에 어울리는 포터블 마샬 사운드",
        colorCount: 2,
        weight: "1.3kg",
        output: "127W",
    },
    "dsl-overdrive": {
        category: "analog",
        categoryLabel: "ANALOG",
        name: "DSL OVERDRIVE PEDAL",
        price: null,
        description: "앰프의 질감을 발끝에서 제어하는 오버드라이브 페달",
        colorCount: 2,
        weight: "800g",
        output: "해당없음",
    },
};
const shopCategoryDefaultProduct = {
    amp: "dsl-overdrive",
    speaker: "acton-iii",
    headphones: "major-v",
    analog: "dsl-overdrive",
};
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
let shopManualProductId = null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function easeSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

function getProductById(productId) {
    return shopProductDetails.find((product) => product.id === productId) || shopBestProductDetails[productId];
}

function formatShopPrice(product) {
    if (!product.price) return "판매처 알아보기";
    return `<strong>₩</strong> ${product.price}`;
}

function setShopDrawerOpen(isOpen) {
    if (!shopMenuToggle || !shopCategoryDrawer) return;

    shopMenuToggle.setAttribute("aria-expanded", String(isOpen));
    shopCategoryDrawer.hidden = false;
    shopCategoryDrawer.classList.toggle("is-open", isOpen);

    if (!isOpen) {
        window.setTimeout(() => {
            if (!shopCategoryDrawer.classList.contains("is-open")) {
                shopCategoryDrawer.hidden = true;
            }
        }, 420);
    }
}

function updateShopCategoryState(category) {
    shopCategoryButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.shopCategory === category);
    });
}

function updateShopBestCardState(productId) {
    shopBestCards.forEach((card) => {
        const isSelected = card.dataset.shopProductCard === productId;
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
    });
}

function renderShopProductColors(colorCount) {
    if (!shopProductColorList) return;

    const plainCount = Math.max(colorCount - 1, 0);
    const colorNodes = shopProductColorClasses.slice(0, plainCount).map((colorClass, index) => {
        return `<button class="shop-product__color ${colorClass}" type="button" aria-label="Color ${index + 1}" aria-pressed="false"></button>`;
    });

    colorNodes.push('<button class="shop-product__color shop-product__color--selected" type="button" aria-label="Selected color" aria-pressed="true"></button>');
    shopProductColorList.innerHTML = colorNodes.join("");

    shopProductColorList.querySelectorAll(".shop-product__color").forEach((button) => {
        button.addEventListener("click", () => {
            shopProductColorList.querySelectorAll(".shop-product__color").forEach((colorButton) => {
                colorButton.setAttribute("aria-pressed", "false");
            });
            button.setAttribute("aria-pressed", "true");
        });
    });
}

function renderShopProductDetails(productOrIndex) {
    const product = typeof productOrIndex === "number" ? shopProductDetails[productOrIndex] : productOrIndex;
    if (!product || !shopProductName || !shopProductPrice || !shopProductDescription) return;

    shopProductSection?.classList.add("is-changing");

    window.setTimeout(() => {
        shopProductName.textContent = product.name;
        shopProductPrice.innerHTML = formatShopPrice(product);
        shopProductDescription.textContent = product.description;
        if (shopProductCategoryTitle) shopProductCategoryTitle.textContent = product.categoryLabel || "SPEAKER";
        renderShopProductColors(product.colorCount);
        updateShopCategoryState(product.category);
        updateShopBestCardState(product.id);

        const weightRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Weight");
        const outputRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Output");

        if (weightRow) weightRow.querySelector("dd").textContent = product.weight;
        if (outputRow) outputRow.querySelector("dd").textContent = product.output;

        requestAnimationFrame(() => {
            shopProductSection?.classList.remove("is-changing");
        });
    }, 90);
}

function updateShopProductDetails() {
    if (!shopProductCards.length || !shopProductName || !shopProductPrice || !shopProductDescription) return;

    const switchLine = window.innerWidth * 0.0359;
    const activeIndex = shopProductCards.reduce((currentIndex, card, index) => {
        return card.getBoundingClientRect().top <= switchLine + 1 ? index : currentIndex;
    }, 0);

    if (activeIndex === shopActiveProductIndex && !shopManualProductId) return;

    shopActiveProductIndex = activeIndex;

    if (shopManualProductId) {
        renderShopProductDetails(getProductById(shopManualProductId));
        return;
    }

    renderShopProductDetails(activeIndex);
}

function scrollToShopProduct(productId) {
    const index = shopProductDetails.findIndex((product) => product.id === productId);
    const target = index >= 0 ? shopProductCards[index] : shopProductSection;

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initializeShopInteractions() {
    shopMenuToggle?.addEventListener("click", () => {
        setShopDrawerOpen(shopMenuToggle.getAttribute("aria-expanded") !== "true");
    });

    shopCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.shopCategory;
            const productId = shopCategoryDefaultProduct[category] || "acton-iii";
            const product = getProductById(productId);

            shopManualProductId = productId;
            renderShopProductDetails(product);
            scrollToShopProduct(productId);
            setShopDrawerOpen(false);
        });
    });

    shopBestCards.forEach((card) => {
        const productId = card.dataset.shopProductCard;

        card.addEventListener("click", () => {
            shopManualProductId = productId;
            renderShopProductDetails(getProductById(productId));
            scrollToShopProduct(productId);
        });
        card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            shopManualProductId = productId;
            renderShopProductDetails(getProductById(productId));
            scrollToShopProduct(productId);
        });
    });

    window.addEventListener("scroll", () => {
        if (!shopManualProductId || !shopProductSection) return;
        const sectionRect = shopProductSection.getBoundingClientRect();
        if (sectionRect.top < window.innerHeight * 0.2 && sectionRect.bottom > window.innerHeight * 0.5) return;
        shopManualProductId = null;
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setShopDrawerOpen(false);
    });

    document.addEventListener("click", (event) => {
        if (!shopCategoryDrawer?.classList.contains("is-open")) return;
        if (shopCategoryDrawer.contains(event.target) || shopMenuToggle?.contains(event.target)) return;
        setShopDrawerOpen(false);
    });

    setShopDrawerOpen(false);
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
initializeShopInteractions();
window.addEventListener("scroll", updateShopScrollEffects, { passive: true });
window.addEventListener("resize", updateShopScrollEffects);
updateShopScrollEffects();
