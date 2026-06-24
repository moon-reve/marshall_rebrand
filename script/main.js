const heroStage = document.querySelector("[data-hero-stage]");
const heroMediaGrid = document.querySelector(".hero__media-grid");
const heroContent = document.querySelector(".hero__content");
const heroAbout = document.querySelector(".hero__about");
const heroPlaceholders = document.querySelectorAll(".hero__media-placeholder");
const speakersStage = document.querySelector("[data-speakers-stage]");
const speakersGrid = speakersStage?.querySelector(".speakers-grid");
const speakersImages = document.querySelectorAll(".speakers-img");
const fixedUi = document.querySelector("[data-fixed-ui]");
const fixedNav = document.querySelector(".fixed-nav");
const fixedNavLinks = document.querySelectorAll(".fixed-nav a");
const fixedGauge = document.querySelector(".fixed-gauge");
const fixedGaugeTicks = document.querySelectorAll(".fixed-gauge__tick");
const designPanel = document.querySelector("[data-design-panel]");
const beginningSection = document.querySelector(".beginning");
const beginningText = document.querySelector(".beginning__text");
const beginningTextChars = [];
const beginningScrollArt = document.querySelector(".beginning__scroll-art");
const designSound = document.querySelector(".design-feature--sound");
const designSoundSticky = document.querySelector(".design-feature__sound-sticky");
const designTextFlowInner = document.querySelector(".design-feature__text-flow-inner");
const designTitleBox = document.querySelector(".design-feature__title-box");
const designSticky = document.querySelector(".design-feature__design-sticky");
const designPanelItems = document.querySelectorAll(".design-feature__design-panel");
const designCopyTrack = document.querySelector("[data-design-copy-track]");
const designCopyOne = document.querySelector("[data-design-copy-one]");
const designCopyTwo = document.querySelector("[data-design-copy-scroll]");
const evolutionStage = document.querySelector("[data-evolution-stage]");
const soundStage = document.querySelector("[data-sound-stage]");
const soundSticky = document.querySelector(".sound-sticky");
const soundTrack = document.querySelector("[data-sound-track]");
const soundPanels = document.querySelectorAll(".sound-panel");
const soundChannels = document.querySelectorAll(".sound-channel");
const soundLightRays = document.querySelector("[data-sound-light-rays]");
const signatureSound = document.querySelector("[data-signature-sound]");
const headphoneSequence = document.querySelector(".headphone-sequence");
const headphoneSequenceSticky = document.querySelector(".headphone-sequence__sticky");
const headphoneStageArt = document.querySelector(".headphone-stage__art");
const headphoneStage = document.querySelector("[data-headphone-stage]");
const headphoneDetail = document.querySelector("[data-headphone-detail]");
const headphoneDetailCopy = document.querySelector(".headphone-detail__copy");
const soundSpeaker = document.querySelector("[data-sound-speaker]");
const soundSpeakerSticky = document.querySelector(".sound-speaker__sticky");
const soundSpeakerArt = document.querySelector(".sound-speaker__art");
const soundSpeakerDetail = document.querySelector(".sound-speaker__detail");
const soundSpeakerCopy = document.querySelector(".sound-speaker__copy");
const legacySequence = document.querySelector("[data-legacy-sequence]");
const legacySequenceArt = document.querySelector(".legacy-sequence__art");
const legacyHero = document.querySelector("[data-legacy-hero]");
const legacyStatement = document.querySelector("[data-legacy-statement]");
const legacyClosing = document.querySelector("[data-legacy-closing]");
const legacyClosingCopy = document.querySelector(".legacy-closing__copy");
const legacyClosingSteps = document.querySelector(".legacy-closing__steps");
const legacyClosingPanels = document.querySelectorAll(".legacy-closing__steps span");
const finale = document.querySelector("[data-finale]");
const finaleTitle = document.querySelector(".finale__title");
const finaleCreditItems = document.querySelectorAll(".finale__credits span");
const speakersTransitionBg = document.createElement("div");
const fixedGaugeTickAngles = [0, 30, 60, 90, 120, 150, 210, 240, 270, 300, 330];
const fixedGaugeDotBaseAngle = 30;
const fixedGaugeStartAngle = (fixedGaugeDotBaseAngle + 180) % 360;
const fixedGaugeEndAngle = fixedGaugeTickAngles[5];
const fixedGaugeMaxRotation = getClockwiseAngleDistance(fixedGaugeStartAngle, fixedGaugeEndAngle);
const fixedGaugeActivationRange = 0;

speakersTransitionBg.className = "speakers-transition-bg";
speakersGrid?.prepend(speakersTransitionBg);

if (heroMediaGrid) {
    heroMediaGrid.classList.add("hero__media-grid-overlay");
    document.body.appendChild(heroMediaGrid);
}

if (heroContent) {
    heroContent.classList.add("hero__content-overlay");
    document.body.appendChild(heroContent);
}

const legacyPanelTargetY = [100, 100, 100, 100];
const legacyPanelRenderedY = [100, 100, 100, 100];
let legacyPanelAnimationFrame = null;

let speakersTargetProgress = 0;
let speakersRenderedProgress = 0;
let speakersAnimationFrame = null;
let speakersPreviousTargetProgress = 0;
let speakersFirstPanelProgress = 0;
let speakersFirstPanelHoldUntil = 0;
let speakersFirstPanelIsSequenced = false;
let designPanelExitTargetProgress = 0;
let designPanelExitRenderedProgress = 0;
let designPanelExitAnimationFrame = null;
let heroLightsOn = false;
let heroLightsAnimating = false;
let speakersEntryIsAutoAnimating = false;
let speakersEntryAutoAnimationFrame = null;
let speakersIsAutoAnimating = false;
let speakersAutoAnimationFrame = null;
let beginningTextTargetProgress = 0;
let beginningTextRenderedProgress = 0;
let beginningTextAnimationFrame = null;
let beginningArtTargetProgress = 0;
let beginningArtRenderedProgress = 0;
let beginningArtAnimationFrame = null;
let beginningArtPaths = [];
let headphoneArtPaths = [];
let headphoneArtTotalLength = 0;
let soundSpeakerArtPaths = [];
let soundSpeakerArtTotalLength = 0;
const fixedNavSections = Array.from(fixedNavLinks)
    .map((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        return target ? { link, target } : null;
    })
    .filter(Boolean);
fixedNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        if (!fixedNav.classList.contains("is-speakers-revealed")) return;
        const href = link.getAttribute("href");
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});

const legacyPanelTimings = [
    [0, 0.5],
    [0.05, 0.55],
    [0.1, 0.6],
    [0.15, 0.65],
];

const speakersPanelTimings = [
    [0, 0.56],
    [0.08, 0.66],
    [0.24, 0.82],
    [0.4, 0.96],
];

const lineArtTransition = "stroke-dashoffset 0.22s cubic-bezier(0.22, 1, 0.36, 1)";

function getLineArtPathProgress(drawLength, startLength, length, totalLength) {
    const overlapLength = Math.min(totalLength * 0.018, length * 0.45);
    const rawProgress = clamp(
        (drawLength - startLength + overlapLength) / (length + overlapLength * 2),
        0,
        1
    );

    return rawProgress * rawProgress * (3 - 2 * rawProgress);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function mix(start, end, progress) {
    return start + (end - start) * progress;
}

function sequenceProgress(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
}

function renderSpeakersEntry(progress) {
    const easedProgress = progress * progress * (3 - 2 * progress);

    speakersImages.forEach((image) => {
        image.style.setProperty("--speakers-entry-y", `${(1 - easedProgress) * 100}vh`);
    });
}

function renderDesignPanelExit(progress) {
    designPanelItems.forEach((panel, index) => {
        const [start, end] = speakersPanelTimings[index] || [0, 1];
        const panelProgress = sequenceProgress(progress, start, end);
        const easedProgress = panelProgress * panelProgress * (3 - 2 * panelProgress);

        panel.style.setProperty("--design-panel-y", `${-easedProgress * 100}%`);
    });
}

function updateDesignPanelExitProgress(progress) {
    designPanelExitTargetProgress = progress;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (designPanelExitAnimationFrame) cancelAnimationFrame(designPanelExitAnimationFrame);
        designPanelExitAnimationFrame = null;
        designPanelExitRenderedProgress = designPanelExitTargetProgress;
        renderDesignPanelExit(designPanelExitRenderedProgress);
        return;
    }

    if (designPanelExitAnimationFrame) return;

    function renderDesignPanelExitFrame() {
        const distance = designPanelExitTargetProgress - designPanelExitRenderedProgress;
        designPanelExitRenderedProgress += distance * 0.08;

        if (Math.abs(distance) < 0.0001) {
            designPanelExitRenderedProgress = designPanelExitTargetProgress;
        }

        renderDesignPanelExit(designPanelExitRenderedProgress);

        if (designPanelExitRenderedProgress !== designPanelExitTargetProgress) {
            designPanelExitAnimationFrame = requestAnimationFrame(renderDesignPanelExitFrame);
        } else {
            designPanelExitAnimationFrame = null;
        }
    }

    designPanelExitAnimationFrame = requestAnimationFrame(renderDesignPanelExitFrame);
}

function renderHeroContentExit(progress) {
    const exitProgress = clamp(progress, 0, 1);
    const easedProgress = exitProgress * exitProgress * (3 - 2 * exitProgress);
    const opacityProgress = clamp(exitProgress / 0.65, 0, 1);
    const easedOpacityProgress =
        opacityProgress * opacityProgress * (3 - 2 * opacityProgress);

    if (!heroContent) return;

    heroContent.classList.toggle("is-active", exitProgress < 0.995);
    heroContent.style.setProperty("--hero-content-y", `${-easedProgress * 100}vh`);
    heroContent.style.setProperty("--hero-content-opacity", `${1 - easedOpacityProgress}`);
}

function renderFixedGaugeReveal(progress) {
    if (!fixedGauge) return;

    const [lastPanelStart, lastPanelEnd] = speakersPanelTimings[3];
    const revealProgress = sequenceProgress(progress, lastPanelStart, lastPanelEnd);
    const easedProgress = revealProgress * revealProgress * (3 - 2 * revealProgress);

    fixedGauge.style.setProperty("--fixed-gauge-reveal", `${easedProgress}`);
    fixedGauge.style.setProperty("--fixed-gauge-opacity", `${easedProgress}`);
}

function renderHeroMediaExit(progress) {
    const [firstPanelStart, firstPanelEnd] = speakersPanelTimings[0];
    const exitProgress = sequenceProgress(progress, firstPanelStart, firstPanelEnd);
    const easedProgress = exitProgress * exitProgress * (3 - 2 * exitProgress);

    if (heroMediaGrid) {
        heroMediaGrid.style.setProperty("--hero-media-y", `${-easedProgress * 100}vh`);
    }

    renderFixedGaugeReveal(progress);
}

function renderSpeakersTransitionBackground(progress) {
    const [firstPanelStart, firstPanelEnd] = speakersPanelTimings[0];
    const backgroundProgress = sequenceProgress(progress, firstPanelStart, firstPanelEnd);

    speakersTransitionBg.style.setProperty(
        "--speakers-transition-bg-opacity",
        `${backgroundProgress}`
    );
}

function renderSpeakersImages(progress, useFirstPanelSequence = true) {
    let isFirstPanelMoving = false;

    speakersImages.forEach((image, index) => {
        const [start, end] = speakersPanelTimings[index];
        let panelProgress = sequenceProgress(progress, start, end);

        if (index === 0 && useFirstPanelSequence) {
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
        } else if (index === 0) {
            speakersFirstPanelProgress = panelProgress;
        }

        const easedProgress = panelProgress * panelProgress * (3 - 2 * panelProgress);

        image.style.setProperty("--speakers-panel-y", `${-easedProgress * 100}%`);
    });

    return isFirstPanelMoving;
}

function triggerHeroLightsOn() {
    if (heroLightsAnimating || heroLightsOn) return;
    heroLightsAnimating = true;
    setTimeout(() => {
        heroMediaGrid?.style.setProperty("--hero-dark-opacity", "0");
        setTimeout(() => {
            heroLightsOn = true;
            heroLightsAnimating = false;
        }, 1050);
    }, 500);
}

function updateHeroScroll() {
    if (!heroStage || !speakersStage || !speakersGrid || !speakersImages.length) return;
    const heroRect = heroStage.getBoundingClientRect();
    const heroScrollDistance = Math.max(heroStage.offsetHeight - window.innerHeight, 1);
    const heroProgress = clamp(-heroRect.top / heroScrollDistance, 0, 1);

    if (heroRect.top >= -10 && heroLightsOn && !heroLightsAnimating) {
        heroLightsOn = false;
        heroMediaGrid?.style.setProperty("--hero-dark-opacity", "0.8");
    }

    if (speakersEntryIsAutoAnimating) return;

    const speakersRect = speakersStage.getBoundingClientRect();

    // speakers-stage가 아직 뷰포트 위에 없는 동안 entry 페이즈 (조명이 켜진 후에만)
    const isEntryPhase = heroProgress > 0 && heroLightsOn && speakersRect.top > 0;
    const isHeroContentVisible = heroRect.bottom > 0 && speakersRect.top > 0;

    speakersGrid.classList.toggle("is-entry", isEntryPhase);
    heroAbout?.classList.toggle("is-speakers-entering", isEntryPhase);
    heroContent?.classList.toggle("is-active", isHeroContentVisible);

    if (isEntryPhase) {
        renderHeroContentExit(0);
        renderHeroMediaExit(0);
        renderSpeakersTransitionBackground(0);
        renderSpeakersEntry(heroProgress);
    } else {
        speakersImages.forEach((image) => {
            image.style.setProperty("--speakers-entry-y", "0vh");
        });
        renderHeroContentExit(speakersRenderedProgress);
        renderHeroMediaExit(speakersRenderedProgress);
        renderSpeakersTransitionBackground(speakersRect.bottom > 0 ? speakersRenderedProgress : 0);
    }
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

function renderBeginningTextProgress(progress) {
    const characterCount = beginningTextChars.length;

    beginningTextChars.forEach((character, index) => {
        const characterStart = index / characterCount;
        const characterProgress = clamp(
            (progress - characterStart) * characterCount,
            0,
            1
        );

        character.style.opacity = `${0.25 + characterProgress * 0.75}`;
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

        renderBeginningTextProgress(beginningTextRenderedProgress);

        if (beginningTextRenderedProgress !== beginningTextTargetProgress) {
            beginningTextAnimationFrame = requestAnimationFrame(renderBeginningTextReveal);
        } else {
            beginningTextAnimationFrame = null;
        }
    }

    beginningTextAnimationFrame = requestAnimationFrame(renderBeginningTextReveal);
}

function getPointDistance(firstPoint, secondPoint) {
    const xDistance = firstPoint.x - secondPoint.x;
    const yDistance = firstPoint.y - secondPoint.y;

    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

function sortConnectedPathsLeftToRight(paths) {
    const remainingPaths = [...paths].sort((firstPath, secondPath) => {
        if (firstPath.start.x !== secondPath.start.x) return firstPath.start.x - secondPath.start.x;
        if (firstPath.start.y !== secondPath.start.y) return firstPath.start.y - secondPath.start.y;
        return firstPath.index - secondPath.index;
    });
    const sortedPaths = [];
    const connectionTolerance = 3;

    while (remainingPaths.length) {
        let currentPath = remainingPaths.shift();
        sortedPaths.push(currentPath);

        while (remainingPaths.length) {
            let nextIndex = -1;
            let nextDistance = Infinity;

            remainingPaths.forEach((candidatePath, index) => {
                const distance = getPointDistance(currentPath.end, candidatePath.start);

                if (distance <= connectionTolerance && distance < nextDistance) {
                    nextIndex = index;
                    nextDistance = distance;
                }
            });

            if (nextIndex === -1) break;

            currentPath = remainingPaths.splice(nextIndex, 1)[0];
            sortedPaths.push(currentPath);
        }
    }

    return sortedPaths;
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

    beginningArtPaths = Array.from(svgDocument.querySelectorAll("path"))
        .map((sourcePath, index) => {
            const bounds = sourcePath.getBBox();
            const maskPadding = Math.max(bounds.width, bounds.height) * 0.08;
            const mask = svgDocument.createElementNS(svgNamespace, "mask");
            const maskId = `beginning-art-mask-${index}`;
            mask.setAttribute("id", maskId);
            mask.setAttribute("maskUnits", "userSpaceOnUse");
            mask.setAttribute("x", `${bounds.x - maskPadding}`);
            mask.setAttribute("y", `${bounds.y - maskPadding}`);
            mask.setAttribute("width", `${bounds.width + maskPadding * 2}`);
            mask.setAttribute("height", `${bounds.height + maskPadding * 2}`);

            const revealRect = svgDocument.createElementNS(svgNamespace, "rect");

            revealRect.setAttribute("x", `${bounds.x - maskPadding}`);
            revealRect.setAttribute("y", `${bounds.y - maskPadding}`);
            revealRect.setAttribute("width", "0");
            revealRect.setAttribute("height", `${bounds.height + maskPadding * 2}`);
            revealRect.setAttribute("fill", "#fff");

            mask.appendChild(revealRect);
            defs.appendChild(mask);

            sourcePath.style.fill = "#000";
            sourcePath.style.stroke = "none";
            sourcePath.setAttribute("mask", `url(#${maskId})`);

            return {
                revealRect,
                bounds,
                maskPadding,
                index,
            };
        })
        .sort((firstPath, secondPath) => {
            if (firstPath.bounds.x !== secondPath.bounds.x) return firstPath.bounds.x - secondPath.bounds.x;
            if (firstPath.bounds.y !== secondPath.bounds.y) return firstPath.bounds.y - secondPath.bounds.y;
            return firstPath.index - secondPath.index;
        });

    beginningScrollArt.classList.add("is-ready");

    return Boolean(beginningArtPaths.length);
}

function updateBeginningArtReveal() {
    if (!beginningScrollArt || !prepareBeginningArtPaths()) return;

    const artRect = beginningScrollArt.getBoundingClientRect();
    const revealStart = window.innerHeight * 0.8;
    const revealEnd = window.innerHeight * 0.55 - artRect.height;
    const revealDistance = Math.max(revealStart - revealEnd, 1);
    beginningArtTargetProgress = clamp((revealStart - artRect.top) / revealDistance, 0, 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        beginningArtPaths.forEach(({ revealRect, bounds, maskPadding }) => {
            revealRect.setAttribute("width", `${bounds.width + maskPadding * 2}`);
        });
        return;
    }

    if (beginningArtAnimationFrame) return;

    function renderBeginningArtReveal() {
        const distance = beginningArtTargetProgress - beginningArtRenderedProgress;
        beginningArtRenderedProgress += distance * 0.04;

        if (Math.abs(distance) < 0.0001) {
            beginningArtRenderedProgress = beginningArtTargetProgress;
        }

        const pathCount = beginningArtPaths.length;

        beginningArtPaths.forEach(({ revealRect, bounds, maskPadding }, index) => {
            const pathStart = index / pathCount;
            const pathProgress = clamp(
                (beginningArtRenderedProgress - pathStart) * pathCount,
                0,
                1
            );
            const revealWidth = (bounds.width + maskPadding * 2) * pathProgress;

            revealRect.setAttribute("width", `${revealWidth}`);
        });

        if (beginningArtRenderedProgress !== beginningArtTargetProgress) {
            beginningArtAnimationFrame = requestAnimationFrame(renderBeginningArtReveal);
        } else {
            beginningArtAnimationFrame = null;
        }
    }

    beginningArtAnimationFrame = requestAnimationFrame(renderBeginningArtReveal);
}

function prepareHeadphoneArtPaths() {
    if (!headphoneStageArt || headphoneArtPaths.length) return Boolean(headphoneArtPaths.length);

    const svgDocument = headphoneStageArt.contentDocument;
    if (!svgDocument) return false;

    let accumulatedLength = 0;

    headphoneArtPaths = Array.from(svgDocument.querySelectorAll("path")).map((path) => {
        const length = path.getTotalLength();
        const startLength = accumulatedLength;

        accumulatedLength += length;

        path.style.fill = "none";
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.transition = lineArtTransition;
        path.style.willChange = "stroke-dashoffset";

        return { path, length, startLength };
    });
    headphoneArtTotalLength = accumulatedLength;

    return Boolean(headphoneArtPaths.length);
}

function updateHeadphoneArtReveal() {
    if (!headphoneSequence || !headphoneDetail || !headphoneDetailCopy || !prepareHeadphoneArtPaths()) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        headphoneArtPaths.forEach(({ path }) => path.style.strokeDashoffset = "0");
        return;
    }

    const sequenceRect = headphoneSequence.getBoundingClientRect();
    const copyOffset = headphoneDetail.offsetTop + headphoneDetailCopy.offsetTop;
    const startSequenceTop = window.innerHeight * 0.25;
    const endSequenceTop = window.innerHeight * 0.1 - copyOffset;
    const revealDistance = Math.max(startSequenceTop - endSequenceTop, 1);
    const progress = clamp((startSequenceTop - sequenceRect.top) / revealDistance, 0, 1);
    if (!headphoneArtTotalLength) return;

    const drawLength = progress * headphoneArtTotalLength;

    headphoneArtPaths.forEach(({ path, length, startLength }) => {
        const pathProgress = getLineArtPathProgress(
            drawLength,
            startLength,
            length,
            headphoneArtTotalLength
        );

        path.style.strokeDashoffset = `${length * (1 - pathProgress)}`;
    });
}

function prepareSoundSpeakerArtPaths() {
    if (!soundSpeakerArt || soundSpeakerArtPaths.length) return Boolean(soundSpeakerArtPaths.length);

    const svgDocument = soundSpeakerArt.contentDocument;
    if (!svgDocument) return false;

    let accumulatedLength = 0;

    soundSpeakerArtPaths = Array.from(svgDocument.querySelectorAll("path")).map((path) => {
        const length = path.getTotalLength();
        const startLength = accumulatedLength;

        accumulatedLength += length;

        path.style.fill = "none";
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.transition = lineArtTransition;
        path.style.willChange = "stroke-dashoffset";

        return { path, length, startLength };
    });
    soundSpeakerArtTotalLength = accumulatedLength;

    return Boolean(soundSpeakerArtPaths.length);
}

function updateSoundSpeakerArtReveal() {
    if (!soundSpeaker || !soundSpeakerDetail || !soundSpeakerCopy || !prepareSoundSpeakerArtPaths()) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        soundSpeakerArtPaths.forEach(({ path }) => path.style.strokeDashoffset = "0");
        return;
    }

    const sequenceRect = soundSpeaker.getBoundingClientRect();
    const copyOffset = soundSpeakerDetail.offsetTop + soundSpeakerCopy.offsetTop;
    const startSequenceTop = window.innerHeight * 0.25;
    const endSequenceTop = window.innerHeight * 0.1 - copyOffset;
    const revealDistance = Math.max(startSequenceTop - endSequenceTop, 1);
    const progress = clamp((startSequenceTop - sequenceRect.top) / revealDistance, 0, 1);
    if (!soundSpeakerArtTotalLength) return;

    const drawLength = progress * soundSpeakerArtTotalLength;

    soundSpeakerArtPaths.forEach(({ path, length, startLength }) => {
        const pathProgress = getLineArtPathProgress(
            drawLength,
            startLength,
            length,
            soundSpeakerArtTotalLength
        );

        path.style.strokeDashoffset = `${length * (1 - pathProgress)}`;
    });
}

function updateDesignSectionTransition() {
    if (designSound && designSoundSticky) {
        const soundRect = designSound.getBoundingClientRect();
        const soundDistance = Math.max(designSound.offsetHeight - window.innerHeight, 1);
        const isSoundPinned = soundRect.top <= 0 && soundRect.bottom > window.innerHeight;
        const isSoundEnded = soundRect.bottom <= window.innerHeight;

        designSoundSticky.classList.toggle("is-pinned", isSoundPinned);
        designSoundSticky.classList.toggle("is-ended", isSoundEnded);
    }

    if (designPanel && designSticky) {
        const designRect = designPanel.getBoundingClientRect();
        const titleRect = designTitleBox?.getBoundingClientRect();
        const designEntryProgress = titleRect
            ? clamp(-titleRect.top / (window.innerHeight * 0.65), 0, 1)
            : 0;
        const easedEntryProgress =
            designEntryProgress * designEntryProgress * (3 - 2 * designEntryProgress);
        const isCrossfading = designRect.top > 0 && designRect.top < window.innerHeight;
        const isDesignPinned = designRect.top <= 0 && designRect.bottom > 0;
        const isDesignEnded = designRect.bottom <= 0;

        designSticky.classList.toggle("is-crossfading", isCrossfading);
        designSticky.classList.toggle("is-pinned", isDesignPinned);
        designSticky.classList.toggle("is-ended", isDesignEnded);
        designSticky.style.setProperty(
            "--design-entry-opacity",
            `${easedEntryProgress}`
        );
        designSticky.style.setProperty("--design-exit-opacity", "1");
        const evolutionRect = evolutionStage?.getBoundingClientRect();
        const designPanelExitProgress = evolutionRect
            ? clamp((window.innerHeight - evolutionRect.top) / window.innerHeight, 0, 1)
            : 0;
        const soundOpacity = designPanelExitProgress > 0.001 ? 0 : 1;

        designSoundSticky?.style.setProperty("--sound-section-opacity", `${soundOpacity}`);
        updateDesignPanelExitProgress(designPanelExitProgress);
    }
}

function updateSpeakersTransition() {
    if (!speakersStage || !speakersImages.length) return;

    const stageRect = speakersStage.getBoundingClientRect();
    const scrollDistance = Math.max(speakersStage.offsetHeight, 1);
    speakersTargetProgress = clamp((window.innerHeight - stageRect.top) / scrollDistance, 0, 1);

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
            const nowRevealed = heroBottom <= navTriggerPoint;
            fixedNav.classList.toggle("is-speakers-revealed", nowRevealed);
            if (nowRevealed) {
                fixedNav.style.removeProperty("--nav-exit-y");
            }
        }

        const isRevealed = fixedNav.classList.contains("is-speakers-revealed");
        fixedNav.classList.toggle("is-hero", !isRevealed);
        fixedNav.classList.toggle("is-hero-top", window.scrollY < 50);
        fixedNav.classList.toggle("is-nav-dropping", speakersTargetProgress > 0.01 && !isRevealed);
    }

    speakersPreviousTargetProgress = speakersTargetProgress;

    if (speakersIsAutoAnimating) return;

    if (stageRect.bottom <= 0 || stageRect.top >= window.innerHeight) {
        renderSpeakersTransitionBackground(0);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (speakersAnimationFrame) cancelAnimationFrame(speakersAnimationFrame);
        speakersAnimationFrame = null;
        speakersImages.forEach((image) => image.style.removeProperty("--speakers-panel-y"));
        return;
    }

    if (speakersAnimationFrame) return;

    function renderSpeakersTransition() {
        const distance = speakersTargetProgress - speakersRenderedProgress;
        speakersRenderedProgress += distance * 0.085;

        if (Math.abs(distance) < 0.0001) {
            speakersRenderedProgress = speakersTargetProgress;
        }

        const isFirstPanelMoving = renderSpeakersImages(speakersRenderedProgress);
        renderHeroContentExit(speakersRenderedProgress);
        renderHeroMediaExit(speakersRenderedProgress);
        renderSpeakersTransitionBackground(speakersRenderedProgress);

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

function animateSpeakersToEnd() {
    if (!speakersStage || speakersIsAutoAnimating || speakersRenderedProgress >= 0.98) return;

    speakersIsAutoAnimating = true;
    speakersFirstPanelHoldUntil = 0;
    speakersFirstPanelIsSequenced = false;

    if (speakersAnimationFrame) cancelAnimationFrame(speakersAnimationFrame);
    if (speakersAutoAnimationFrame) cancelAnimationFrame(speakersAutoAnimationFrame);

    speakersAnimationFrame = null;
    const startProgress = speakersRenderedProgress;
    const startBeginningProgress = beginningTextRenderedProgress;
    const startScrollY = window.scrollY;
    const startTime = performance.now();
    const duration = 1400;
    let targetScrollY = speakersStage.offsetTop + speakersStage.offsetHeight - window.innerHeight;
    let targetBeginningProgress = 0;

    if (beginningText && beginningTextChars.length) {
        const textRect = beginningText.getBoundingClientRect();
        const beginningTextLowerY = window.scrollY + textRect.top - window.innerHeight * 0.68;

        targetScrollY = Math.max(targetScrollY, beginningTextLowerY);
        targetBeginningProgress = 0.18;
    }

    function renderSpeakersAutoAnimation(now) {
        const progress = clamp((now - startTime) / duration, 0, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);

        speakersRenderedProgress = mix(startProgress, 1, easedProgress);
        speakersTargetProgress = speakersRenderedProgress;
        renderSpeakersImages(speakersRenderedProgress, false);
        renderHeroContentExit(speakersRenderedProgress);
        renderHeroMediaExit(speakersRenderedProgress);
        renderSpeakersTransitionBackground(speakersRenderedProgress);
        window.scrollTo(0, mix(startScrollY, targetScrollY, easedProgress));

        if (beginningTextChars.length) {
            beginningTextRenderedProgress = mix(startBeginningProgress, targetBeginningProgress, easedProgress);
            beginningTextTargetProgress = beginningTextRenderedProgress;
            renderBeginningTextProgress(beginningTextRenderedProgress);
        }

        if (progress < 1) {
            speakersAutoAnimationFrame = requestAnimationFrame(renderSpeakersAutoAnimation);
            return;
        }

        speakersRenderedProgress = 1;
        speakersTargetProgress = 1;
        speakersPreviousTargetProgress = 1;
        renderSpeakersImages(1, false);
        renderHeroContentExit(1);
        renderHeroMediaExit(1);
        renderSpeakersTransitionBackground(1);

        if (beginningTextChars.length) {
            beginningTextRenderedProgress = targetBeginningProgress;
            beginningTextTargetProgress = targetBeginningProgress;
            renderBeginningTextProgress(targetBeginningProgress);
        }

        window.scrollTo(0, targetScrollY);

        speakersAutoAnimationFrame = null;
        requestAnimationFrame(() => {
            speakersIsAutoAnimating = false;
            updateScrollEffects();
        });
    }

    speakersAutoAnimationFrame = requestAnimationFrame(renderSpeakersAutoAnimation);
}

function animateSpeakersEntryToEnd() {
    if (!heroStage || !speakersStage || !speakersGrid || speakersEntryIsAutoAnimating) return;

    const heroRect = heroStage.getBoundingClientRect();
    const speakersRect = speakersStage.getBoundingClientRect();
    const heroScrollDistance = Math.max(heroStage.offsetHeight - window.innerHeight, 1);
    const startProgress = clamp(-heroRect.top / heroScrollDistance, 0, 1);

    if (startProgress >= 0.98 || speakersRect.top <= 0) return;

    speakersEntryIsAutoAnimating = true;
    speakersGrid.classList.add("is-entry");
    heroAbout?.classList.add("is-speakers-entering");
    renderHeroContentExit(0);
    renderHeroMediaExit(0);
    renderSpeakersTransitionBackground(0);

    if (speakersEntryAutoAnimationFrame) cancelAnimationFrame(speakersEntryAutoAnimationFrame);

    const startTime = performance.now();
    const duration = 950;
    const targetScrollY = heroStage.offsetTop + heroStage.offsetHeight - window.innerHeight + 1;

    function renderSpeakersEntryAutoAnimation(now) {
        const progress = clamp((now - startTime) / duration, 0, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);
        const entryProgress = mix(startProgress, 1, easedProgress);

        renderSpeakersEntry(entryProgress);
        renderHeroContentExit(0);
        renderHeroMediaExit(0);
        renderSpeakersTransitionBackground(0);

        if (progress < 1) {
            speakersEntryAutoAnimationFrame = requestAnimationFrame(renderSpeakersEntryAutoAnimation);
            return;
        }

        renderSpeakersEntry(1);
        renderHeroContentExit(0);
        renderHeroMediaExit(0);
        renderSpeakersTransitionBackground(0);
        window.scrollTo(0, targetScrollY);

        speakersEntryAutoAnimationFrame = null;
        requestAnimationFrame(() => {
            speakersEntryIsAutoAnimating = false;
            updateScrollEffects();
        });
    }

    speakersEntryAutoAnimationFrame = requestAnimationFrame(renderSpeakersEntryAutoAnimation);
}

function handleSpeakersWheel(event) {
    if (!speakersStage || !speakersImages.length) return;

    // 히어로: 첫 스크롤 → 조명 켜기
    if (!heroLightsOn && heroStage) {
        const heroRect = heroStage.getBoundingClientRect();
        if (heroRect.top >= -10 && event.deltaY > 0) {
            event.preventDefault();
            triggerHeroLightsOn();
            return;
        }
    }

    // 조명 애니메이션 중 스크롤 잠금
    if (heroLightsAnimating) {
        event.preventDefault();
        return;
    }

    if (speakersEntryIsAutoAnimating) {
        event.preventDefault();
        return;
    }

    if (speakersIsAutoAnimating) {
        event.preventDefault();
        return;
    }

    if (event.deltaY <= 0) return;

    const heroRect = heroStage?.getBoundingClientRect();
    const speakersRect = speakersStage.getBoundingClientRect();
    const heroScrollDistance = heroStage ? Math.max(heroStage.offsetHeight - window.innerHeight, 1) : 1;
    const heroProgress = heroRect ? clamp(-heroRect.top / heroScrollDistance, 0, 1) : 1;
    const isHeroEntryAvailable =
        heroRect &&
        heroLightsOn &&
        heroProgress < 0.98 &&
        heroRect.bottom > 0 &&
        speakersRect.top > 0 &&
        speakersRect.top <= window.innerHeight * 2.5;

    if (isHeroEntryAvailable) {
        event.preventDefault();
        animateSpeakersEntryToEnd();
        return;
    }

    if (speakersRenderedProgress >= 0.98) return;

    const stageRect = speakersRect;
    const isSpeakersStageEntering = stageRect.top < window.innerHeight && stageRect.bottom > 0;

    if (!isSpeakersStageEntering) return;

    event.preventDefault();
    animateSpeakersToEnd();
}

function updateFixedNav() {
    if (!fixedNavSections.length) return;

    const activePoint = window.innerHeight * 0.52;
    let activeSection = fixedNavSections[0];
    let isSignatureActive = false;
    let isLegacyHeroActive = false;
    let isLegacyNavExiting = false;
    let isBeginningSoundActive = false;
    let isDesignSectionActive = false;
    let isEvolutionActive = false;
    let isHeadphoneActive = false;
    let isFinalStageActive = false;

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
            fixedNav?.classList.add("is-speakers-revealed");
            activeSection = fixedNavSections.find(({ link }) => link.getAttribute("href") === "#sound") || activeSection;
        }
    }

    if (soundPanels.length) {
        const activeSoundPanel = Array.from(soundPanels).find((panel) => {
            const panelRect = panel.getBoundingClientRect();
            return panelRect.top <= activePoint && panelRect.bottom > activePoint;
        });

        if (activeSoundPanel) {
            const analogLink = Array.from(fixedNavLinks).find(
                (link) => link.getAttribute("href") === "#analog"
            );

            if (analogLink) {
                activeSection = {
                    link: analogLink,
                    target: activeSoundPanel,
                };
            }
        }
    }

    if (headphoneSequence || headphoneStage || headphoneDetail || soundSpeaker) {
        const headphoneSequenceRect = headphoneSequence?.getBoundingClientRect();
        const headphoneRect = headphoneStage?.getBoundingClientRect();
        const headphoneDetailRect = headphoneDetail?.getBoundingClientRect();
        const soundSpeakerRect = soundSpeaker?.getBoundingClientRect();
        isHeadphoneActive = Boolean(
            (headphoneSequenceRect &&
                headphoneSequenceRect.top <= activePoint &&
                headphoneSequenceRect.bottom > activePoint) ||
            (headphoneRect && headphoneRect.top <= activePoint && headphoneRect.bottom > activePoint) ||
            (headphoneDetailRect &&
                headphoneDetailRect.top <= activePoint &&
                headphoneDetailRect.bottom > activePoint) ||
            (soundSpeakerRect &&
                soundSpeakerRect.top <= activePoint &&
                soundSpeakerRect.bottom > activePoint)
        );

        if (isHeadphoneActive) {
            activeSection = fixedNavSections.find(({ link }) => link.getAttribute("href") === "#sound") || activeSection;
        }
    }

    if (evolutionStage) {
        const evolutionRect = evolutionStage.getBoundingClientRect();
        isEvolutionActive = evolutionRect.top <= activePoint && evolutionRect.bottom > activePoint;

        if (isEvolutionActive) {
            activeSection = fixedNavSections.find(({ link }) => link.getAttribute("href") === "#evolution") || activeSection;
        }
    }

    if (legacyHero) {
        const legacyHeroRect = legacyHero.getBoundingClientRect();
        isLegacyHeroActive = legacyHeroRect.top <= activePoint && legacyHeroRect.bottom > activePoint;

        if (isLegacyHeroActive) {
            const legacyLink = Array.from(fixedNavLinks).find((link) => link.getAttribute("href") === "#legacy");

            if (legacyLink) {
                activeSection = {
                    link: legacyLink,
                    target: legacyHero,
                };
            }
        }
    }

    if (legacyStatement) {
        const legacyStatementRect = legacyStatement.getBoundingClientRect();
        const isLegacyStatementActive =
            legacyStatementRect.top <= activePoint && legacyStatementRect.bottom > activePoint;
        isLegacyHeroActive = isLegacyHeroActive || isLegacyStatementActive;

        if (isLegacyStatementActive) {
            const legacyLink = Array.from(fixedNavLinks).find((link) => link.getAttribute("href") === "#legacy");

            if (legacyLink) {
                activeSection = {
                    link: legacyLink,
                    target: legacyStatement,
                };
            }
        }
    }

    if (legacyClosing) {
        const legacyClosingRect = legacyClosing.getBoundingClientRect();
        const isLegacyClosingActive =
            legacyClosingRect.top <= activePoint && legacyClosingRect.bottom > activePoint;
        isLegacyHeroActive = isLegacyHeroActive || isLegacyClosingActive;
        isLegacyNavExiting = isLegacyClosingActive;

        if (isLegacyClosingActive) {
            const legacyLink = Array.from(fixedNavLinks).find((link) => link.getAttribute("href") === "#legacy");

            if (legacyLink) {
                activeSection = {
                    link: legacyLink,
                    target: legacyClosing,
                };
            }
        }
    }

    if (finale) {
        const finaleRect = finale.getBoundingClientRect();
        isFinalStageActive = finaleRect.top <= activePoint;
        isLegacyNavExiting = isLegacyNavExiting || isFinalStageActive;
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

    if (designSound || designSticky) {
        const designSoundRect = designSound?.getBoundingClientRect();
        const designStickyRect = designSticky?.getBoundingClientRect();
        isDesignSectionActive = !isEvolutionActive && Boolean(
            (designSoundRect &&
                designSoundRect.top <= activePoint &&
                designSoundRect.bottom > activePoint) ||
            (designStickyRect &&
                designStickyRect.top <= activePoint &&
                designStickyRect.bottom > activePoint)
        );
        isBeginningSoundActive = isDesignSectionActive;

        if (isDesignSectionActive) {
            const designLink = Array.from(fixedNavLinks).find(
                (link) => link.getAttribute("href") === "#design"
            );

            if (designLink) {
                activeSection = {
                    link: designLink,
                    target: designSticky || designSound,
                };
            }
        }
    }

    if (fixedNav && activeSection.link) {
        fixedNav.style.setProperty("--fixed-nav-indicator-top", `${activeSection.link.offsetTop}px`);
        fixedNav.classList.toggle("is-design-section", isBeginningSoundActive);
        fixedNav.classList.toggle("is-legacy-exiting", isLegacyNavExiting);
    }

    fixedUi?.classList.toggle("is-design-section", isDesignSectionActive);

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

        fixedUi.classList.toggle("is-headphone-stage", isHeadphoneActive);
        fixedUi.classList.toggle("is-final-stage", isFinalStageActive);
    }
}

function updateDesignCopyScroll() {
    if (!designSound || !designTextFlowInner || !designCopyTrack || !designCopyOne || !designCopyTwo) return;

    const soundRect = designSound.getBoundingClientRect();
    const copyScrollDistance = window.innerHeight * 1.65;
    const textProgress = clamp(-soundRect.top / copyScrollDistance, 0, 1);
    const easedTextProgress = textProgress * textProgress * (3 - 2 * textProgress);
    const trackEnd = -(designCopyTrack.offsetTop + designCopyTrack.offsetHeight + window.innerHeight * 0.16);
    const trackMove = easedTextProgress * trackEnd;

    designTextFlowInner.style.transform = `translate3d(0, ${trackMove}px, 0)`;
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
    updateSoundKnobs(isPinned || isEnded);

    if (fixedUi) {
        fixedUi.classList.toggle("is-sound-content", isSoundVisible && progress > 0.08);
        fixedUi.classList.toggle("is-sound-horizontal", isSoundVisible);
    }
}

function updateSoundKnobs(isTuned) {
    soundChannels.forEach((channel) => {
        const level = isTuned ? channel.dataset.endLevel : "100";
        const knob = channel.querySelector(".sound-channel__knob");

        if (!level) return;

        channel.style.setProperty("--level", `${level}%`);
        knob?.setAttribute("aria-valuenow", `${100 - Number(level)}`);
    });
}

function initializeSoundLightRays() {
    if (!soundLightRays || !window.SoundLightRays) return;

    try {
        const lightRays = new window.SoundLightRays(soundLightRays, {
            origin: "left",
            color: "#ffffff",
            speed: 1,
            spread: 0.2,
            length: 1.8,
            fadeDistance: 0.9,
            saturation: 0.1,
            mouseInfluence: 0.42,
            noiseAmount: 0.1,
            distortion: 0.05,
            sweepAmount: 0.22,
            sweepSpeed: 0.55,
        });

        lightRays.init();
    } catch (error) {
        console.warn("Sound light rays failed to initialize:", error);
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

function updateSoundSpeakerSequence() {
    if (!soundSpeaker || !soundSpeakerSticky) return;

    const sequenceRect = soundSpeaker.getBoundingClientRect();
    const isPinned = sequenceRect.top <= 0 && sequenceRect.bottom > window.innerHeight;
    const isEnded = sequenceRect.bottom <= window.innerHeight;

    soundSpeakerSticky.classList.toggle("is-pinned", isPinned);
    soundSpeakerSticky.classList.toggle("is-ended", isEnded);
}

function updateLegacyClosingPanels() {
    if (!legacyClosingCopy || !legacyClosingPanels.length || !legacyClosingSteps) return;

    const rect = legacyClosingCopy.getBoundingClientRect();
    const vh = window.innerHeight;
    const triggerStart = vh * 0.2;

    // copy 박스 상단이 뷰포트 10vh에 도달했을 때 시작
    const isActive = rect.top < triggerStart;
    legacyClosingSteps.classList.toggle("is-active", isActive);

    fixedGauge?.classList.toggle("is-legacy-closing", isActive);

    if (!isActive) return;

    // progress: copy.top=0.1vh → 0, copy.top=0.1vh - vh → 1
    const progress = clamp((triggerStart - rect.top) / vh, 0, 1);

    legacyClosingPanels.forEach((panel, index) => {
        const [start, end] = legacyPanelTimings[index] || [0, 1];
        const panelProgress = sequenceProgress(progress, start, end);
        // ease-out: 빠르게 시작 → 느리게 끝
        const easedProgress = 1 - Math.pow(1 - panelProgress, 3);
        legacyPanelTargetY[index] = (1 - easedProgress) * 100;
    });

    if (!legacyPanelAnimationFrame) {
        legacyPanelAnimationFrame = requestAnimationFrame(renderLegacyPanels);
    }
}

function renderLegacyPanels() {
    let isSettled = true;

    legacyClosingPanels.forEach((panel, index) => {
        const distance = legacyPanelTargetY[index] - legacyPanelRenderedY[index];
        legacyPanelRenderedY[index] += distance * 0.05;

        if (Math.abs(distance) < 0.01) {
            legacyPanelRenderedY[index] = legacyPanelTargetY[index];
        } else {
            isSettled = false;
        }

        panel.style.setProperty("--legacy-panel-y", `${legacyPanelRenderedY[index]}vh`);
    });

    legacyPanelAnimationFrame = isSettled ? null : requestAnimationFrame(renderLegacyPanels);
}

function updateLegacySequence() {
    if (!legacySequence || !legacySequenceArt) return;

    const sequenceRect = legacySequence.getBoundingClientRect();
    const isPinned = sequenceRect.top <= 0 && sequenceRect.bottom > window.innerHeight;
    const isEnded = sequenceRect.bottom <= window.innerHeight;

    legacySequenceArt.classList.toggle("is-pinned", isPinned);
    legacySequenceArt.classList.toggle("is-ended", isEnded);
    updateLegacyClosingPanels();
}

function getAngleDistance(angle, targetAngle) {
    const difference = Math.abs(((angle - targetAngle + 540) % 360) - 180);

    return Math.min(difference, 360 - difference);
}

function getClockwiseAngleDistance(angle, targetAngle) {
    return (targetAngle - angle + 360) % 360;
}

function updateFixedGauge() {
    if (!fixedGauge || !fixedGaugeTicks.length) return;

    const finaleStart = finale
        ? window.scrollY + finale.getBoundingClientRect().top
        : document.documentElement.scrollHeight - window.innerHeight;
    const scrollEnd = Math.max(finaleStart, 1);
    const scrollableDistance = Math.max(scrollEnd, 1);
    const scrollProgress = clamp(window.scrollY / scrollableDistance, 0, 1);
    const rotation = scrollProgress * fixedGaugeMaxRotation;
    const dotAngle = (fixedGaugeDotBaseAngle + rotation + 180) % 360;

    fixedGauge.style.setProperty("--fixed-gauge-rotation", `${rotation}deg`);

    fixedGaugeTicks.forEach((tick, index) => {
        const tickAngle = fixedGaugeTickAngles[index];
        const passedDistance = getClockwiseAngleDistance(fixedGaugeStartAngle, tickAngle);
        const hasBeenPassed = passedDistance <= rotation + (index === 5 ? 1 : fixedGaugeActivationRange);
        const isStartingTick = getAngleDistance(fixedGaugeStartAngle, tickAngle) <= fixedGaugeActivationRange;
        const isCurrentTick = getAngleDistance(dotAngle, tickAngle) <= fixedGaugeActivationRange;

        tick.classList.toggle("is-active", isStartingTick || hasBeenPassed || isCurrentTick);
    });
}

function initializeHoverTypewriter(items, options = {}) {
    items.forEach((item) => {
        const fullText = options.dataAttribute
            ? item.dataset[options.dataAttribute] || item.textContent.trim()
            : item.textContent.trim();
        let typeTimer = null;

        if (options.dataAttribute) {
            item.dataset[options.dataAttribute] = fullText;
        }

        if (options.widthProperty) {
            item.style.setProperty(options.widthProperty, `${item.getBoundingClientRect().width}px`);
        }

        if (options.setTabIndex) {
            item.tabIndex = 0;
        }

        const stopTyping = () => {
            if (typeTimer) {
                clearInterval(typeTimer);
                typeTimer = null;
            }
        };

        const restoreText = () => {
            stopTyping();
            item.textContent = fullText;
            item.style.setProperty("--typing-progress", "0%");
            item.classList.remove("is-typing");
        };

        const typeText = () => {
            stopTyping();

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                item.textContent = fullText;
                return;
            }

            let index = 0;

            item.textContent = "";
            item.style.setProperty("--typing-progress", "0%");
            item.classList.add("is-typing");

            typeTimer = window.setInterval(() => {
                index += 1;
                item.textContent = fullText.slice(0, index);
                item.style.setProperty("--typing-progress", `${(index / fullText.length) * 100}%`);

                if (index >= fullText.length) {
                    stopTyping();
                }
            }, 46);
        };

        item.addEventListener("mouseenter", typeText);
        item.addEventListener("focus", typeText);
        item.addEventListener("mouseleave", restoreText);
        item.addEventListener("blur", restoreText);
    });
}

function initializeFinaleCreditTypewriter() {
    initializeHoverTypewriter(finaleCreditItems, {
        dataAttribute: "credit",
        widthProperty: "--credit-width",
        setTabIndex: true,
    });
}

function initializeFixedNavTypewriter() {
    initializeHoverTypewriter(fixedNavLinks, {
        widthProperty: "--nav-link-width",
    });
}

function initializeFinaleTitleSlideDown() {
    if (!finaleTitle) return;

    const text = finaleTitle.textContent;

    finaleTitle.textContent = "";
    finaleTitle.setAttribute("aria-label", text);

    Array.from(text).forEach((letter, index) => {
        const char = document.createElement("span");

        char.className = "char";
        char.style.setProperty("--char-index", index);
        char.textContent = letter;
        char.setAttribute("aria-hidden", "true");
        finaleTitle.appendChild(char);
    });

    const observer = new IntersectionObserver(
        ([entry]) => {
            finaleTitle.classList.toggle("is-visible", entry.isIntersecting);
        },
        { threshold: 0.35 }
    );

    observer.observe(finaleTitle);
}

function updateScrollEffects() {
    updateHeroScroll();
    updateSpeakersTransition();
    updateBeginningTextReveal();
    updateBeginningArtReveal();
    updateDesignCopyScroll();
    updateDesignSectionTransition();
    updateFixedNav();
    updateFixedGauge();
    updateSoundHorizontalScroll();
    updateHeadphoneSequence();
    updateHeadphoneArtReveal();
    updateSoundSpeakerSequence();
    updateSoundSpeakerArtReveal();
    updateLegacySequence();
}

// Hero year slot machine animation
(function () {
    var yearEl = document.querySelector(".hero__year");
    if (!yearEl) return;
    var slotEls = Array.from(yearEl.querySelectorAll(".hero__year-slot"));
    if (!slotEls.length) return;

    var entranceOffsets = [-7.5, -8.5, -6.5, -7.25];
    var entranceSlots = slotEls.map(function (slot, index) {
        return {
            strip: slot.querySelector(".hero__year-strip"),
            start: Number(slot.dataset.start) || 0,
            dir: slot.dataset.dir || "up",
            progress: entranceOffsets[index] || -7,
        };
    });
    var entranceDigitH = 0;
    var entranceFrame = null;
    var entrancePlayed = false;

    function getEntranceDigitH() {
        var span = slotEls[0].querySelector(".hero__year-strip > span");
        return span ? span.offsetHeight : 0;
    }

    function renderEntranceYear() {
        if (!entranceDigitH) entranceDigitH = getEntranceDigitH();
        if (!entranceDigitH) return;

        entranceSlots.forEach(function (slot) {
            var rawIndex = slot.dir === "up"
                ? ((slot.start + slot.progress) % 10 + 10) % 10
                : ((slot.start - slot.progress) % 10 + 10) % 10;

            slot.strip.style.transform = "translateY(" + (-rawIndex * entranceDigitH) + "px)";
        });
    }

    function finishEntranceYear() {
        entranceSlots.forEach(function (slot) { slot.progress = 0; });
        renderEntranceYear();
        entranceFrame = null;
    }

    function playEntranceYear() {
        if (entrancePlayed) return;
        entrancePlayed = true;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            finishEntranceYear();
            return;
        }

        function animateEntranceYear() {
            var allDone = true;

            entranceSlots.forEach(function (slot) {
                var diff = -slot.progress;

                if (Math.abs(diff) < 0.004) {
                    slot.progress = 0;
                } else {
                    slot.progress += diff * 0.055;
                    allDone = false;
                }
            });

            renderEntranceYear();

            if (allDone) {
                finishEntranceYear();
                return;
            }

            entranceFrame = requestAnimationFrame(animateEntranceYear);
        }

        if (entranceFrame) cancelAnimationFrame(entranceFrame);
        entranceFrame = requestAnimationFrame(animateEntranceYear);
    }

    requestAnimationFrame(function () {
        entranceDigitH = getEntranceDigitH();
        renderEntranceYear();
        requestAnimationFrame(playEntranceYear);
    });

    if ("IntersectionObserver" in window) {
        var entranceObserver = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            entranceObserver.disconnect();
            playEntranceYear();
        }, { threshold: 0.35 });

        entranceObserver.observe(yearEl);
    }

    return;

    // targetMod: 각 슬롯이 2026을 표시하기 위한 progress % 10 값
    var SLOTS = [
        { el: slotEls[0], start: 1, dir: "up",   targetMod2026: 1,  targetMod1962: 0 },
        { el: slotEls[1], start: 9, dir: "down",  targetMod2026: 9,  targetMod1962: 0 },
        { el: slotEls[2], start: 6, dir: "up",    targetMod2026: 6,  targetMod1962: 0 },
        { el: slotEls[3], start: 2, dir: "down",  targetMod2026: 6,  targetMod1962: 0 },
    ];
    SLOTS.forEach(function (s) {
        s.strip = s.el.querySelector(".hero__year-strip");
        s.progress = 0;
        s.velocity = 0;
        s.settleTarget = null;
    });

    var settling = false;
    var settledModKey = "targetMod1962";
    var activeSettleModKey = null;
    var animFrame = null;
    var digitH = 0;
    var lastScrollY = window.scrollY;

    function getDigitH() {
        var span = slotEls[0].querySelector(".hero__year-strip > span");
        return span ? span.offsetHeight : 0;
    }

    function updateYear() {
        if (!digitH) digitH = getDigitH();
        if (!digitH) return;
        SLOTS.forEach(function (s) {
            var rawIndex = s.dir === "up"
                ? ((s.start + s.progress) % 10 + 10) % 10
                : ((s.start - s.progress) % 10 + 10) % 10;
            s.strip.style.transform = "translateY(" + (-rawIndex * digitH) + "px)";
        });
    }

    function nearestSettleTarget(currentProgress, targetMod, modKey) {
        var currentMod = ((currentProgress % 10) + 10) % 10;
        var delta = modKey === "targetMod1962"
            ? -((currentMod - targetMod + 10) % 10)
            : (targetMod - currentMod + 10) % 10;
        return currentProgress + delta;
    }

    function stopAndClear() {
        settling = false;
        settledModKey = null;
        activeSettleModKey = null;
        if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
        SLOTS.forEach(function (s) { s.velocity = 0; s.settleTarget = null; });
    }

    function startSettle(modKey) {
        if (!settling && settledModKey === modKey) return;
        settling = true;
        settledModKey = null;
        activeSettleModKey = modKey;
        SLOTS.forEach(function (s) {
            s.settleTarget = nearestSettleTarget(s.progress, s[modKey], modKey);
            s.velocity = 0;
        });
        if (animFrame) cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(animateSettle);
    }

    function animateSpin() {
        if (settling) { animFrame = null; return; }
        var anyMoving = SLOTS.some(function (s) { return Math.abs(s.velocity) >= 0.001; });
        if (!anyMoving) {
            SLOTS.forEach(function (s) { s.velocity = 0; });
            animFrame = null;
            return;
        }
        SLOTS.forEach(function (s) {
            s.progress += s.velocity;
            s.velocity *= 0.9;
        });
        updateYear();
        animFrame = requestAnimationFrame(animateSpin);
    }

    function applyScrollSpin(scrollDelta) {
        if (!scrollDelta) return;
        if (settling) stopAndClear();
        settledModKey = null;
        SLOTS.forEach(function (s) { s.velocity += scrollDelta * 0.006; });
        if (!animFrame) animFrame = requestAnimationFrame(animateSpin);
    }

    function animateSettle() {
        if (!settling) { animFrame = null; return; }
        var allDone = true;
        SLOTS.forEach(function (s) {
            if (s.settleTarget === null) return;
            var diff = s.settleTarget - s.progress;
            if (Math.abs(diff) < 0.005) {
                s.progress = s.settleTarget;
            } else {
                s.progress += diff * 0.45;
                allDone = false;
            }
        });
        updateYear();
        if (!allDone) {
            animFrame = requestAnimationFrame(animateSettle);
        } else {
            settling = false;
            settledModKey = activeSettleModKey;
            activeSettleModKey = null;
            animFrame = null;
        }
    }

    window.addEventListener("scroll", function () {
        if (!heroStage || !speakersStage) return;
        var currentScrollY = window.scrollY;
        var scrollDelta = currentScrollY - lastScrollY;
        var scrollingUp = currentScrollY < lastScrollY;
        lastScrollY = currentScrollY;
        var speakersRect = speakersStage.getBoundingClientRect();

        if (currentScrollY === 0) {
            // 최상단: 현재 위치에서 1962로 수렴
            var needsSettle = SLOTS.some(function (s) {
                return Math.abs(((s.progress % 10) + 10) % 10) > 0.01;
            });
            if (needsSettle) {
                stopAndClear();
                startSettle("targetMod1962");
            }
            return;
        }

        if (heroLightsOn && !heroLightsAnimating && speakersRect.top < window.innerHeight * 2.5) {
            // 다음 섹션 진입: 2026으로 수렴
            var isReturningToHeroStart = scrollingUp && speakersRect.top > window.innerHeight * 1.8;
            var targetModKey = isReturningToHeroStart ? "targetMod1962" : "targetMod2026";
            if (scrollingUp && !isReturningToHeroStart) {
                applyScrollSpin(scrollDelta);
                return;
            }
            if (!settling || activeSettleModKey !== targetModKey) startSettle(targetModKey);
        } else {
            // 히어로 구간으로 돌아옴: settling 해제 → 스핀 허용
            if (settling) stopAndClear();
        }
    }, { passive: true });

    window.addEventListener("wheel", function (e) {
        if (!heroStage || !speakersStage) return;
        var rect = heroStage.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        if (!heroLightsOn || heroLightsAnimating) return;
        if (settling) return; // settle 중에는 휠 무시
        var delta = e.deltaY * 0.006;
        settledModKey = null;
        SLOTS.forEach(function (s) { s.velocity += delta; });
        if (!animFrame) animFrame = requestAnimationFrame(animateSpin);
    }, { passive: true });

    requestAnimationFrame(function () {
        digitH = getDigitH();
        updateYear();
    });
})();

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("wheel", handleSpeakersWheel, { passive: false });
window.addEventListener("resize", updateScrollEffects);
beginningScrollArt?.addEventListener("load", () => {
    prepareBeginningArtPaths();
    updateBeginningArtReveal();
});
initializeSoundLightRays();
initializeFinaleCreditTypewriter();
initializeFixedNavTypewriter();
initializeFinaleTitleSlideDown();
headphoneStageArt?.addEventListener("load", () => {
    prepareHeadphoneArtPaths();
    updateHeadphoneArtReveal();
});
soundSpeakerArt?.addEventListener("load", () => {
    prepareSoundSpeakerArtPaths();
    updateSoundSpeakerArtReveal();
});
prepareBeginningText();
updateScrollEffects();
