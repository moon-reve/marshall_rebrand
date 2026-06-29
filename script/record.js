(() => {
    const hero = document.querySelector(".record-hero");

    if (!hero) {
        return;
    }

    let startX = 0;
    let isDragging = false;
    let slideIndex = 0;
    let autoTimer = 0;

    const slides = hero.querySelectorAll(".record-hero__slide");
    const prevButton = hero.querySelector(".record-hero__arrow--prev");
    const nextButton = hero.querySelector(".record-hero__arrow--next");

    const moveToFirstSlide = () => {
        const panel = hero.querySelector(".record-hero__panel--main");
        const marketSlide = hero.querySelector(".record-hero__slide--market");
        const studioSlide = hero.querySelector(".record-hero__slide--studio");

        panel.style.transition = "none";
        panel.style.transform = "translateX(100%)";
        marketSlide.style.transition = "none";
        marketSlide.style.transform = "translateX(200%)";

        hero.getBoundingClientRect();

        setSlide(0);

        requestAnimationFrame(() => {
            panel.style.transition = "";
            marketSlide.style.transition = "";
            studioSlide.style.transform = "translateX(-100%)";
            panel.style.transform = "";

            setTimeout(() => {
                marketSlide.style.transition = "none";
                marketSlide.style.transform = "";
                studioSlide.style.transition = "none";
                studioSlide.style.transform = "";
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        marketSlide.style.transition = "";
                        studioSlide.style.transition = "";
                    });
                });
            }, 850);
        });
    };

    const moveToLastSlide = () => {
        const panel = hero.querySelector(".record-hero__panel--main");
        const marketSlide = hero.querySelector(".record-hero__slide--market");
        const studioSlide = hero.querySelector(".record-hero__slide--studio");

        studioSlide.style.transition = "none";
        studioSlide.style.transform = "translateX(-100%)";
        marketSlide.style.transition = "none";
        marketSlide.style.transform = "translateX(200%)";

        hero.getBoundingClientRect();

        requestAnimationFrame(() => {
            panel.style.transform = "translateX(100%)";
            studioSlide.style.transition = "";
            studioSlide.style.transform = "translateX(0)";

            setTimeout(() => {
                panel.style.transition = "none";
                panel.style.transform = "";
                marketSlide.style.transform = "";
                studioSlide.style.transition = "none";
                studioSlide.style.transform = "";

                setSlide(slides.length);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        panel.style.transition = "";
                        marketSlide.style.transition = "";
                        studioSlide.style.transition = "";
                    });
                });
            }, 850);
        });
    };

    const setSlide = (nextIndex) => {
        slideIndex = Math.max(0, Math.min(slides.length, nextIndex));
        hero.classList.toggle("is-slide-market", slideIndex === 1);
        hero.classList.toggle("is-slide-studio", slideIndex === 2);

        slides.forEach((slide, index) => {
            slide.setAttribute("aria-hidden", String(index + 1 !== slideIndex));
        });
    };

    const scheduleAutoSlide = () => {
        window.clearTimeout(autoTimer);
        autoTimer = window.setTimeout(() => {
            if (slideIndex === slides.length) {
                moveToFirstSlide();
            } else {
                setSlide(slideIndex + 1);
            }

            scheduleAutoSlide();
        }, 3500);
    };

    const moveNext = () => {
        if (slideIndex === slides.length) {
            moveToFirstSlide();
        } else {
            setSlide(slideIndex + 1);
        }
    };

    const movePrev = () => {
        if (slideIndex === 0) {
            moveToLastSlide();
        } else {
            setSlide(slideIndex - 1);
        }
    };

    hero.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        startX = event.clientX;
        window.clearTimeout(autoTimer);
    });

    hero.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        const deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0 && slideIndex === slides.length) {
                moveToFirstSlide();
            } else {
                if (deltaX < 0) {
                    moveNext();
                } else {
                    movePrev();
                }
            }
        }

        scheduleAutoSlide();
    });

    hero.addEventListener("pointerleave", () => {
        isDragging = false;
    });

    hero.addEventListener("pointercancel", () => {
        isDragging = false;
        scheduleAutoSlide();
    });

    prevButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        window.clearTimeout(autoTimer);
        movePrev();
        scheduleAutoSlide();
    });

    nextButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        window.clearTimeout(autoTimer);
        moveNext();
        scheduleAutoSlide();
    });

    prevButton?.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
    });

    nextButton?.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
    });

    scheduleAutoSlide();
})();

(() => {
    const hero = document.querySelector(".record-hero");

    if (!hero) {
        return;
    }

    const columnTargets = [
        { element: hero.querySelector(".record-hero__panel--main"), modifier: "main" },
        { element: hero.querySelector(".record-hero__slide--market"), modifier: "market" },
        { element: hero.querySelector(".record-hero__slide--studio"), modifier: "studio" },
    ].filter(({ element }) => element);
    const timings = [
        [0, 0.56],
        [0.08, 0.66],
        [0.24, 0.82],
        [0.4, 0.96],
    ];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetProgress = 0;
    let renderedProgress = 0;
    let animationFrame = 0;
    const columnGrids = [];
    const copyBlocks = columnTargets
        .map(({ element }) => element.querySelector(".record-hero__copy, .record-hero__slide-copy"))
        .filter(Boolean);

    const createColumnGrid = (modifier) => {
        const columnGrid = document.createElement("div");

        columnGrid.className = `record-hero__column-grid record-hero__column-grid--${modifier}`;
        columnGrid.setAttribute("aria-hidden", "true");

        timings.forEach((_, index) => {
            const column = document.createElement("div");
            const scene = document.createElement("div");

            column.className = `record-hero__scroll-column record-hero__scroll-column--0${index + 1}`;
            scene.className = "record-hero__column-scene";
            column.appendChild(scene);
            columnGrid.appendChild(column);
        });

        return columnGrid;
    };

    columnTargets.forEach(({ element, modifier }) => {
        const columnGrid = createColumnGrid(modifier);

        element.prepend(columnGrid);
        columnGrids.push(columnGrid);
    });

    hero.classList.add("is-column-scroll-ready");

    const columns = columnGrids.flatMap((columnGrid) => Array.from(columnGrid.querySelectorAll(".record-hero__scroll-column")));
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const sequenceProgress = (progress, start, end) => clamp((progress - start) / (end - start), 0, 1);
    const ease = (progress) => progress * progress * (3 - 2 * progress);

    const renderColumns = (progress) => {
        const gridProgress = ease(sequenceProgress(progress, 0, 0.45));
        const copyProgress = ease(sequenceProgress(progress, 0, 0.62));
        const copyOffset = copyProgress * 42;
        const copyOpacity = 1 - copyProgress;

        columnGrids.forEach((columnGrid) => {
            columnGrid.style.setProperty("--record-hero-grid-opacity", `${1 - gridProgress}`);
        });

        copyBlocks.forEach((copyBlock) => {
            copyBlock.style.setProperty("--record-hero-copy-y", `${-copyOffset}vh`);
            copyBlock.style.setProperty("--record-hero-copy-opacity", `${copyOpacity}`);
        });

        columns.forEach((column, index) => {
            const [start, end] = timings[index % timings.length];
            const columnProgress = ease(sequenceProgress(progress, start, end));

            const sceneOffset = columnProgress * 50;

            column.style.setProperty("--record-hero-column-y", `${-sceneOffset}%`);
        });
    };

    const renderFrame = () => {
        const distance = targetProgress - renderedProgress;
        renderedProgress += distance * 0.085;

        if (Math.abs(distance) < 0.0001) {
            renderedProgress = targetProgress;
        }

        renderColumns(renderedProgress);

        if (renderedProgress !== targetProgress) {
            animationFrame = requestAnimationFrame(renderFrame);
        } else {
            animationFrame = 0;
        }
    };

    const updateColumns = () => {
        const rect = hero.getBoundingClientRect();
        const revealStart = Math.max(rect.height - window.innerHeight, 0);
        const scrollDistance = Math.max(window.innerHeight * 0.72, rect.height * 0.5, 1);

        targetProgress = clamp((-rect.top - revealStart) / scrollDistance, 0, 1);

        if (prefersReducedMotion.matches) {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            animationFrame = 0;
            renderedProgress = targetProgress;
            renderColumns(renderedProgress);
            return;
        }

        if (!animationFrame) {
            animationFrame = requestAnimationFrame(renderFrame);
        }
    };

    window.addEventListener("scroll", updateColumns, { passive: true });
    window.addEventListener("resize", updateColumns);
    updateColumns();
})();

(() => {
    const list = document.querySelector(".artist-catalog__list");

    if (!list) {
        return;
    }

    const visibleCount = 4;
    const cards = list.querySelectorAll(".artist-card");
    const prevButton = document.querySelector(".artist-catalog__arrow--prev");
    const nextButton = document.querySelector(".artist-catalog__arrow--next");
    let startX = 0;
    let isDragging = false;
    let slideIndex = 0;
    const maxIndex = Math.max(0, cards.length - visibleCount);
    const cloneCount = maxIndex > 0 ? Math.min(visibleCount, cards.length) : 0;

    if (cloneCount > 0) {
        const leadingClones = document.createDocumentFragment();
        const trailingClones = document.createDocumentFragment();
        Array.from(cards)
            .slice(-cloneCount)
            .forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                leadingClones.appendChild(clone);
            });
        Array.from(cards)
            .slice(0, cloneCount)
            .forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                trailingClones.appendChild(clone);
            });
        list.insertBefore(leadingClones, list.firstChild);
        list.appendChild(trailingClones);
    }

    const updateArrowState = () => {};

    const setTrackPosition = (nextIndex) => {
        list.style.setProperty("--artist-slide-index", nextIndex);
    };

    const setSlide = (nextIndex) => {
        slideIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        setTrackPosition(slideIndex + cloneCount);
        updateArrowState();
    };

    const jumpToSlide = (nextIndex) => {
        list.style.transition = "none";
        setSlide(nextIndex);
        list.getBoundingClientRect();
        requestAnimationFrame(() => {
            list.style.transition = "";
        });
    };

    const movePrev = () => {
        if (slideIndex !== 0 || cloneCount === 0) {
            setSlide(slideIndex - visibleCount);
            return;
        }

        setTrackPosition(0);
        slideIndex = maxIndex;

        list.addEventListener(
            "transitionend",
            (event) => {
                if (event.target === list && event.propertyName === "transform") {
                    jumpToSlide(slideIndex);
                }
            },
            { once: true }
        );
    };

    const moveNext = () => {
        if (slideIndex !== maxIndex || cloneCount === 0) {
            setSlide(slideIndex + visibleCount);
            return;
        }

        setTrackPosition(cloneCount + cards.length);
        slideIndex = 0;

        list.addEventListener(
            "transitionend",
            (event) => {
                if (event.target === list && event.propertyName === "transform") {
                    jumpToSlide(slideIndex);
                }
            },
            { once: true }
        );
    };

    list.addEventListener("pointerdown", (event) => {
        isDragging = true;
        startX = event.clientX;
        list.classList.add("is-dragging");
        list.setPointerCapture(event.pointerId);
    });

    list.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        list.classList.remove("is-dragging");
        const deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 40) {
            setSlide(slideIndex + (deltaX < 0 ? visibleCount : -visibleCount));
        }
    });

    list.addEventListener("pointercancel", () => {
        isDragging = false;
        list.classList.remove("is-dragging");
    });

    prevButton?.addEventListener("click", () => {
        movePrev();
    });

    nextButton?.addEventListener("click", () => {
        moveNext();
    });

    jumpToSlide(0);
})();

(() => {
    const cover = document.querySelector(".record-feature__cover");

    if (!cover) {
        return;
    }

    const track = cover.querySelector(".record-feature__cover-track");
    const items = cover.querySelectorAll("img");
    const detail = document.querySelector(".record-detail");
    const detailTitle = detail?.querySelector("h3");
    const detailDescription = detail?.querySelector("p");
    const detailValues = detail?.querySelectorAll("dd");
    const prevButton = document.querySelector(".record-feature__cover-arrow--prev");
    const nextButton = document.querySelector(".record-feature__cover-arrow--next");
    let startX = 0;
    let isDragging = false;
    let coverIndex = 0;
    let detailTimer = 0;
    const maxIndex = Math.max(0, items.length - 1);
    const cloneCount = maxIndex > 0 ? 1 : 0;
    const coverDetails = [
        {
            title: "Wasted On Youth",
            description: "The Molotovs의 날카로운 에너지와 선명한 기타 사운드를 담은 Marshall Records 릴리즈입니다.",
            values: ["Blue Vinyl", "2024", "The Molotovs"],
        },
        {
            title: "Green Vinyl",
            description: "거친 질감의 커버 이미지와 그린 바이닐이 강렬하게 맞물리는 한정판 레코드입니다.",
            values: ["Green Vinyl", "2024", "Marshall Records"],
        },
        {
            title: "Nova Twins",
            description: "Nova Twins의 대담한 비주얼과 묵직한 사운드를 청록빛 바이닐로 담아낸 레코드입니다.",
            values: ["Teal Vinyl", "2024", "Nova Twins"],
        },
        {
            title: "Living The Blues",
            description: "Terry Marshall and Friends의 블루스 감성을 블랙 바이닐에 담은 클래식한 릴리즈입니다.",
            values: ["Black Vinyl", "2024", "Terry Marshall"],
        },
    ];

    const coverDetailsSafe = [
        {
            title: "Wasted On Youth",
            description: "The Molotovs의 날카로운 에너지와 선명한 기타 사운드를 담은 Marshall Records 릴리즈입니다.",
            values: ["Blue Vinyl", "2024", "The Molotovs"],
        },
        {
            title: "Green Vinyl",
            description: "거친 질감의 커버 이미지와 그린 바이닐이 강렬하게 맞물리는 한정판 레코드입니다.",
            values: ["Green Vinyl", "2024", "Marshall Records"],
        },
        {
            title: "Nova Twins",
            description: "Nova Twins의 대담한 비주얼과 묵직한 사운드를 청록빛 바이닐로 담아낸 레코드입니다.",
            values: ["Teal Vinyl", "2024", "Nova Twins"],
        },
        {
            title: "Living The Blues",
            description: "Terry Marshall and Friends의 블루스 감성을 블랙 바이닐에 담은 클래식한 릴리즈입니다.",
            values: ["Black Vinyl", "2024", "Terry Marshall"],
        },
    ];

    coverDetailsSafe[0] = {
        title: "Wasted On Youth",
        description: "The Molotovs의 날카로운 에너지와 선명한 기타 사운드를 담은 Marshall Records 릴리즈입니다.",
        values: ["Guitar Amplifier", "1962", "The Original Marshall Sound"],
    };

    if (cloneCount > 0) {
        const firstClone = items[0].cloneNode(true);
        const lastClone = items[items.length - 1].cloneNode(true);
        firstClone.setAttribute("aria-hidden", "true");
        lastClone.setAttribute("aria-hidden", "true");
        track.insertBefore(lastClone, track.firstChild);
        track.appendChild(firstClone);
    }

    const updateCoverArrowState = () => {};

    const setTrackPosition = (nextIndex) => {
        track.style.setProperty("--record-cover-index", nextIndex);
    };

    const updateCoverDetail = (withMotion = true) => {
        const currentDetail = coverDetailsSafe[coverIndex];

        if (!currentDetail || !detailTitle || !detailDescription || !detailValues) {
            return;
        }

        window.clearTimeout(detailTimer);

        if (!withMotion) {
            detailTitle.textContent = currentDetail.title;
            detailDescription.textContent = currentDetail.description;
            currentDetail.values.forEach((value, index) => {
                if (detailValues[index]) {
                    detailValues[index].textContent = value;
                }
            });
            return;
        }

        detail.classList.add("is-changing");

        detailTimer = window.setTimeout(() => {
            detailTitle.textContent = currentDetail.title;
            detailDescription.textContent = currentDetail.description;
            currentDetail.values.forEach((value, index) => {
                if (detailValues[index]) {
                    detailValues[index].textContent = value;
                }
            });

            requestAnimationFrame(() => {
                detail.classList.remove("is-changing");
            });
        }, 300);
    };

    const setCover = (nextIndex, withMotion = true) => {
        coverIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        setTrackPosition(coverIndex + cloneCount);
        updateCoverArrowState();
        updateCoverDetail(withMotion);
    };

    const jumpToCover = (nextIndex) => {
        track.style.transition = "none";
        setCover(nextIndex, false);
        track.getBoundingClientRect();
        requestAnimationFrame(() => {
            track.style.transition = "";
        });
    };

    const movePrev = () => {
        if (coverIndex !== 0 || cloneCount === 0) {
            setCover(coverIndex - 1);
            return;
        }

        setTrackPosition(0);
        coverIndex = maxIndex;
        updateCoverArrowState();
        updateCoverDetail();

        track.addEventListener(
            "transitionend",
            (event) => {
                if (event.target === track && event.propertyName === "transform") {
                    jumpToCover(coverIndex);
                }
            },
            { once: true }
        );
    };

    const moveNext = () => {
        if (coverIndex !== maxIndex || cloneCount === 0) {
            setCover(coverIndex + 1);
            return;
        }

        setTrackPosition(cloneCount + items.length);
        coverIndex = 0;
        updateCoverArrowState();
        updateCoverDetail();

        track.addEventListener(
            "transitionend",
            (event) => {
                if (event.target === track && event.propertyName === "transform") {
                    jumpToCover(coverIndex);
                }
            },
            { once: true }
        );
    };

    cover.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        startX = event.clientX;
        cover.classList.add("is-dragging");
        cover.setPointerCapture(event.pointerId);
    });

    cover.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        cover.classList.remove("is-dragging");
        const deltaX = event.clientX - startX;

        if (deltaX < -40) {
            setCover(coverIndex + 1);
        } else if (deltaX > 40) {
            setCover(coverIndex - 1);
        }
    });

    cover.addEventListener("pointercancel", () => {
        isDragging = false;
        cover.classList.remove("is-dragging");
    });

    prevButton?.addEventListener("click", () => {
        movePrev();
    });

    nextButton?.addEventListener("click", () => {
        moveNext();
    });

    jumpToCover(0);
})();
