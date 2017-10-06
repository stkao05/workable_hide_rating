(() => {
    const hideSearchResultRatingSummary = () => {
        const widgets = document.querySelectorAll('.search-result__container .rating-widget');
        if (widgets.length === 0) {
            return;
        }

        for (const w of widgets) {
            const alreadyAdded = !!w.querySelector('.whr-list-rating-overlay');
            if (alreadyAdded) {
                continue;
            }

            const overlay = document.createElement('div');
            overlay.setAttribute('class', 'whr-list-rating-overlay');
            overlay.innerHTML = '?';
            w.appendChild(overlay);
        }
    }

    const observer = new MutationObserver(() => {
        hideSearchResultRatingSummary();
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });

    document.addEventListener("DOMContentLoaded", () => {
        hideSearchResultRatingSummary();
    });
})();

