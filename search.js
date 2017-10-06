(() => {
    const hideSearchResultRatingSummary = () => {
        const widgets = document.querySelectorAll('.search-result__container .rating-widget');
        if (widgets.length === 0) {
            return;
        }

        for (const w of widgets) {
            const alreadyAdded = !!w.querySelector('yworkable-ext-rating-summary-overlay');
            if (alreadyAdded) {
                continue;
            }

            const overlay = document.createElement('div');
            overlay.setAttribute('class', 'workable-ext-rating-summary-overlay');
            overlay.innerHTML = '?';
            w.appendChild(overlay);
        }
    }

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    const observer = new MutationObserver(() => {
        console.log("search.js mutate call");
        hideSearchResultRatingSummary();
    });

    observer.observe(document, {
      subtree: true,
      attributes: true
    });

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("search.js loaded");
        hideSearchResultRatingSummary();
    });


})();

