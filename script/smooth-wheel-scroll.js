(function () {
    document.addEventListener("click", (event) => {
        const placeholderLink = event.target.closest('a[href="#"]');
        if (placeholderLink) event.preventDefault();
    });

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const topSnapStage = document.querySelector("[data-scroll-snap-top]");
    let targetY = window.scrollY;
    let renderedY = window.scrollY;
    let animationFrame = null;
    let topSnapArmed = true;
    let topSnapLocked = false;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getMaxScrollY() {
        return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    }

    function getWheelDelta(event) {
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 18;
        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
        return event.deltaY;
    }

    function hasScrollableParent(element) {
        let current = element;

        while (current && current !== document.body && current !== document.documentElement) {
            const style = window.getComputedStyle(current);
            const canScrollY = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;

            if (canScrollY) return true;
            current = current.parentElement;
        }

        return false;
    }

    function stopSmoothScroll() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = null;
        targetY = window.scrollY;
        renderedY = window.scrollY;
    }

    function renderSmoothScroll() {
        const distance = targetY - renderedY;

        renderedY += distance * 0.12;

        if (Math.abs(distance) < 0.5) {
            renderedY = targetY;
            animationFrame = null;
            if (topSnapLocked) {
                topSnapLocked = false;
            }
        } else {
            animationFrame = requestAnimationFrame(renderSmoothScroll);
        }

        window.scrollTo(0, renderedY);
    }

    function holdTopSnap(snapTop) {
        topSnapLocked = true;
        targetY = snapTop;
    }

    function shouldSnapToTop(deltaY) {
        if (!topSnapStage) return false;

        const snapTop = topSnapStage.offsetTop;
        if (deltaY < 0 && window.scrollY <= snapTop + 2) {
            topSnapArmed = true;
            topSnapLocked = false;
        }

        if (topSnapLocked) {
            holdTopSnap(snapTop);
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(renderSmoothScroll);
            }
            return true;
        }

        if (deltaY <= 0) return false;
        if (!topSnapArmed) return false;
        if (window.scrollY >= snapTop - 2) return false;
        if (targetY + deltaY < snapTop) return false;

        topSnapArmed = false;
        targetY = snapTop;
        renderedY = window.scrollY;
        holdTopSnap(snapTop);
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(renderSmoothScroll);
        }
        return true;
    }

    window.addEventListener("wheel", (event) => {
        if (
            event.defaultPrevented ||
            event.ctrlKey ||
            event.metaKey ||
            reducedMotionQuery.matches ||
            coarsePointerQuery.matches ||
            hasScrollableParent(event.target)
        ) {
            stopSmoothScroll();
            return;
        }

        if (!animationFrame) {
            targetY = window.scrollY;
            renderedY = window.scrollY;
        }

        event.preventDefault();
        const wheelDelta = getWheelDelta(event);
        if (!shouldSnapToTop(wheelDelta)) {
            targetY = clamp(targetY + wheelDelta, 0, getMaxScrollY());
        }

        if (!animationFrame) {
            animationFrame = requestAnimationFrame(renderSmoothScroll);
        }
    }, { passive: false });
})();
