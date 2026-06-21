const heroStage = document.querySelector("[data-hero-stage]");
const heroMediaGrid = document.querySelector(".hero__media-grid");
const heroContent = document.querySelector(".hero__content");
const heroPlaceholders = document.querySelectorAll(".hero__media-placeholder");
const fixedUi = document.querySelector("[data-fixed-ui]");
const fixedNavLinks = document.querySelectorAll(".fixed-nav a");
const beginningDesign = document.querySelector("[data-beginning-design]");
const beginningCopyOne = document.querySelector("[data-beginning-copy-one]");
const beginningCopyTwo = document.querySelector("[data-beginning-copy-scroll]");
const fixedNavSections = Array.from(fixedNavLinks)
    .map((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        return target ? { link, target } : null;
    })
    .filter(Boolean);

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function mix(start, end, progress) {
    return start + (end - start) * progress;
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function updateHeroScroll() {
    // 4패널 인터랙션 제거 — 히어로는 정적으로 표시
}

function updateFixedNav() {
    if (!fixedNavSections.length) return;

    const activePoint = window.innerHeight * 0.52;
    let activeSection = fixedNavSections[0];

    fixedNavSections.forEach((section) => {
        const rect = section.target.getBoundingClientRect();

        if (rect.top <= activePoint && rect.bottom > activePoint) {
            activeSection = section;
        }
    });

    fixedNavLinks.forEach((link) => {
        const isActive = link === activeSection.link;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function updateBeginningCopyScroll() {
    if (!beginningDesign || !beginningCopyOne || !beginningCopyTwo) return;

    const fixedGap = window.innerHeight * 0.5;
    const copyTwoTop = beginningCopyOne.offsetTop + beginningCopyOne.offsetHeight + fixedGap;
    const trackExit = copyTwoTop + beginningCopyTwo.offsetHeight + 48;

    const stageRect = beginningDesign.getBoundingClientRect();
    const scrollDistance = Math.max(beginningDesign.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-stageRect.top / scrollDistance, 0, 1);
    const textProgress = clamp((-stageRect.top) / trackExit, 0, 1);
    const trackMove = textProgress * -trackExit;

    beginningCopyTwo.style.top = `${copyTwoTop}px`;
    beginningCopyOne.style.transform = `translate3d(0, ${trackMove}px, 0)`;
    beginningCopyTwo.style.transform = `translate3d(0, ${trackMove}px, 0)`;
}

function updateScrollEffects() {
    updateHeroScroll();
    updateFixedNav();
    updateBeginningCopyScroll();
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();
