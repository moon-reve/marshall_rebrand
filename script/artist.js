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
    const list = document.querySelector(".artist-catalog__list");

    if (!list) {
        return;
    }

    const visibleCount = 4;
    const cards = list.querySelectorAll(".artist-card");
    let startX = 0;
    let isDragging = false;
    let slideIndex = 0;
    const maxIndex = Math.max(0, cards.length - visibleCount);

    const setSlide = (nextIndex) => {
        slideIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        list.style.setProperty("--artist-slide-index", slideIndex);
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
            setSlide(slideIndex + (deltaX < 0 ? 1 : -1));
        }
    });

    list.addEventListener("pointercancel", () => {
        isDragging = false;
        list.classList.remove("is-dragging");
    });
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
    let startX = 0;
    let isDragging = false;
    let coverIndex = 0;
    let detailTimer = 0;
    const maxIndex = Math.max(0, items.length - 1);
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

    const setCover = (nextIndex, withMotion = true) => {
        coverIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        track.style.setProperty("--record-cover-index", coverIndex);

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

    setCover(0, false);
})();
