const aboutHeroStage = document.querySelector("[data-about-hero-stage]");
const aboutHeroSticky = document.querySelector(".about-hero__sticky");
const aboutHeroPanels = document.querySelectorAll(".about-hero__panel");
const aboutHeroCopy = document.querySelector(".about-hero__copy");

const aboutPanelTimings = [
    [0, 0.56],
    [0.08, 0.66],
    [0.24, 0.82],
    [0.4, 0.96],
];

let aboutTargetProgress = 0;
let aboutRenderedProgress = 0;
let aboutAnimationFrame = null;

function aboutClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function aboutSequenceProgress(progress, start, end) {
    return aboutClamp((progress - start) / (end - start), 0, 1);
}

function aboutEaseSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

function renderAboutHeroPanels(progress) {
    aboutHeroPanels.forEach((panel, index) => {
        const [start, end] = aboutPanelTimings[index];
        const panelProgress = aboutEaseSmooth(aboutSequenceProgress(progress, start, end));
        panel.style.setProperty("--about-panel-y", `${-panelProgress * 100}%`);
    });

    const [contentStart, contentEnd] = aboutPanelTimings[0];
    const contentProgress = aboutEaseSmooth(aboutSequenceProgress(progress, contentStart, contentEnd));
    aboutHeroCopy?.style.setProperty("--about-content-y", `${-contentProgress * 100}%`);
}

function updateAboutHeroTransition() {
    if (!aboutHeroStage || !aboutHeroSticky || !aboutHeroPanels.length) return;

    const stageRect = aboutHeroStage.getBoundingClientRect();
    const scrollDistance = Math.max(aboutHeroStage.offsetHeight - aboutHeroSticky.offsetHeight, window.innerHeight * 0.45, 1);
    aboutTargetProgress = aboutClamp(-stageRect.top / scrollDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (aboutAnimationFrame) cancelAnimationFrame(aboutAnimationFrame);
        aboutAnimationFrame = null;
        aboutHeroPanels.forEach((panel) => panel.style.removeProperty("--about-panel-y"));
        aboutHeroCopy?.style.removeProperty("--about-content-y");
        return;
    }

    if (aboutAnimationFrame) return;

    function renderTransition() {
        const distance = aboutTargetProgress - aboutRenderedProgress;
        aboutRenderedProgress += distance * 0.085;

        if (Math.abs(distance) < 0.0001) {
            aboutRenderedProgress = aboutTargetProgress;
        }

        renderAboutHeroPanels(aboutRenderedProgress);

        if (aboutRenderedProgress !== aboutTargetProgress) {
            aboutAnimationFrame = requestAnimationFrame(renderTransition);
        } else {
            aboutAnimationFrame = null;
        }
    }

    aboutAnimationFrame = requestAnimationFrame(renderTransition);
}

renderAboutHeroPanels(0);
window.addEventListener("scroll", updateAboutHeroTransition, { passive: true });
window.addEventListener("resize", updateAboutHeroTransition);
updateAboutHeroTransition();

const aboutHistory = document.querySelector("[data-about-history]");
const aboutHistorySticky = document.querySelector(".about-history__sticky");
const aboutHistoryImage = document.querySelector("[data-about-history-image]");
const aboutHistoryYear = document.querySelector("[data-about-history-year]");
const aboutHistoryTitle = document.querySelector("[data-about-history-title]");
const aboutHistoryDescription = document.querySelector("[data-about-history-description]");
const aboutHistoryDots = document.querySelectorAll(".about-history__nav li");

const aboutHistorySlides = [
    {
        year: "1962",
        title: "마샬의 처음",
        description: "Jim Marshall, 런던 사우스올에 악기점 오픈 및 첫 앰프 제작.",
        image: "./assets/images/about-history-1962.avif",
        alt: "Jim Marshall의 1962년 역사를 소개하는 잡지 페이지",
        position: "center center",
    },
    {
        year: "1965",
        title: "스택 엠프 시대",
        description: "마샬 스택이 세계 무대를 장악. Jimi Hendrix, The Who, Led Zeppelin이 마샬을 선택.",
        image: "./assets/images/about-history-1965.avif",
        alt: "무대 뒤에 쌓인 Marshall 스택 앰프",
        position: "center center",
    },
    {
        year: "1990",
        title: "글로벌 확장",
        description: "전 세계 80개국 유통망 구축. 록의 상징에서 글로벌 음향 브랜드로 성장.",
        image: "./assets/images/about-history-1990.avif",
        alt: "Marshall 헤드폰을 착용한 인물",
        position: "center center",
    },
    {
        year: "2010",
        title: "라이프스타일 브랜드로",
        description: "마샬 헤드폰 및 포터블 스피커 첫 출시. 음악을 일상으로 가져오다.",
        image: "./assets/images/about-history-2010.avif",
        alt: "기타와 Marshall 앰프",
        position: "center bottom",
    },
    {
        year: "현재",
        title: "마샬 코리아",
        description: "한국 공식 유통 파트너를 통해 전 제품 라인업 정식 서비스 제공.",
        image: "./assets/images/about_now_marshallkr.avif",
        alt: "Marshall의 초기 음악 역사를 보여주는 흑백 사진",
        position: "center bottom",
    },
];

let aboutHistoryIndex = 0;
let aboutHistorySwitchTimer = null;
let aboutHistoryEnterTimer = null;

function renderAboutHistoryYear(year, animate = true) {
    if (!aboutHistoryYear) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNumericYear = /^\d+$/.test(year);

    if (!isNumericYear || !animate || reducedMotion) {
        aboutHistoryYear.setAttribute("aria-label", year);

        if (!isNumericYear && animate && !reducedMotion) {
            const yearText = document.createElement("span");
            yearText.className = "about-history__year-text";
            yearText.textContent = year;
            aboutHistoryYear.replaceChildren(yearText);
        } else {
            aboutHistoryYear.textContent = year;
        }

        return;
    }

    const fragment = document.createDocumentFragment();
    aboutHistoryYear.setAttribute("aria-label", year);

    year.split("").forEach((digit) => {
        const slot = document.createElement("span");
        const strip = document.createElement("span");
        const targetDigit = Number(digit);

        slot.className = "about-history__year-slot";
        slot.setAttribute("aria-hidden", "true");
        strip.className = "about-history__year-strip";

        for (let number = 0; number < 20; number += 1) {
            const value = document.createElement("span");
            value.textContent = String(number % 10);
            strip.append(value);
        }

        strip.style.transform = "translateY(0)";
        slot.append(strip);
        fragment.append(slot);

        requestAnimationFrame(() => {
            const digitHeight = strip.querySelector("span")?.offsetHeight ?? 0;
            strip.style.transition = "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)";
            strip.style.transform = `translateY(${-targetDigit * digitHeight}px)`;
        });
    });

    aboutHistoryYear.replaceChildren(fragment);
}

function setAboutHistoryDot(index) {
    aboutHistoryDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);

        if (isActive) {
            dot.setAttribute("aria-current", "step");
        } else {
            dot.removeAttribute("aria-current");
        }
    });
}

function renderAboutHistorySlide(index, animate = true) {
    if (!aboutHistory || !aboutHistoryImage || !aboutHistoryTitle || !aboutHistoryDescription) return;
    if (index === aboutHistoryIndex && animate) return;

    const slide = aboutHistorySlides[index];
    clearTimeout(aboutHistorySwitchTimer);
    clearTimeout(aboutHistoryEnterTimer);
    setAboutHistoryDot(index);

    const updateContent = () => {
        if (aboutHistoryYear) {
            aboutHistoryYear.classList.toggle("is-current-label", index === aboutHistorySlides.length - 1);
            renderAboutHistoryYear(slide.year, animate);
        }
        aboutHistoryTitle.textContent = slide.title;
        aboutHistoryDescription.textContent = slide.description;
        aboutHistoryImage.src = slide.image;
        aboutHistoryImage.alt = slide.alt;
        aboutHistoryImage.style.objectPosition = slide.position;
        aboutHistory.classList.remove("is-switching");
        aboutHistory.classList.add("is-entering");
        aboutHistoryEnterTimer = window.setTimeout(() => {
            aboutHistory.classList.remove("is-entering");
        }, 430);
    };

    aboutHistoryIndex = index;

    if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        aboutHistory.classList.add("is-switching");
        aboutHistorySwitchTimer = window.setTimeout(updateContent, 160);
    } else {
        aboutHistory.classList.remove("is-switching", "is-entering");
        updateContent();
    }
}

function updateAboutHistoryInteraction() {
    if (!aboutHistory || !aboutHistorySlides.length) return;

    if (window.matchMedia("(max-width: 64em)").matches) {
        aboutHistory.classList.remove("is-pinned", "is-ended");
        renderAboutHistorySlide(0, false);
        return;
    }

    const rect = aboutHistory.getBoundingClientRect();
    const pinHeight = aboutHistorySticky?.offsetHeight || window.innerHeight;
    const scrollDistance = Math.max(aboutHistory.offsetHeight - pinHeight, 1);
    const progress = aboutClamp(-rect.top / scrollDistance, 0, 1);
    const nextIndex = Math.min(aboutHistorySlides.length - 1, Math.floor(progress * aboutHistorySlides.length));
    const isPinned = rect.top <= 0 && rect.bottom >= pinHeight;
    const isEnded = rect.bottom < pinHeight;

    aboutHistory.classList.toggle("is-pinned", isPinned);
    aboutHistory.classList.toggle("is-ended", isEnded);
    renderAboutHistorySlide(nextIndex);
}

aboutHistorySlides.forEach((slide) => {
    const image = new Image();
    image.src = slide.image;
});

renderAboutHistorySlide(0, false);
window.addEventListener("scroll", updateAboutHistoryInteraction, { passive: true });
window.addEventListener("resize", updateAboutHistoryInteraction);
updateAboutHistoryInteraction();
