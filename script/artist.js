(() => {
    const hero = document.querySelector(".record-hero");

    if (!hero) {
        return;
    }

    let startX = 0;
    let isDragging = false;
    let slideIndex = 0;

    const updateSlide = () => {
        hero.classList.toggle("is-slide-next", slideIndex === 1);
        hero.classList.toggle("is-slide-tools", slideIndex === 2);
    };

    const showNext = () => {
        slideIndex = Math.min(2, slideIndex + 1);
        updateSlide();
    };

    const showPrev = () => {
        slideIndex = Math.max(0, slideIndex - 1);
        updateSlide();
    };

    hero.addEventListener(
        "wheel",
        (event) => {
            const intent = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

            if (Math.abs(intent) < 12) {
                return;
            }

            event.preventDefault();

            if (intent > 0) {
                showNext();
            } else {
                showPrev();
            }
        },
        { passive: false }
    );

    hero.addEventListener("pointerdown", (event) => {
        isDragging = true;
        startX = event.clientX;
        hero.setPointerCapture(event.pointerId);
    });

    hero.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        const deltaX = event.clientX - startX;

        if (deltaX < -40) {
            showNext();
        }

        if (deltaX > 40) {
            showPrev();
        }
    });
})();
