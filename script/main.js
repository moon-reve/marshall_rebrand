const heroStage = document.querySelector("[data-hero-stage]");
const heroMediaGrid = document.querySelector(".hero__media-grid");
const heroContent = document.querySelector(".hero__content");
const heroPlaceholders = document.querySelectorAll(".hero__media-placeholder");
const fixedUi = document.querySelector("[data-fixed-ui]");
const fixedNavLinks = document.querySelectorAll(".fixed-nav a");
const beginningDesign = document.querySelector("[data-beginning-design]");
const beginningCopyOne = document.querySelector("[data-beginning-copy-one]");
const beginningCopyTwo = document.querySelector("[data-beginning-copy-scroll]");
const evolutionStage = document.querySelector("[data-evolution-stage]");
const soundStage = document.querySelector("[data-sound-stage]");
const soundSticky = document.querySelector(".sound-sticky");
const soundTrack = document.querySelector("[data-sound-track]");
const signatureSound = document.querySelector("[data-signature-sound]");
const headphoneSequence = document.querySelector(".headphone-sequence");
const headphoneSequenceSticky = document.querySelector(".headphone-sequence__sticky");
const headphoneStage = document.querySelector("[data-headphone-stage]");
const headphoneDetail = document.querySelector("[data-headphone-detail]");
const soundBlank = document.querySelector("[data-sound-blank]");
const legacyStage = document.querySelector("[data-legacy-stage]");
const legacySequence = document.querySelector("[data-legacy-sequence]");
const legacySequenceArt = document.querySelector(".legacy-sequence__art");
const legacyHero = document.querySelector("[data-legacy-hero]");
const legacyStatement = document.querySelector("[data-legacy-statement]");
const legacyClosing = document.querySelector("[data-legacy-closing]");
const finale = document.querySelector("[data-finale]");
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
    let isSignatureActive = false;
    let isLegacyHeroActive = false;

    fixedNavSections.forEach((section) => {
        const rect = section.target.getBoundingClientRect();

        if (rect.top <= activePoint && rect.bottom > activePoint) {
            activeSection = section;
        }
    });

    if (signatureSound) {
        const signatureRect = signatureSound.getBoundingClientRect();
        isSignatureActive = signatureRect.top <= activePoint && signatureRect.bottom > activePoint;

        if (isSignatureActive) {
            activeSection = fixedNavSections.find(({ link }) => link.getAttribute("href") === "#sound") || activeSection;
        }
    }

    if (legacyHero) {
        const legacyHeroRect = legacyHero.getBoundingClientRect();
        isLegacyHeroActive = legacyHeroRect.top <= activePoint && legacyHeroRect.bottom > activePoint;

        if (isLegacyHeroActive) {
            activeSection =
                fixedNavSections.find(({ link }) => link.getAttribute("href") === "#legacy") || activeSection;
        }
    }

    if (legacyStatement) {
        const legacyStatementRect = legacyStatement.getBoundingClientRect();
        const isLegacyStatementActive =
            legacyStatementRect.top <= activePoint && legacyStatementRect.bottom > activePoint;
        isLegacyHeroActive = isLegacyHeroActive || isLegacyStatementActive;

        if (isLegacyStatementActive) {
            activeSection =
                fixedNavSections.find(({ link }) => link.getAttribute("href") === "#legacy") || activeSection;
        }
    }

    if (legacyClosing) {
        const legacyClosingRect = legacyClosing.getBoundingClientRect();
        const isLegacyClosingActive =
            legacyClosingRect.top <= activePoint && legacyClosingRect.bottom > activePoint;
        isLegacyHeroActive = isLegacyHeroActive || isLegacyClosingActive;

        if (isLegacyClosingActive) {
            activeSection =
                fixedNavSections.find(({ link }) => link.getAttribute("href") === "#legacy") || activeSection;
        }
    }

    fixedNavLinks.forEach((link) => {
        const isActive = link === activeSection.link;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    if (fixedUi && soundStage) {
        const evolutionRect = evolutionStage?.getBoundingClientRect();
        const soundRect = soundStage.getBoundingClientRect();
        const isSoundActive =
            (soundRect.top <= activePoint && soundRect.bottom > activePoint) ||
            isSignatureActive;
        fixedUi.classList.toggle(
            "is-evolution-stage",
            Boolean(evolutionRect && evolutionRect.top <= activePoint && evolutionRect.bottom > activePoint)
        );
        fixedUi.classList.toggle("is-dark", isSoundActive || isLegacyHeroActive);
        fixedUi.classList.toggle("is-signature-sound", isSignatureActive);

        const headphoneRect = headphoneStage?.getBoundingClientRect();
        const headphoneDetailRect = headphoneDetail?.getBoundingClientRect();
        const soundBlankRect = soundBlank?.getBoundingClientRect();
        const legacyRect = legacyStage?.getBoundingClientRect();
        const finaleRect = finale?.getBoundingClientRect();
        const isHeadphoneActive = Boolean(
            (headphoneRect && headphoneRect.top <= activePoint && headphoneRect.bottom > activePoint) ||
            (headphoneDetailRect &&
                headphoneDetailRect.top <= activePoint &&
                headphoneDetailRect.bottom > activePoint) ||
            (soundBlankRect && soundBlankRect.top <= activePoint && soundBlankRect.bottom > activePoint) ||
            (legacyRect && legacyRect.top <= activePoint && legacyRect.bottom > activePoint)
        );
        fixedUi.classList.toggle("is-headphone-stage", isHeadphoneActive);
        fixedUi.classList.toggle(
            "is-final-stage",
            Boolean(finaleRect && finaleRect.top <= activePoint && finaleRect.bottom > activePoint)
        );
    }
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

function updateSoundHorizontalScroll() {
    if (!soundStage || !soundSticky || !soundTrack) return;

    const stageRect = soundStage.getBoundingClientRect();
    const scrollDistance = Math.max(soundStage.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-stageRect.top / scrollDistance, 0, 1);
    const isPinned = stageRect.top <= 0 && stageRect.bottom > window.innerHeight;
    const isEnded = stageRect.bottom <= window.innerHeight;
    const isSoundVisible = stageRect.top < window.innerHeight && stageRect.bottom > 0;
    const horizontalDistance = Math.max(soundTrack.scrollWidth - window.innerWidth, 0);

    soundSticky.classList.toggle("is-pinned", isPinned);
    soundSticky.classList.toggle("is-ended", isEnded);
    soundTrack.style.transform = `translate3d(${-progress * horizontalDistance}px, 0, 0)`;

    if (fixedUi) {
        fixedUi.classList.toggle("is-sound-content", isSoundVisible && progress > 0.08);
        fixedUi.classList.toggle("is-sound-horizontal", isSoundVisible);
    }
}

function updateHeadphoneSequence() {
    if (!headphoneSequence || !headphoneSequenceSticky) return;

    const sequenceRect = headphoneSequence.getBoundingClientRect();
    const isPinned = sequenceRect.top <= 0 && sequenceRect.bottom > window.innerHeight;
    const isEnded = sequenceRect.bottom <= window.innerHeight;

    headphoneSequenceSticky.classList.toggle("is-pinned", isPinned);
    headphoneSequenceSticky.classList.toggle("is-ended", isEnded);
}

function updateLegacySequence() {
    if (!legacySequence || !legacySequenceArt) return;

    const sequenceRect = legacySequence.getBoundingClientRect();
    const isPinned = sequenceRect.top <= 0 && sequenceRect.bottom > window.innerHeight;
    const isEnded = sequenceRect.bottom <= window.innerHeight;

    legacySequenceArt.classList.toggle("is-pinned", isPinned);
    legacySequenceArt.classList.toggle("is-ended", isEnded);
}

function updateScrollEffects() {
    updateHeroScroll();
    updateFixedNav();
    updateBeginningCopyScroll();
    updateSoundHorizontalScroll();
    updateHeadphoneSequence();
    updateLegacySequence();
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();
