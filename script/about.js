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
