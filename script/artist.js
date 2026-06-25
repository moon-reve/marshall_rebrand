(() => {
    const hero = document.querySelector(".record-hero");

    if (!hero) {
        return;
    }

    let startX = 0;
    let isDragging = false;
    let slideIndex = 0;

    const slides = hero.querySelectorAll(".record-hero__slide");

    const setSlide = (nextIndex) => {
        slideIndex = Math.max(0, Math.min(slides.length, nextIndex));
        hero.classList.toggle("is-slide-market", slideIndex === 1);
        hero.classList.toggle("is-slide-studio", slideIndex === 2);

        slides.forEach((slide, index) => {
            slide.setAttribute("aria-hidden", String(index + 1 !== slideIndex));
        });
    };

    hero.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        startX = event.clientX;
    });

    hero.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        const deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0 && slideIndex === slides.length) {
                const panel = hero.querySelector(".record-hero__panel--main");
                const marketSlide = hero.querySelector(".record-hero__slide--market");
                const studioSlide = hero.querySelector(".record-hero__slide--studio");

                panel.style.transition = "none";
                panel.style.transform = "translateX(100%)";
                marketSlide.style.transition = "none";

                hero.getBoundingClientRect();

                setSlide(0);

                requestAnimationFrame(() => {
                    panel.style.transition = "";
                    marketSlide.style.transition = "";
                    studioSlide.style.transform = "translateX(-100%)";
                    panel.style.transform = "";

                    setTimeout(() => {
                        studioSlide.style.transition = "none";
                        studioSlide.style.transform = "";
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                studioSlide.style.transition = "";
                            });
                        });
                    }, 850);
                });
            } else {
                setSlide(slideIndex + (deltaX < 0 ? 1 : -1));
            }
        }
    });

    hero.addEventListener("pointerleave", () => {
        isDragging = false;
    });

    hero.addEventListener("pointercancel", () => {
        isDragging = false;
    });
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
            description: "The Molotovs\uc758 \ub0a0\uce74\ub85c\uc6b4 \uc5d0\ub108\uc9c0\uc640 \uc120\uba85\ud55c \uae30\ud0c0 \uc0ac\uc6b4\ub4dc\ub97c \ub2f4\uc740 Marshall Records \ub9b4\ub9ac\uc988\uc785\ub2c8\ub2e4.",
            values: ["Blue Vinyl", "2024", "The Molotovs"],
        },
        {
            title: "Green Vinyl",
            description: "\uac70\uce5c \uc9c8\uac10\uc758 \ucee4\ubc84 \uc774\ubbf8\uc9c0\uc640 \uadf8\ub9b0 \ubc14\uc774\ub2d0\uc774 \uac15\ub82c\ud558\uac8c \ub9de\ubb3c\ub9ac\ub294 \ud55c\uc815\ud310 \ub808\ucf54\ub4dc\uc785\ub2c8\ub2e4.",
            values: ["Green Vinyl", "2024", "Marshall Records"],
        },
        {
            title: "Nova Twins",
            description: "Nova Twins\uc758 \ub300\ub2f4\ud55c \ube44\uc8fc\uc5bc\uacfc \ubb35\uc9c1\ud55c \uc0ac\uc6b4\ub4dc\ub97c \uccad\ub85d\ube5b \ubc14\uc774\ub2d0\ub85c \ub2f4\uc544\ub0b8 \ub808\ucf54\ub4dc\uc785\ub2c8\ub2e4.",
            values: ["Teal Vinyl", "2024", "Nova Twins"],
        },
        {
            title: "Living The Blues",
            description: "Terry Marshall and Friends\uc758 \ube14\ub8e8\uc2a4 \uac10\uc131\uc744 \ube14\ub799 \ubc14\uc774\ub2d0\uc5d0 \ub2f4\uc740 \ud074\ub798\uc2dd\ud55c \ub9b4\ub9ac\uc988\uc785\ub2c8\ub2e4.",
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
