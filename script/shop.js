const shopHeroStage = document.querySelector("[data-shop-hero-stage]");
const shopHero = document.querySelector(".shop-hero");
const shopHeroPanels = document.querySelectorAll(".shop-hero__media-panel");
const shopHeroContent = document.querySelector(".shop-hero__content");
const shopTopbarMain = document.querySelector(".shop-topbar__main");
const shopBestSection = document.querySelector(".shop-best");
const shopCategoryButtons = document.querySelectorAll("[data-shop-category]");
const shopBestCards = document.querySelectorAll("[data-shop-product-card]");
const productCardSwatches = document.querySelectorAll(".product-card__swatch");
const shopProductSection = document.querySelector(".shop-product");
const shopProductScroll = document.querySelector(".shop-product__scroll");
const shopFooter = document.querySelector(".site-footer, .footer");
let shopProductCards = Array.from(document.querySelectorAll(".shop-product__image-card"));
const shopProductName = document.querySelector(".shop-product__headline h3");
const shopProductDescription = document.querySelector(".shop-product__description");
const shopProductCategoryTitle = document.querySelector(".shop-product__category-title");
const shopProductCategoryProgress = document.querySelector(".shop-product__category-progress");
const shopProductColorList = document.querySelector(".shop-product__color-list");
const shopProductSpecRows = Array.from(document.querySelectorAll(".shop-product__spec-row"));
const shopPanelTimings = [
    [0, 0.56],
    [0.08, 0.66],
    [0.24, 0.82],
    [0.4, 0.96],
];
const shopProductCatalog = {
    speaker: [
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
            imageSrc: "./assets/images/products/speaker-acton-iii-blue.png",
            imageClass: "shop-product__image--acton-iii",
            imageSizeClass: "shop-product__image--small",
            imageAlt: "Marshall Acton III speaker",
        },
        {
            id: "stanmore-iii",
            category: "speaker",
            categoryLabel: "SPEAKER",
            name: "STANMORE lll",
            price: "950,000",
            description: "강력한 퍼포먼스와 균형 잡힌 사운드의 베스트셀러 스피커",
            colorCount: 3,
            weight: "4.25kg",
            output: "80W",
            imageSrc: "./assets/images/products/speaker-woburn-iii-brown.png",
            imageClass: "shop-product__image--stanmore-iii",
            imageSizeClass: "shop-product__image--small",
            imageAlt: "Marshall Stanmore III speaker",
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
            imageSrc: "./assets/images/products/speaker-woburn-iii-black.png",
            imageClass: "shop-product__image--woburn-iii",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Marshall Woburn III black speaker",
        },
        {
            id: "heston-120",
            category: "speaker",
            categoryLabel: "SPEAKER",
            name: "HESTON 120",
            price: "460,000",
            description: "Dolby Atmos로 완성한 입체 사운드",
            colorCount: 2,
            weight: "7.04kg",
            output: "150W",
            imageSrc: "./assets/images/products/speaker-heston120-Cream.png",
            imageClass: "shop-product__image--heston-120",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Marshall Heston 120 cream speaker",
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
            imageSrc: "./assets/images/products/speaker-heston-sub200-black.png",
            imageClass: "shop-product__image--heston-sub-200",
            imageSizeClass: "shop-product__image--xlarge",
            imageAlt: "Marshall Heston Sub 200 black speaker",
        },
    ],
    amp: [
        {
            id: "dsl40-combo",
            category: "amp",
            categoryLabel: "AMP",
            name: "DSL40 COMBO",
            price: "1,450,000~",
            description: "라이브와 스튜디오를 위한 시그니처 진공관 콤보 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "22.9kg",
            output: "40W",
            imageSrc: "./assets/images/products/amp-dsl40.webp",
            imageClass: "shop-product__image--dsl40-combo",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "DSL40 Combo amplifier",
        },
        {
            id: "jvm410h",
            category: "amp",
            categoryLabel: "AMP",
            name: "JVM410H",
            price: "2,900,000~",
            description: "최고의 퍼포먼스를 위한 플래그십 헤드 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "22.5kg",
            output: "100W",
            imageSrc: "./assets/images/products/amp-jvm410.webp",
            imageClass: "shop-product__image--jvm410h",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "JVM410H amplifier",
        },
        {
            id: "origin50c",
            category: "amp",
            categoryLabel: "AMP",
            name: "Origin50C",
            price: "1,250,000~",
            description: "전통적인 브리티시 톤을 담아낸 올밸브 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "18.3kg",
            output: "50W",
            imageSrc: "./assets/images/products/amp-origin50.webp",
            imageClass: "shop-product__image--origin50c",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Origin50C amplifier",
        },
        {
            id: "jtm-st20c",
            category: "amp",
            categoryLabel: "AMP",
            name: "Studio JTM ST20C",
            price: "2,100,000~",
            description: "전설적인 JTM 사운드를 현대적으로 재해석한 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "19.4kg",
            output: "20W",
            imageSrc: "./assets/images/products/amp-jtm-st20.webp",
            imageClass: "shop-product__image--jtm-st20c",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Studio JTM ST20C amplifier",
        },
        {
            id: "mg30gfx",
            category: "amp",
            categoryLabel: "AMP",
            name: "MG30GFX",
            price: "430,000~",
            description: "연습부터 공연까지 활용 가능한 디지털 콤보 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "10.8kg",
            output: "30W",
            imageSrc: "./assets/images/products/amp-mg30gfx.webp",
            imageClass: "shop-product__image--mg30gfx",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "MG30GFX amplifier",
        },
        {
            id: "code50",
            category: "amp",
            categoryLabel: "AMP",
            name: "CODE50",
            price: "520,000~",
            description: "다양한 마샬 톤을 구현하는 모델링 앰프",
            colorClasses: ["shop-product__color--true-black"],
            weight: "13.0kg",
            output: "50W",
            imageSrc: "./assets/images/products/amp-code50.webp",
            imageClass: "shop-product__image--code50",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "CODE50 amplifier",
        },
    ],
    headphones: [
        {
            id: "major-v",
            category: "headphones",
            categoryLabel: "HEADPHONES",
            name: "Major V",
            price: "219,000~",
            description: "마샬의 시그니처 사운드를 담은 대표 온이어 헤드폰",
            colorClasses: ["shop-product__color--headphone-black", "shop-product__color--headphone-brown", "shop-product__color--headphone-cream"],
            weight: "186g",
            outputLabel: "Battery Life",
            output: "Up to 100 Hours",
            imageSrc: "./assets/images/products/headphones-major-v.png",
            imageClass: "shop-product__image--major-v",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Major V headphones",
        },
        {
            id: "monitor-iii-anc",
            category: "headphones",
            categoryLabel: "HEADPHONES",
            name: "Monitor III A.N.C.",
            price: "549,000~",
            description: "프리미엄 노이즈 캔슬링을 갖춘 플래그십 헤드폰",
            colorClasses: ["shop-product__color--headphone-black"],
            weight: "250g",
            outputLabel: "Battery Life",
            output: "Up to 70 Hours",
            imageSrc: "./assets/images/products/headphones-major-v.png",
            imageClass: "shop-product__image--monitor-iii-anc",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Monitor III A.N.C. headphones",
        },
        {
            id: "minor-iv",
            category: "headphones",
            categoryLabel: "HEADPHONES",
            name: "Minor IV",
            price: "189,000~",
            description: "가볍고 자유로운 착용감을 제공하는 무선 이어버드",
            colorClasses: ["shop-product__color--headphone-black", "shop-product__color--headphone-cream"],
            weight: "39g",
            outputLabel: "Battery Life",
            output: "Up to 30 Hours",
            imageSrc: "./assets/images/products/headphones-major-v.png",
            imageClass: "shop-product__image--minor-iv",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Minor IV earbuds",
        },
        {
            id: "motif-ii-anc",
            category: "headphones",
            categoryLabel: "HEADPHONES",
            name: "Motif II A.N.C.",
            price: "299,000~",
            description: "강력한 노이즈 캔슬링을 제공하는 프리미엄 이어버드",
            colorClasses: ["shop-product__color--headphone-black"],
            weight: "47g",
            outputLabel: "Battery Life",
            output: "Up to 43 Hours",
            imageSrc: "./assets/images/products/headphones-major-v.png",
            imageClass: "shop-product__image--motif-ii-anc",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Motif II A.N.C. earbuds",
        },
        {
            id: "mode-eq",
            category: "headphones",
            categoryLabel: "HEADPHONES",
            name: "Mode EQ",
            price: "129,000~",
            description: "두 가지 사운드 모드를 지원하는 유선 인이어 이어폰",
            colorClasses: ["shop-product__color--headphone-black"],
            weight: "20g",
            outputLabel: "Battery Life",
            output: "Not Required",
            imageSrc: "./assets/images/products/headphones-major-v.png",
            imageClass: "shop-product__image--mode-eq",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "Mode EQ in-ear headphones",
        },
    ],
    analog: [
        {
            id: "dsl-overdrive",
            category: "analog",
            categoryLabel: "PEDAL",
            name: "DSL OVERDRIVE PEDAL",
            price: null,
            description: "앰프의 질감을 발끝에서 제어하는 오버드라이브 페달",
            colorClasses: ["shop-product__color--true-black", "shop-product__color--headphone-cream"],
            weight: "800g",
            output: "해당없음",
            imageSrc: "./assets/images/products/pedal-dsl.png",
            imageClass: "shop-product__image--dsl-overdrive",
            imageSizeClass: "shop-product__image--large",
            imageAlt: "DSL Overdrive pedal",
        },
    ],
};
const shopProductCategoryOrder = ["amp", "speaker", "headphones", "analog"];
const getAllShopProducts = () => shopProductCategoryOrder.flatMap((category) => shopProductCatalog[category] || []);
const getShopCategoryProducts = (category) => shopProductCatalog[category] || [];
const formatShopCount = (count) => String(count).padStart(2, "0");
let shopActiveCategory = "speaker";
let shopProductDetails = getShopCategoryProducts(shopActiveCategory);
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
        categoryLabel: "PEDAL",
        name: "DSL OVERDRIVE PEDAL",
        price: null,
        description: "앰프의 질감을 발끝에서 제어하는 오버드라이브 페달",
        colorCount: 2,
        weight: "800g",
        output: "해당없음",
    },
};
const shopCategoryDefaultProduct = {
    amp: "dsl40-combo",
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

const smoothScrollEl = document.getElementById("smooth-scroll-container");
let smoothTargetY = 0;
let smoothCurrentY = 0;
let smoothRafId = null;

function updateShopScrollbarWidth() {
    if (!smoothScrollEl) return;

    const scrollbarWidth = Math.max(smoothScrollEl.offsetWidth - smoothScrollEl.clientWidth, 0);
    document.documentElement.style.setProperty("--shop-scrollbar-width", `${scrollbarWidth}px`);
}

function smoothScrollTo(y) {
    if (!smoothScrollEl) return;
    const maxY = smoothScrollEl.scrollHeight - smoothScrollEl.clientHeight;
    smoothTargetY = Math.max(0, Math.min(y, maxY));
    if (!smoothRafId) smoothRafId = requestAnimationFrame(smoothScrollTick);
}

function smoothScrollTick() {
    const dist = smoothTargetY - smoothCurrentY;
    if (Math.abs(dist) < 0.1) {
        smoothCurrentY = smoothTargetY;
        smoothRafId = null;
    } else {
        smoothCurrentY += dist * 0.12;
        smoothRafId = requestAnimationFrame(smoothScrollTick);
    }
    if (smoothScrollEl) smoothScrollEl.scrollTop = smoothCurrentY;
}

function getShopProductInfoLine() {
    return window.innerHeight * (0.26 + 0.2389);
}

function getShopProductTop() {
    if (!shopProductSection) return 0;
    return shopProductSection.getBoundingClientRect().top + smoothCurrentY;
}

function getShopProductSnapTarget(index) {
    if (!shopProductCards.length) return null;

    const productTop = getShopProductTop();
    const cardHeight = shopProductCards[0]?.offsetHeight || 1;
    return productTop + (cardHeight * index);
}

function getShopProductSnapIndex() {
    if (!shopProductCards.length) return 0;
    return clamp(shopActiveProductIndex >= 0 ? shopActiveProductIndex : 0, 0, shopProductCards.length - 1);
}

function snapToShopProductCard(index) {
    setShopProductIndex(index);
}

function isWheelInsideShopProductImageArea(event) {
    if (!shopProductScroll || !event) return false;

    const imageAreaRect = shopProductScroll.getBoundingClientRect();
    return event.clientX >= imageAreaRect.left &&
        event.clientX <= imageAreaRect.right &&
        event.clientY >= imageAreaRect.top &&
        event.clientY <= imageAreaRect.bottom;
}

function handleShopProductWheel(deltaY, event) {
    if (!shopProductSection || !shopProductCards.length) return false;
    if (!isWheelInsideShopProductImageArea(event)) {
        shopProductWheelDelta = 0;
        shopProductAutoSyncEnabled = false;
        return false;
    }

    const productRect = shopProductSection.getBoundingClientRect();
    const headerHeight = shopTopbarMain?.offsetHeight || 70;
    const isInProductArea = productRect.top <= getShopProductInfoLine() && productRect.bottom > headerHeight;
    if (!isInProductArea) {
        shopProductWheelDelta = 0;
        shopProductAutoSyncEnabled = false;
        return false;
    }

    shopProductAutoSyncEnabled = true;

    const now = performance.now();
    if (now < shopProductWheelLockedUntil) return true;

    shopProductWheelDelta += deltaY;
    if (Math.abs(shopProductWheelDelta) < shopProductWheelThreshold) return true;

    const currentIndex = getShopProductSnapIndex();
    const nextIndex = clamp(currentIndex + (shopProductWheelDelta > 0 ? 1 : -1), 0, shopProductCards.length - 1);
    shopProductWheelDelta = 0;
    if (nextIndex === currentIndex) return false;

    shopManualProductId = null;
    shopProductWheelLockedUntil = now + shopProductWheelDelay;
    snapToShopProductCard(nextIndex);
    return true;
}

smoothScrollEl?.addEventListener("wheel", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (!isWheelInsideShopProductImageArea(event)) {
        shopProductAutoSyncEnabled = false;
    }
    if (event.deltaY > 0 && !hasSkippedHeroOnScroll) {
        skipHeroOnFirstScroll(event, event.deltaY);
        if (hasSkippedHeroOnScroll) return;
    }
    if (handleShopProductWheel(event.deltaY, event)) return;
    const maxY = smoothScrollEl.scrollHeight - smoothScrollEl.clientHeight;
    smoothTargetY = Math.max(0, Math.min(smoothTargetY + event.deltaY, maxY));
    if (!smoothRafId) smoothRafId = requestAnimationFrame(smoothScrollTick);
}, { passive: false });

let shopTargetProgress = 0;
let shopRenderedProgress = 0;
let shopAnimationFrame = null;
let shopActiveProductIndex = -1;
let shopManualProductId = null;
let hasSkippedHeroOnScroll = false;
let shopHeroTouchStartY = 0;
let heroSkipScrollAmount = 0;
const heroSkipThreshold = 120;
let shopProductWheelDelta = 0;
let shopProductWheelLockedUntil = 0;
let shopProductAutoSyncEnabled = false;
const shopProductWheelThreshold = 90;
const shopProductWheelDelay = 420;

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
    return Object.values(shopProductCatalog)
        .flat()
        .find((product) => product.id === productId) || shopBestProductDetails[productId];
}

function formatShopPrice(product) {
    if (!product.price) return "판매처 알아보기";
    return `<strong>₩</strong> ${product.price}`;
}
function updateShopCategoryState(category) {
    shopCategoryButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.shopCategory === category);
    });
}

function updateShopCategoryProgress(product) {
    if (!shopProductCategoryProgress || !product) return;

    const categoryProducts = shopProductCatalog[product.category] || [];
    const productIndex = Math.max(categoryProducts.findIndex((item) => item.id === product.id), 0);
    shopProductCategoryProgress.textContent = `${formatShopCount(productIndex + 1)} / ${formatShopCount(categoryProducts.length)}`;
}

function updateShopBestCardState(productId) {
    shopBestCards.forEach((card) => {
        const isSelected = card.dataset.shopProductCard === productId;
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
    });
}

function updateShopProductImageState(index) {
    shopProductCards.forEach((card, cardIndex) => {
        card.classList.toggle("is-active", cardIndex === index);
    });

    shopProductScroll?.querySelectorAll(".shop-product__pagination-dot").forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

function setShopProductIndex(index) {
    if (!shopProductCards.length) return;

    const nextIndex = clamp(index, 0, shopProductCards.length - 1);
    if (nextIndex === shopActiveProductIndex) return;

    shopActiveProductIndex = nextIndex;
    updateShopProductImageState(nextIndex);
    renderShopProductDetails(nextIndex);
}

function renderShopProductPagination(products) {
    if (!products.length) return "";

    const dots = products.map((product, index) => {
        const isActive = index === 0;
        return `
            <button class="shop-product__pagination-dot${isActive ? " is-active" : ""}" type="button" data-shop-product-page="${index}" aria-label="Show ${product.name}" aria-current="${isActive ? "true" : "false"}"></button>
        `;
    }).join("");

    return `<div class="shop-product__pagination" aria-label="Product image pagination">${dots}</div>`;
}

function renderShopProductImages(products) {
    if (!shopProductScroll) return;

    const imageCards = products.map((product) => {
        const imageClasses = [
            "shop-product__image",
            product.imageSizeClass,
            product.imageClass,
        ].filter(Boolean).join(" ");

        return `
            <figure class="shop-product__image-card" data-shop-product-id="${product.id}">
                <img class="${imageClasses}" src="${product.imageSrc}" alt="${product.imageAlt}" />
            </figure>
        `;
    }).join("");

    shopProductScroll.innerHTML = imageCards + renderShopProductPagination(products);

    shopProductCards = Array.from(shopProductScroll.querySelectorAll(".shop-product__image-card"));
    shopProductScroll.querySelectorAll(".shop-product__pagination-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = Number(dot.dataset.shopProductPage);
            if (!Number.isNaN(index)) setShopProductIndex(index);
        });
    });
    shopActiveProductIndex = -1;
    updateShopProductImageState(0);
}

function setShopProductCategory(category) {
    const products = getShopCategoryProducts(category);
    if (!products.length) return false;

    shopActiveCategory = category;
    shopProductDetails = products;
    shopProductWheelDelta = 0;
    renderShopProductImages(shopProductDetails);
    return true;
}

function renderShopProductColors(product) {
    if (!shopProductColorList) return;

    const colorClasses = product.colorClasses || [
        ...shopProductColorClasses.slice(0, Math.max(product.colorCount - 1, 0)),
        "shop-product__color--selected",
    ];

    const colorNodes = colorClasses.map((colorClass, index) => {
        const isSelected = index === colorClasses.length - 1;
        return `<button class="shop-product__color ${colorClass}" type="button" aria-label="Color ${index + 1}" aria-pressed="${isSelected}"></button>`;
    });
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
    if (!product || !shopProductName || !shopProductDescription) return;

    shopProductSection?.classList.add("is-changing");

    window.setTimeout(() => {
        shopProductName.textContent = product.name;
        shopProductDescription.textContent = product.description;
        if (shopProductCategoryTitle) shopProductCategoryTitle.textContent = product.categoryLabel || "SPEAKER";
        updateShopCategoryProgress(product);
        renderShopProductColors(product);
        updateShopCategoryState(product.category);
        updateShopBestCardState(product.id);

        const weightRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Weight");
        const outputRow = shopProductSpecRows.find((row) => {
            const label = row.querySelector("dt")?.textContent.trim();
            return label === "Output" || label === "Battery Life";
        });
        const priceRow = shopProductSpecRows.find((row) => row.querySelector("dt")?.textContent.trim() === "Price");

        if (weightRow) weightRow.querySelector("dd").textContent = product.weight;
        if (outputRow) {
            outputRow.querySelector("dt").textContent = product.outputLabel || "Output";
            outputRow.querySelector("dd").textContent = product.output;
        }
        if (priceRow) priceRow.querySelector("dd").innerHTML = formatShopPrice(product);

        requestAnimationFrame(() => {
            shopProductSection?.classList.remove("is-changing");
        });
    }, 90);
}

function updateShopProductDetails() {
    if (!shopProductCards.length || !shopProductName || !shopProductDescription) return;
    if (!shopProductAutoSyncEnabled && !shopManualProductId) return;

    if (shopManualProductId) {
        renderShopProductDetails(getProductById(shopManualProductId));
    }
}

function scrollToShopProduct(productId) {
    const index = shopProductDetails.findIndex((product) => product.id === productId);
    if (index >= 0) {
        snapToShopProductCard(index);
        return;
    }
    if (!shopProductSection || !smoothScrollEl) return;
    smoothScrollTo(getShopProductTop());
}

function scrollToShopBest() {
    if (!shopBestSection || !smoothScrollEl) return;

    const shopBestTop = shopBestSection.getBoundingClientRect().top + smoothCurrentY;
    const targetTop = Math.max(shopBestTop, 0);
    hasSkippedHeroOnScroll = true;
    smoothScrollTo(targetTop);
}

function skipHeroOnFirstScroll(event, scrollAmount = heroSkipThreshold) {
    if (hasSkippedHeroOnScroll || !shopHeroStage || !shopBestSection) return;
    if (smoothCurrentY > 2) return;

    event?.preventDefault?.();
    heroSkipScrollAmount += Math.abs(scrollAmount);
    if (heroSkipScrollAmount < heroSkipThreshold) return;

    scrollToShopBest();
}

function initializeShopInteractions() {
    shopCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.shopCategory;
            const productId = shopCategoryDefaultProduct[category] || "acton-iii";
            const hasCategoryProducts = setShopProductCategory(category);
            const product = shopProductDetails.find((item) => item.id === productId) || shopProductDetails[0];
            if (!product) return;

            shopManualProductId = null;
            if (hasCategoryProducts) {
                scrollToShopProduct(product.id);
            }
        });
    });

    shopBestCards.forEach((card) => {
        const productId = card.dataset.shopProductCard;

        card.addEventListener("click", () => {
            const product = getProductById(productId);
            if (product?.category) setShopProductCategory(product.category);
            shopManualProductId = shopProductDetails.some((item) => item.id === productId) ? null : productId;
            scrollToShopProduct(productId);
            if (shopManualProductId) renderShopProductDetails(product);
        });
        card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            const product = getProductById(productId);
            if (product?.category) setShopProductCategory(product.category);
            shopManualProductId = shopProductDetails.some((item) => item.id === productId) ? null : productId;
            scrollToShopProduct(productId);
            if (shopManualProductId) renderShopProductDetails(product);
        });
    });

    productCardSwatches.forEach((swatch) => {
        swatch.addEventListener("click", (event) => {
            event.stopPropagation();
            const swatchList = swatch.closest(".product-card__swatches");
            swatchList?.querySelectorAll(".product-card__swatch").forEach((colorSwatch) => {
                colorSwatch.setAttribute("aria-pressed", "false");
            });
            swatch.setAttribute("aria-pressed", "true");
        });

        swatch.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            event.stopPropagation();
            swatch.click();
        });
    });

    smoothScrollEl?.addEventListener("scroll", () => {
        if (!shopManualProductId || !shopProductSection) return;
        const sectionRect = shopProductSection.getBoundingClientRect();
        if (sectionRect.top < window.innerHeight * 0.2 && sectionRect.bottom > window.innerHeight * 0.5) return;
        shopManualProductId = null;
    }, { passive: true });

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
    const scrollDistance = Math.max(shopHeroStage.offsetHeight - shopHero.offsetHeight, window.innerHeight * 0.45, 1);
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

function updateShopProductScrollMask() {
    if (!shopProductSection) return;

    const productRect = shopProductSection.getBoundingClientRect();
    const infoLine = getShopProductInfoLine();
    const footerRect = shopFooter?.getBoundingClientRect();
    const isFooterInMaskArea = footerRect ? footerRect.top < infoLine : false;
    const isActive = productRect.top <= 0 && productRect.bottom > infoLine && !isFooterInMaskArea;
    shopProductSection.classList.toggle("is-scroll-mask-active", isActive);
}

function updateShopProductCategoryRelease() {
    if (!shopProductSection || !shopFooter) return;

    const footerRect = shopFooter.getBoundingClientRect();
    const footerOverlap = Math.max(0, window.innerHeight - footerRect.top);
    shopProductSection.style.setProperty("--shop-footer-overlap", `${footerOverlap}px`);
}

function updateShopScrollEffects() {
    if (smoothCurrentY <= 2) {
        hasSkippedHeroOnScroll = false;
        heroSkipScrollAmount = 0;
    }

    updateShopScrollbarWidth();
    updateShopHeroTransition();
    updateShopProductDetails();
    updateShopProductScrollMask();
    updateShopProductCategoryRelease();
}

renderShopHeroPanels(0);
renderShopProductImages(shopProductDetails);
renderShopProductDetails(0);
initializeShopInteractions();
smoothScrollEl?.addEventListener("touchstart", (event) => {
    shopHeroTouchStartY = event.touches[0]?.clientY || 0;
}, { passive: true });
smoothScrollEl?.addEventListener("touchmove", (event) => {
    const touchY = event.touches[0]?.clientY || 0;
    const touchDelta = shopHeroTouchStartY - touchY;
    if (touchDelta > 8) skipHeroOnFirstScroll(event, touchDelta);
}, { passive: false });
window.addEventListener("keydown", (event) => {
    const scrollDownKeys = [" ", "PageDown", "ArrowDown"];
    if (scrollDownKeys.includes(event.key)) skipHeroOnFirstScroll(event);
});
smoothScrollEl?.addEventListener("scroll", updateShopScrollEffects, { passive: true });
window.addEventListener("resize", updateShopScrollEffects);
updateShopScrollbarWidth();
updateShopScrollEffects();
