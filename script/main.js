const heroStage = document.querySelector("[data-hero-stage]");
const heroMediaGrid = document.querySelector(".hero__media-grid");
const heroContent = document.querySelector(".hero__content");
const heroPlaceholders = document.querySelectorAll(".hero__media-placeholder");
const speakersStage = document.querySelector("[data-speakers-stage]");
const speakersPanels = document.querySelectorAll(".speakers-panel");
const fixedUi = document.querySelector("[data-fixed-ui]");
const fixedNav = document.querySelector(".fixed-nav");
const fixedNavLinks = document.querySelectorAll(".fixed-nav a");
const beginningDesign = document.querySelector("[data-beginning-design]");
const beginningSection = document.querySelector(".beginning");
const beginningText = document.querySelector(".beginning__text");
const beginningTextChars = [];
const beginningScrollArt = document.querySelector(".beginning__scroll-art");
const beginningSound = document.querySelector(".beginning-feature--sound");
const beginningSoundSticky = document.querySelector(".beginning-feature__sound-sticky");
const beginningSoundTitle = document.querySelector(".beginning-feature--sound .beginning-feature__title-box");
const beginningDesignSticky = document.querySelector(".beginning-feature__design-sticky");
const beginningCopyOne = document.querySelector("[data-beginning-copy-one]");
const beginningCopyTwo = document.querySelector("[data-beginning-copy-scroll]");
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
let speakersTargetProgress = 0;
let speakersRenderedProgress = 0;
let speakersAnimationFrame = null;
let speakersPreviousTargetProgress = 0;
let speakersFirstPanelProgress = 0;
let speakersFirstPanelHoldUntil = 0;
let speakersFirstPanelIsSequenced = false;
let beginningTextTargetProgress = 0;
let beginningTextRenderedProgress = 0;
let beginningTextAnimationFrame = null;
let beginningArtTargetProgress = 0;
let beginningArtRenderedProgress = 0;
let beginningArtAnimationFrame = null;
let beginningArtPaths = [];
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

function prepareBeginningText() {
    if (!beginningText || beginningTextChars.length) return;

    beginningText.setAttribute("aria-label", beginningText.textContent.trim());

    const walker = document.createTreeWalker(beginningText, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((textNode) => {
        if (!textNode.nodeValue.trim()) return;

        const fragment = document.createDocumentFragment();

        Array.from(textNode.nodeValue).forEach((character) => {
            if (/\s/.test(character)) {
                fragment.appendChild(document.createTextNode(character));
                return;
            }

            const characterSpan = document.createElement("span");
            characterSpan.className = "beginning__text-char";
            characterSpan.setAttribute("aria-hidden", "true");
            characterSpan.textContent = character;
            beginningTextChars.push(characterSpan);
            fragment.appendChild(characterSpan);
        });

        textNode.replaceWith(fragment);
    });
}

function updateBeginningTextReveal() {
    if (!beginningSection || !beginningTextChars.length) return;

    const textRect = beginningText.getBoundingClientRect();
    const revealStart = window.innerHeight * 0.82;
    const revealEnd = window.innerHeight * 0.22 - textRect.height;
    const revealDistance = Math.max(revealStart - revealEnd, 1);
    beginningTextTargetProgress = clamp((revealStart - textRect.top) / revealDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        beginningTextChars.forEach((character) => character.style.opacity = "1");
        return;
    }

    if (beginningTextAnimationFrame) return;

    function renderBeginningTextReveal() {
        const distance = beginningTextTargetProgress - beginningTextRenderedProgress;
        beginningTextRenderedProgress += distance * 0.12;

        if (Math.abs(distance) < 0.0001) {
            beginningTextRenderedProgress = beginningTextTargetProgress;
        }

        const characterCount = beginningTextChars.length;

        beginningTextChars.forEach((character, index) => {
            const characterStart = index / characterCount;
            const characterProgress = clamp(
                (beginningTextRenderedProgress - characterStart) * characterCount,
                0,
                1
            );

            character.style.opacity = `${0.25 + characterProgress * 0.75}`;
        });

        if (beginningTextRenderedProgress !== beginningTextTargetProgress) {
            beginningTextAnimationFrame = requestAnimationFrame(renderBeginningTextReveal);
        } else {
            beginningTextAnimationFrame = null;
        }
    }

    beginningTextAnimationFrame = requestAnimationFrame(renderBeginningTextReveal);
}

function prepareBeginningArtPaths() {
    if (!beginningScrollArt || beginningArtPaths.length) return Boolean(beginningArtPaths.length);

    const svgDocument = beginningScrollArt.contentDocument;
    if (!svgDocument) return false;

    const svgNamespace = "http://www.w3.org/2000/svg";
    const svgRoot = svgDocument.documentElement;
    let defs = svgRoot.querySelector("defs");

    if (!defs) {
        defs = svgDocument.createElementNS(svgNamespace, "defs");
        svgRoot.prepend(defs);
    }

    beginningArtPaths = Array.from(svgDocument.querySelectorAll("path")).map((sourcePath, index) => {
        const mask = svgDocument.createElementNS(svgNamespace, "mask");
        const maskId = `beginning-art-mask-${index}`;
        mask.setAttribute("id", maskId);
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "-1000");
        mask.setAttribute("y", "-1000");
        mask.setAttribute("width", "4000");
        mask.setAttribute("height", "4000");

        const path = sourcePath.cloneNode(false);

        path.style.fill = "none";
        path.style.stroke = "#fff";
        path.style.strokeWidth = "8";
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";

        mask.appendChild(path);
        defs.appendChild(mask);

        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        sourcePath.style.fill = "#000";
        sourcePath.style.stroke = "none";
        sourcePath.setAttribute("mask", `url(#${maskId})`);

        return { path, length };
    });

    return Boolean(beginningArtPaths.length);
}

function updateBeginningArtReveal() {
    if (!beginningScrollArt || !prepareBeginningArtPaths()) return;

    const artRect = beginningScrollArt.getBoundingClientRect();
    const revealStart = window.innerHeight * 0.8;
    const revealEnd = window.innerHeight * 0.4 - artRect.height;
    const revealDistance = Math.max(revealStart - revealEnd, 1);
    beginningArtTargetProgress = clamp((revealStart - artRect.top) / revealDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        beginningArtPaths.forEach(({ path }) => path.style.strokeDashoffset = "0");
        return;
    }

    if (beginningArtAnimationFrame) return;

    function renderBeginningArtReveal() {
        const distance = beginningArtTargetProgress - beginningArtRenderedProgress;
        beginningArtRenderedProgress += distance * 0.04;

        if (Math.abs(distance) < 0.0001) {
            beginningArtRenderedProgress = beginningArtTargetProgress;
        }

        beginningArtPaths.forEach(({ path, length }) => {
            path.style.strokeDashoffset = `${length * (1 - beginningArtRenderedProgress)}`;
        });

        if (beginningArtRenderedProgress !== beginningArtTargetProgress) {
            beginningArtAnimationFrame = requestAnimationFrame(renderBeginningArtReveal);
        } else {
            beginningArtAnimationFrame = null;
        }
    }

    beginningArtAnimationFrame = requestAnimationFrame(renderBeginningArtReveal);
}

function updateBeginningSectionTransition() {
    if (beginningSound && beginningSoundSticky && beginningSoundTitle) {
        const soundRect = beginningSound.getBoundingClientRect();
        const soundDistance = Math.max(beginningSound.offsetHeight - window.innerHeight, 1);
        const soundProgress = clamp(-soundRect.top / soundDistance, 0, 1);
        const isSoundPinned = soundRect.top <= 0 && soundRect.bottom > window.innerHeight;
        const isSoundEnded = soundRect.bottom <= window.innerHeight;
        const titleProgress = sequenceProgress(soundProgress, 0.08, 0.72);
        const easedTitleProgress = titleProgress * titleProgress * (3 - 2 * titleProgress);

        beginningSoundSticky.classList.toggle("is-pinned", isSoundPinned);
        beginningSoundSticky.classList.toggle("is-ended", isSoundEnded);
        beginningSoundTitle.style.transform = `translate3d(0, ${-easedTitleProgress * 115}vh, 0)`;
    }

    if (beginningDesign && beginningDesignSticky) {
        const designRect = beginningDesign.getBoundingClientRect();
        const entryProgress = clamp(
            (window.innerHeight - designRect.top) / window.innerHeight,
            0,
            1
        );
        const designEntryProgress = sequenceProgress(entryProgress, 0.5, 1);
        const easedEntryProgress =
            designEntryProgress * designEntryProgress * (3 - 2 * designEntryProgress);
        const isCrossfading = designRect.top > 0 && designRect.top < window.innerHeight;
        const isDesignPinned = designRect.top <= 0 && designRect.bottom > window.innerHeight;
        const isDesignEnded = designRect.bottom <= window.innerHeight;

        beginningDesignSticky.classList.toggle("is-crossfading", isCrossfading);
        beginningDesignSticky.classList.toggle("is-pinned", isDesignPinned);
        beginningDesignSticky.classList.toggle("is-ended", isDesignEnded);
        beginningDesignSticky.style.setProperty(
            "--design-entry-opacity",
            `${easedEntryProgress}`
        );
        beginningSoundSticky?.style.setProperty(
            "--sound-section-opacity",
            `${1 - easedEntryProgress}`
        );
    }
}

function updateSpeakersTransition() {
    if (!speakersStage || !speakersPanels.length) return;

    const stageRect = speakersStage.getBoundingClientRect();
    const scrollDistance = Math.max(speakersStage.offsetHeight - window.innerHeight, 1);
    speakersTargetProgress = clamp(-stageRect.top / scrollDistance, 0, 1);

    if (fixedNav && heroStage) {
        const heroBottom = heroStage.getBoundingClientRect().bottom;
        const navTriggerPoint = window.innerHeight * -0.05;
        const isScrollingUp = speakersTargetProgress < speakersPreviousTargetProgress - 0.0001;

        if (isScrollingUp) {
            if (fixedNav.classList.contains("is-speakers-revealed") && speakersTargetProgress <= 0.66) {
                fixedNav.classList.remove("is-speakers-revealed");
                speakersFirstPanelHoldUntil = performance.now() + 600;
                speakersFirstPanelIsSequenced = true;
            }
        } else {
            speakersFirstPanelHoldUntil = 0;
            speakersFirstPanelIsSequenced = false;
            fixedNav.classList.toggle("is-speakers-revealed", heroBottom <= navTriggerPoint);
        }
    }

    speakersPreviousTargetProgress = speakersTargetProgress;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (speakersAnimationFrame) cancelAnimationFrame(speakersAnimationFrame);
        speakersAnimationFrame = null;
        speakersPanels.forEach((panel) => panel.style.removeProperty("transform"));
        return;
    }

    if (speakersAnimationFrame) return;

    const timings = [
        [0, 0.56],
        [0.08, 0.66],
        [0.24, 0.82],
        [0.4, 0.96],
    ];

    function renderSpeakersTransition() {
        const distance = speakersTargetProgress - speakersRenderedProgress;
        speakersRenderedProgress += distance * 0.085;
        let isFirstPanelMoving = false;

        if (Math.abs(distance) < 0.0001) {
            speakersRenderedProgress = speakersTargetProgress;
        }

        speakersPanels.forEach((panel, index) => {
            const [start, end] = timings[index];
            let panelProgress = sequenceProgress(speakersRenderedProgress, start, end);

            if (index === 0) {
                if (speakersFirstPanelIsSequenced) {
                    const isFirstPanelHeld = performance.now() < speakersFirstPanelHoldUntil;
                    const firstPanelTarget = isFirstPanelHeld ? 1 : panelProgress;
                    const firstPanelDistance = firstPanelTarget - speakersFirstPanelProgress;

                    speakersFirstPanelProgress += firstPanelDistance * 0.12;

                    if (Math.abs(firstPanelDistance) < 0.0001) {
                        speakersFirstPanelProgress = firstPanelTarget;

                        if (!isFirstPanelHeld) speakersFirstPanelIsSequenced = false;
                    } else {
                        isFirstPanelMoving = true;
                    }
                } else {
                    speakersFirstPanelProgress = panelProgress;
                }

                panelProgress = speakersFirstPanelProgress;
            }

            const easedProgress = panelProgress * panelProgress * (3 - 2 * panelProgress);

            panel.style.transform = `translate3d(0, ${-easedProgress * 100}%, 0)`;
        });

        if (
            speakersRenderedProgress !== speakersTargetProgress ||
            isFirstPanelMoving ||
            performance.now() < speakersFirstPanelHoldUntil
        ) {
            speakersAnimationFrame = requestAnimationFrame(renderSpeakersTransition);
        } else {
            speakersAnimationFrame = null;
        }
    }

    speakersAnimationFrame = requestAnimationFrame(renderSpeakersTransition);
}

function updateFixedNav() {
    if (!fixedNavSections.length) return;

    const activePoint = window.innerHeight * 0.52;
    let activeSection = fixedNavSections[0];
    let isSignatureActive = false;
    let isLegacyHeroActive = false;
    let isBeginningSoundActive = false;

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

    if (beginningSound || beginningDesignSticky) {
        const beginningSoundRect = beginningSound?.getBoundingClientRect();
        const beginningDesignStickyRect = beginningDesignSticky?.getBoundingClientRect();
        isBeginningSoundActive = Boolean(
            (beginningSoundRect &&
                beginningSoundRect.top <= activePoint &&
                beginningSoundRect.bottom > activePoint) ||
            (beginningDesignStickyRect &&
                beginningDesignStickyRect.top <= activePoint &&
                beginningDesignStickyRect.bottom > activePoint)
        );

        if (isBeginningSoundActive) {
            const designLink = Array.from(fixedNavLinks).find(
                (link) => link.getAttribute("href") === "#design"
            );

            if (designLink) {
                activeSection = {
                    link: designLink,
                    target: beginningDesignSticky || beginningSound,
                };
            }
        }
    }

    if (fixedNav && activeSection.link) {
        fixedNav.style.setProperty("--fixed-nav-indicator-top", `${activeSection.link.offsetTop}px`);
        fixedNav.classList.toggle("is-beginning-sound", isBeginningSoundActive);
    }

    if (fixedUi && soundStage) {
        const soundRect = soundStage.getBoundingClientRect();
        const isSoundActive =
            (soundRect.top <= activePoint && soundRect.bottom > activePoint) ||
            isSignatureActive;
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
    const copyStartDelay = window.innerHeight * 0.35;
    const textProgress = clamp((-stageRect.top - copyStartDelay) / trackExit, 0, 1);
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
    updateSpeakersTransition();
    updateBeginningTextReveal();
    updateBeginningArtReveal();
    updateBeginningSectionTransition();
    updateFixedNav();
    updateBeginningCopyScroll();
    updateSoundHorizontalScroll();
    updateHeadphoneSequence();
    updateLegacySequence();
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
beginningScrollArt?.addEventListener("load", () => {
    prepareBeginningArtPaths();
    updateBeginningArtReveal();
});
prepareBeginningText();
updateScrollEffects();
