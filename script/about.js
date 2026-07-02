const aboutHeroStage = document.querySelector("[data-about-hero-stage]");
const aboutHeroSticky = document.querySelector(".about-hero__sticky");
const aboutHeroMediaGrid = document.querySelector(".about-hero__media-grid");
const aboutHeroDissolveGrid = document.querySelector(".about-hero__dissolve-grid");
const aboutHeroDissolvePanels = document.querySelectorAll(".about-hero__dissolve-panel");
const aboutHeroPanels = document.querySelectorAll(".about-hero__panel");
const aboutHeroCopy = document.querySelector(".about-hero__copy");
const aboutHeroTextFlow = document.querySelector(".about-hero__text-flow");
const aboutHeroTextFlowInner = document.querySelector(".about-hero__text-flow-inner");
const aboutHeroCopyTrack = document.querySelector(".about-hero__copy-track");
const aboutHistoryStage = document.querySelector("[data-about-history]");
const aboutTopbar = document.querySelector(".shop-topbar");
const aboutTopbarMenu = document.querySelector(".shop-topbar__menu");
const aboutTopbarNav = document.querySelector(".shop-topbar__nav");
const aboutDesignStoryText = document.querySelector("[data-about-design-story-text]");

const aboutPanelTimings = [
    [0, 0.42],
    [0.22, 0.64],
    [0.44, 0.86],
    [0.66, 1],
];

let aboutTargetProgress = 0;
let aboutRenderedProgress = 0;
let aboutTargetExitProgress = 0;
let aboutRenderedExitProgress = 0;
let aboutAnimationFrame = null;
let aboutHeroLightsAnimating = false;
let aboutHeroLightsOn = false;
let aboutHeroLightsStartTimer = null;
let aboutHeroLightsCompleteTimer = null;
let aboutHeroCopyRevealTimer = null;
let aboutHeroDissolveOn = false;
let aboutHeroTouchStartY = 0;

function aboutClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function aboutSequenceProgress(progress, start, end) {
    return aboutClamp((progress - start) / (end - start), 0, 1);
}

function aboutEaseSmooth(progress) {
    return progress * progress * (3 - 2 * progress);
}

if (aboutTopbar && aboutTopbarMenu && aboutTopbarNav) {
    const setAboutMenuOpen = (isOpen) => {
        aboutTopbar.classList.toggle("is-menu-open", isOpen);
        aboutTopbarMenu.setAttribute("aria-expanded", String(isOpen));
        aboutTopbarMenu.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    aboutTopbarMenu.addEventListener("click", (event) => {
        event.stopPropagation();
        setAboutMenuOpen(!aboutTopbar.classList.contains("is-menu-open"));
    });

    aboutTopbarNav.addEventListener("click", (event) => {
        if (event.target.closest("a")) setAboutMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
        if (!aboutTopbar.classList.contains("is-menu-open")) return;
        if (aboutTopbar.contains(event.target)) return;
        setAboutMenuOpen(false);
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setAboutMenuOpen(false);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 640) setAboutMenuOpen(false);
    });
}

function triggerAboutHeroLightsOn() {
    if (aboutHeroLightsAnimating || aboutHeroLightsOn) return;
    aboutHeroLightsAnimating = true;
    aboutHeroLightsStartTimer = setTimeout(() => {
        aboutHeroMediaGrid?.style.setProperty("--about-hero-dark-opacity", "0");
        aboutHeroCopyRevealTimer = setTimeout(() => {
            aboutHeroCopy?.style.setProperty("--about-hero-copy-opacity", "1");
        }, 350);
        aboutHeroLightsCompleteTimer = setTimeout(() => {
            aboutHeroLightsOn = true;
            aboutHeroLightsAnimating = false;
        }, 1050);
    }, 500);
}

function triggerAboutHeroLightsOff() {
    if (aboutHeroLightsStartTimer) clearTimeout(aboutHeroLightsStartTimer);
    if (aboutHeroLightsCompleteTimer) clearTimeout(aboutHeroLightsCompleteTimer);
    if (aboutHeroCopyRevealTimer) clearTimeout(aboutHeroCopyRevealTimer);
    aboutHeroLightsStartTimer = null;
    aboutHeroLightsCompleteTimer = null;
    aboutHeroCopyRevealTimer = null;
    aboutHeroLightsAnimating = false;
    aboutHeroLightsOn = false;
    aboutHeroDissolveOn = false;
    aboutHeroMediaGrid?.style.setProperty("--about-hero-dark-opacity", "0.8");
    aboutHeroMediaGrid?.style.setProperty("--about-hero-base-image-opacity", "1");
    aboutHeroDissolveGrid?.style.setProperty("--about-hero-dissolve-opacity", "0");
    aboutHeroDissolvePanels.forEach((panel) => panel.style.setProperty("--about-dissolve-panel-y", "0%"));
    aboutTargetExitProgress = 0;
    aboutRenderedExitProgress = 0;
    aboutHeroCopy?.style.setProperty("--about-content-y", "0%");
    aboutHeroCopy?.style.setProperty("--about-hero-copy-opacity", "0");
    aboutHeroTextFlow?.style.setProperty("--about-hero-text-opacity", "0");
    if (aboutHeroTextFlowInner) aboutHeroTextFlowInner.style.transform = "translate3d(0, 0, 0)";
}

function renderAboutHeroPanels(progress) {
    aboutHeroPanels.forEach((panel) => {
        panel.style.setProperty("--about-panel-y", "0%");
    });

    const stageRect = aboutHeroStage?.getBoundingClientRect();
    const heroScroll = stageRect ? Math.max(-stageRect.top, 0) : 0;
    const viewportHeight = window.innerHeight;

    const copyProgress = aboutEaseSmooth(aboutSequenceProgress(heroScroll, viewportHeight * 0.02, viewportHeight * 0.38));
    const dissolveProgress = aboutEaseSmooth(aboutSequenceProgress(heroScroll, viewportHeight * 0.12, viewportHeight * 0.42));
    const textOpacity = aboutEaseSmooth(aboutSequenceProgress(heroScroll, viewportHeight * 0.28, viewportHeight * 0.42));
    const textProgress = aboutEaseSmooth(aboutSequenceProgress(heroScroll, viewportHeight * 0.28, viewportHeight * 2.5));

    aboutHeroDissolveOn = dissolveProgress > 0.01 || textOpacity > 0.01;
    aboutHeroCopy?.style.setProperty("--about-content-y", `${-copyProgress * 100}%`);
    aboutHeroDissolveGrid?.style.setProperty("--about-hero-dissolve-opacity", `${dissolveProgress}`);
    aboutHeroMediaGrid?.style.setProperty("--about-hero-base-image-opacity", "1");

    const trackEnd = aboutHeroCopyTrack
        ? -(aboutHeroCopyTrack.offsetTop + aboutHeroCopyTrack.offsetHeight + viewportHeight * 0.16)
        : 0;
    const textOffset = textProgress * trackEnd;
    aboutHeroTextFlow?.style.setProperty("--about-hero-text-opacity", `${textOpacity}`);
    if (aboutHeroTextFlowInner) {
        aboutHeroTextFlowInner.style.transform = `translate3d(0, ${textOffset}px, 0)`;
    }

    const storyTextBottom = aboutDesignStoryText?.getBoundingClientRect().bottom ?? viewportHeight;
    aboutTargetExitProgress = aboutClamp((viewportHeight * 0.55 - storyTextBottom) / (viewportHeight * 1.8), 0, 1);
    aboutRenderedExitProgress += (aboutTargetExitProgress - aboutRenderedExitProgress) * 0.075;
    if (Math.abs(aboutTargetExitProgress - aboutRenderedExitProgress) < 0.0005) {
        aboutRenderedExitProgress = aboutTargetExitProgress;
    }

    const exitProgress = aboutRenderedExitProgress;
    aboutHeroMediaGrid?.style.setProperty("--about-hero-media-opacity", aboutTargetExitProgress > 0 ? "0" : "1");
    aboutHeroDissolvePanels.forEach((panel, index) => {
        const [start, end] = aboutPanelTimings[index] || [0, 1];
        const panelProgress = aboutEaseSmooth(aboutSequenceProgress(exitProgress, start, end));
        panel.style.setProperty("--about-dissolve-panel-y", `${-panelProgress * 100}%`);
    });
}

function updateAboutHeroTransition() {
    if (!aboutHeroStage || !aboutHeroSticky || !aboutHeroPanels.length) return;

    const stageRect = aboutHeroStage.getBoundingClientRect();
    const scrollDistance = Math.max(aboutHeroStage.offsetHeight - aboutHeroSticky.offsetHeight, window.innerHeight * 0.45, 1);
    aboutTargetProgress = aboutClamp(-stageRect.top / scrollDistance, 0, 1);
    const isHeroPinned = stageRect.top <= 0 && stageRect.bottom > aboutHeroSticky.offsetHeight;
    const isHeroEnded = stageRect.bottom <= aboutHeroSticky.offsetHeight;

    aboutHeroStage.classList.toggle("is-pinned", isHeroPinned);
    aboutHeroStage.classList.toggle("is-ended", isHeroEnded);
    aboutHeroMediaGrid?.style.setProperty("--about-hero-dark-opacity", aboutHeroLightsOn || aboutHeroLightsAnimating || stageRect.top < -4 ? "0" : "0.8");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (aboutAnimationFrame) cancelAnimationFrame(aboutAnimationFrame);
        aboutAnimationFrame = null;
        aboutHeroPanels.forEach((panel) => panel.style.removeProperty("--about-panel-y"));
        aboutHeroCopy?.style.removeProperty("--about-content-y");
        aboutHeroMediaGrid?.style.removeProperty("--about-hero-media-opacity");
        aboutHeroMediaGrid?.style.removeProperty("--about-hero-dark-opacity");
        aboutHeroDissolveGrid?.style.removeProperty("--about-hero-dissolve-opacity");
        aboutHeroDissolvePanels.forEach((panel) => panel.style.removeProperty("--about-dissolve-panel-y"));
        aboutHeroTextFlow?.style.removeProperty("--about-hero-text-opacity");
        if (aboutHeroTextFlowInner) aboutHeroTextFlowInner.style.removeProperty("transform");
        aboutTargetExitProgress = 0;
        aboutRenderedExitProgress = 0;
        return;
    }

    if (aboutAnimationFrame) return;

    function renderTransition() {
        const distance = aboutTargetProgress - aboutRenderedProgress;
        aboutRenderedProgress += distance * 0.08;

        if (Math.abs(distance) < 0.0001) {
            aboutRenderedProgress = aboutTargetProgress;
        }

        renderAboutHeroPanels(aboutRenderedProgress);

        if (aboutRenderedProgress !== aboutTargetProgress || aboutRenderedExitProgress !== aboutTargetExitProgress) {
            aboutAnimationFrame = requestAnimationFrame(renderTransition);
        } else {
            aboutAnimationFrame = null;
        }
    }

    aboutAnimationFrame = requestAnimationFrame(renderTransition);
}

function revealAboutHeroOnFirstScroll(event) {
    if (!aboutHeroStage) return false;

    const heroRect = aboutHeroStage.getBoundingClientRect();
    if (heroRect.top < -10 || heroRect.bottom <= 0) return false;

    if (aboutHeroLightsOn && !aboutHeroDissolveOn) {
        return false;
    }

    if (aboutHeroLightsOn) return false;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (aboutHeroLightsAnimating) return true;

    triggerAboutHeroLightsOn();
    return true;
}

function dimAboutHeroOnReverseScroll() {
    if (!aboutHeroStage || (!aboutHeroLightsOn && !aboutHeroLightsAnimating)) return false;
    if (aboutHeroDissolveOn) return false;

    const heroRect = aboutHeroStage.getBoundingClientRect();
    if (heroRect.top >= window.innerHeight || heroRect.bottom <= 0) return false;

    triggerAboutHeroLightsOff();
    return true;
}

function autoRevealAboutHeroLights() {
    if (!aboutHeroStage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heroRect = aboutHeroStage.getBoundingClientRect();
    if (heroRect.top > 10 || heroRect.bottom <= 0) return;

    triggerAboutHeroLightsOn();
}

renderAboutHeroPanels(0);
window.addEventListener("wheel", (event) => {
    if (event.deltaY < 0) {
        dimAboutHeroOnReverseScroll();
        return;
    }

    if (event.deltaY === 0) return;
    revealAboutHeroOnFirstScroll(event);
}, { passive: false, capture: true });

window.addEventListener("touchstart", (event) => {
    aboutHeroTouchStartY = event.touches[0]?.clientY || 0;
}, { passive: true });

window.addEventListener("touchmove", (event) => {
    const touchY = event.touches[0]?.clientY || 0;
    const touchDelta = aboutHeroTouchStartY - touchY;
    if (touchDelta > 8) revealAboutHeroOnFirstScroll(event);
    if (touchDelta < -8) dimAboutHeroOnReverseScroll();
}, { passive: false, capture: true });

window.addEventListener("keydown", (event) => {
    const scrollDownKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
    const scrollUpKeys = ["ArrowUp", "PageUp"];
    if (scrollDownKeys.includes(event.key)) revealAboutHeroOnFirstScroll(event);
    if (scrollUpKeys.includes(event.key)) dimAboutHeroOnReverseScroll();
}, { capture: true });

window.addEventListener("scroll", updateAboutHeroTransition, { passive: true });
window.addEventListener("resize", updateAboutHeroTransition);
updateAboutHeroTransition();
window.setTimeout(autoRevealAboutHeroLights, 350);

const aboutHistory = document.querySelector("[data-about-history]");
const aboutHistorySticky = document.querySelector(".about-history__sticky");
const aboutHistoryImageFrame = document.querySelector(".about-history__image");
const aboutHistoryImage = document.querySelector("[data-about-history-image]");
const aboutHistoryYear = document.querySelector("[data-about-history-year]");
const aboutHistoryTitle = document.querySelector("[data-about-history-title]");
const aboutHistoryDescription = document.querySelector("[data-about-history-description]");
const aboutHistoryDots = document.querySelectorAll(".about-history__nav li");

const aboutHistorySlides = [
    {
        year: "1962",
        title: "마샬의 처음",
        description: "Jim Marshall은 런던 사우스올에 작은 악기점을 열고 뮤지션들의 목소리에 귀 기울였습니다. <br> 더 나은 사운드를 향한 열정으로 직접 첫 마샬 앰프를 제작하며, <br> 오늘날 전설의 시작을 만들어냈습니다.",
        image: "./assets/images/about-history-1962.avif",
        alt: "Jim Marshall의 1962년 역사를 소개하는 잡지 페이지",
        position: "center center",
    },
    {
        year: "1965",
        title: "무대를 장악한 스택 앰프",
        description: "마샬 스택 앰프는 압도적인 출력과 강렬한 사운드로 공연 문화를 바꾸었습니다. <br> Jimi Hendrix, The Who, Led Zeppelin 등 세계적인 록 아티스트들의 선택을 받으며<br> 록 음악의 상징으로 자리 잡았습니다.",
        image: "./assets/images/about-history-1965.avif",
        alt: "무대 뒤에 쌓인 Marshall 스택 앰프",
        position: "center center",
    },
    {
        year: "1990",
        title: "글로벌 오디오 브랜드로",
        description: "마샬은 80여 개국으로 유통망을 확대하며 전 세계 무대로 영역을 넓혔습니다. <br> 영국을 대표하는 앰프 브랜드를 넘어, 수많은 뮤지션과 음악 팬들에게 사랑받는 <br> 글로벌 오디오 브랜드로 성장했습니다.",
        image: "./assets/images/about-history-1990.avif",
        alt: "Marshall 헤드폰을 착용한 인물",
        position: "center center",
    },
    {
        year: "2010",
        title: "언제 어디서나 마샬 사운드",
        description: "헤드폰과 포터블 스피커를 출시하며 무대 위를 넘어 일상 속으로 브랜드를 확장했습니다. <br> 언제 어디서나 마샬 특유의 강렬한 사운드와 클래식한 디자인을 경험할 수 있는 <br> 라이프스타일 브랜드로 자리매김했습니다.",
        image: "./assets/images/about-history-2010.avif",
        alt: "기타와 Marshall 앰프",
        position: "center bottom",
    },
    {
        year: "Today",
        title: "마샬 코리아",
        description: "한국 공식 유통 파트너를 통해 다양한 제품 라인업과 공식 서비스를 제공하며 <br> 국내 시장을 확대해 나가고 있습니다. 변함없는 사운드 철학과 브랜드 가치를 바탕으로 <br> 더 많은 사람들에게 마샬의 경험을 전하고 있습니다.",
        image: "./assets/images/about_now_marshallkr.avif",
        alt: "Marshall의 초기 음악 역사를 보여주는 흑백 사진",
        position: "center bottom",
    },
];

let aboutHistoryIndex = 0;
let aboutHistorySwitchTimer = null;
let aboutHistoryEnterTimer = null;
let aboutHistoryPointerStartX = 0;
let aboutHistoryPointerStartY = 0;
let aboutHistoryPointerId = null;
const aboutHistoryIndexBuffer = 0.035;

function isAboutHistoryManualMode() {
    return window.matchMedia("(max-width: 64em)").matches;
}

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
        aboutHistoryDescription.innerHTML = slide.description;
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

    if (isAboutHistoryManualMode()) {
        aboutHistory.classList.remove("is-pinned", "is-ended");
        return;
    }

    const rect = aboutHistory.getBoundingClientRect();
    const pinHeight = aboutHistorySticky?.offsetHeight || window.innerHeight;
    const scrollDistance = Math.max(aboutHistory.offsetHeight - pinHeight, 1);
    const progress = aboutClamp(-rect.top / scrollDistance, 0, 1);
    const segmentProgress = 1 / aboutHistorySlides.length;
    let nextIndex = aboutHistoryIndex;
    if (progress >= 1) {
        nextIndex = aboutHistorySlides.length - 1;
    } else if (progress >= (aboutHistoryIndex + 1) * segmentProgress + aboutHistoryIndexBuffer) {
        nextIndex = Math.min(aboutHistoryIndex + 1, aboutHistorySlides.length - 1);
    } else if (progress < aboutHistoryIndex * segmentProgress - aboutHistoryIndexBuffer) {
        nextIndex = Math.max(aboutHistoryIndex - 1, 0);
    }
    const isPinned = rect.top <= 0 && rect.bottom >= pinHeight;
    const isEnded = rect.bottom < pinHeight;

    aboutHistory.classList.toggle("is-pinned", isPinned);
    aboutHistory.classList.toggle("is-ended", isEnded);
    renderAboutHistorySlide(nextIndex);
}

function shiftAboutHistorySlide(direction) {
    if (!isAboutHistoryManualMode()) return;

    const nextIndex = aboutClamp(aboutHistoryIndex + direction, 0, aboutHistorySlides.length - 1);
    aboutHistory?.style.setProperty("--about-history-image-exit-x", `${direction > 0 ? -36 : 36}px`);
    aboutHistory?.style.setProperty("--about-history-image-enter-x", `${direction > 0 ? 36 : -36}px`);
    renderAboutHistorySlide(nextIndex);
}

function initializeAboutHistoryMobileControls() {
    if (!aboutHistoryImageFrame || !aboutHistoryDots.length) return;

    aboutHistoryImageFrame.addEventListener("pointerdown", (event) => {
        if (!isAboutHistoryManualMode()) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        aboutHistoryPointerId = event.pointerId;
        aboutHistoryPointerStartX = event.clientX;
        aboutHistoryPointerStartY = event.clientY;
        aboutHistoryImageFrame.setPointerCapture?.(event.pointerId);
        aboutHistoryImageFrame.classList.add("is-dragging");
    });

    aboutHistoryImageFrame.addEventListener("pointerup", (event) => {
        if (aboutHistoryPointerId !== event.pointerId) return;

        const deltaX = event.clientX - aboutHistoryPointerStartX;
        const deltaY = event.clientY - aboutHistoryPointerStartY;
        aboutHistoryPointerId = null;
        aboutHistoryImageFrame.releasePointerCapture?.(event.pointerId);
        aboutHistoryImageFrame.classList.remove("is-dragging");

        if (!isAboutHistoryManualMode()) return;
        if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

        shiftAboutHistorySlide(deltaX < 0 ? 1 : -1);
    });

    aboutHistoryImageFrame.addEventListener("pointercancel", (event) => {
        if (aboutHistoryPointerId !== event.pointerId) return;

        aboutHistoryPointerId = null;
        aboutHistoryImageFrame.classList.remove("is-dragging");
    });

    aboutHistoryDots.forEach((dot, index) => {
        dot.setAttribute("role", "button");
        dot.setAttribute("tabindex", "0");

        dot.addEventListener("click", () => {
            if (!isAboutHistoryManualMode()) return;

            const direction = index >= aboutHistoryIndex ? 1 : -1;
            aboutHistory?.style.setProperty("--about-history-image-exit-x", `${direction > 0 ? -36 : 36}px`);
            aboutHistory?.style.setProperty("--about-history-image-enter-x", `${direction > 0 ? 36 : -36}px`);
            renderAboutHistorySlide(index);
        });

        dot.addEventListener("keydown", (event) => {
            if (!isAboutHistoryManualMode()) return;
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            const direction = index >= aboutHistoryIndex ? 1 : -1;
            aboutHistory?.style.setProperty("--about-history-image-exit-x", `${direction > 0 ? -36 : 36}px`);
            aboutHistory?.style.setProperty("--about-history-image-enter-x", `${direction > 0 ? 36 : -36}px`);
            renderAboutHistorySlide(index);
        });
    });
}

aboutHistorySlides.forEach((slide) => {
    const image = new Image();
    image.src = slide.image;
});

renderAboutHistorySlide(0, false);
initializeAboutHistoryMobileControls();
window.addEventListener("scroll", updateAboutHistoryInteraction, { passive: true });
window.addEventListener("resize", updateAboutHistoryInteraction);
updateAboutHistoryInteraction();

const aboutPhilosophy = document.querySelector(".about-philosophy");
const aboutStatNumbers = Array.from(document.querySelectorAll(".about-stat strong"));

function initializeAboutStatNumbers() {
    if (!aboutStatNumbers.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const playStatAnimations = [];

    aboutStatNumbers.forEach((stat, statIndex) => {
        const rawValue = stat.textContent.trim();

        stat.setAttribute("aria-label", rawValue);

        function renderStaticValue() {
            const fragment = document.createDocumentFragment();
            const numericValue = rawValue.match(/^\d+/)?.[0] || "";
            const suffixValue = rawValue.slice(numericValue.length);

            if (numericValue) {
                const value = document.createElement("span");
                value.className = "about-stat__value";
                value.textContent = numericValue;
                fragment.append(value);
            }

            if (suffixValue) {
                const suffix = document.createElement("span");
                suffix.className = "about-stat__suffix";
                suffix.textContent = suffixValue;
                fragment.append(suffix);
            }

            stat.replaceChildren(fragment);
        }

        function buildSlots() {
            const characters = rawValue.split("");
            const slots = [];
            const fragment = document.createDocumentFragment();

            characters.forEach((character, characterIndex) => {
                if (!/\d/.test(character)) {
                    const suffix = document.createElement("span");
                    suffix.className = "about-stat__suffix";
                    suffix.textContent = character;
                    suffix.setAttribute("aria-hidden", "true");
                    fragment.append(suffix);
                    return;
                }

                const slot = document.createElement("span");
                const strip = document.createElement("span");
                const targetDigit = Number(character);
                const startOffset = 12 + statIndex * 2 + characterIndex;

                slot.className = "about-stat__digit";
                slot.setAttribute("aria-hidden", "true");
                strip.className = "about-stat__digit-strip";

                for (let number = 0; number < 30; number += 1) {
                    const value = document.createElement("span");
                    value.textContent = String(number % 10);
                    strip.append(value);
                }

                slot.append(strip);
                fragment.append(slot);
                slots.push({ strip, targetDigit, startOffset, progress: startOffset });
            });

            stat.replaceChildren(fragment);
            return slots;
        }

        function renderSlots(slots) {
            slots.forEach((slot) => {
                const digitHeight = slot.strip.querySelector("span")?.offsetHeight ?? 0;
                if (!digitHeight) return;

                const digitIndex = slot.targetDigit + slot.progress;
                slot.strip.style.transform = `translateY(${-digitIndex * digitHeight}px)`;
            });
        }

        function finishSlots(slots) {
            slots.forEach((slot) => {
                slot.progress = 0;
            });
            renderSlots(slots);
            renderStaticValue();
        }

        function playSlots() {
            if (stat.dataset.aboutStatAnimating === "true") return;
            stat.dataset.aboutStatAnimating = "true";

            const slots = buildSlots();

            slots.forEach((slot) => {
                slot.progress = slot.startOffset;
            });
            renderSlots(slots);

            if (reducedMotion) {
                finishSlots(slots);
                stat.dataset.aboutStatAnimating = "false";
                return;
            }

            function animateSlots() {
                let allDone = true;

                slots.forEach((slot) => {
                    const distance = -slot.progress;

                    if (Math.abs(distance) < 0.004) {
                        slot.progress = 0;
                    } else {
                        const speed = Math.abs(distance) < 0.5 ? 0.14 : 0.06;
                        slot.progress += distance * speed;
                        allDone = false;
                    }
                });

                renderSlots(slots);

                if (!allDone) {
                    requestAnimationFrame(animateSlots);
                } else {
                    finishSlots(slots);
                    stat.dataset.aboutStatAnimating = "false";
                }
            }

            requestAnimationFrame(animateSlots);
        }

        renderStaticValue();
        playStatAnimations.push(playSlots);
    });

    function playAllStats() {
        playStatAnimations.forEach((playSlots, index) => {
            window.setTimeout(playSlots, index * 90);
        });
    }

    if ("IntersectionObserver" in window) {
        const observerTarget = aboutPhilosophy || aboutStatNumbers[0];
        let isPhilosophyVisible = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (isPhilosophyVisible) return;
                isPhilosophyVisible = true;
                playAllStats();
                return;
            }

            isPhilosophyVisible = false;
        }, {
            rootMargin: "0px 0px -20% 0px",
            threshold: 0.2,
        });

        observer.observe(observerTarget);
    } else {
        playAllStats();
    }
}

initializeAboutStatNumbers();
