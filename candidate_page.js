(() => {
    const createRatingOverlay = (ratingItemElm) => {
        const overlay = document.createElement('div');
        overlay.setAttribute('class', 'whr-detail-overlay');

        const authorElm = ratingItemElm.querySelector(".summary strong:nth-child(1)");
        const author = authorElm ? authorElm.textContent : null;
        let message;

        if (author) {
            message = `<b>${author}</b>'s rating is hidden until your own rating is submitted.</br>Click to show the rating anyway.`;
        } else {
            message = `This rating is hidden until your own rating is submitted.</br>Click to show the rating anyway.`;
        }

        overlay.innerHTML = `
            <div class="whr-detail-overlay__opaquebg"></div>
            <div class="whr-detail-overlay__iconblock"></div>
            <p>${message}</p>
        `;

        overlay.addEventListener("click", () => {
            overlay.classList.add('is-hidden');
        });

        return overlay;
    };

    const hasRatingSummary = () => {
        const widgets = document.querySelectorAll('.profile__header div[data-ui="rating-summary"] .rating-widget__item');

        if (!widgets) {
            return null;
        }

        for (const w of widgets) {
            const count = parseInt(w.textContent);
            if (count > 0) {
                return true;
            }
        }

        return false;
    };

    const hideRatingSummary = () => {
        const summary = document.querySelector('.profile__header div[data-ui="rating-summary"]')
        if (!summary) {
            return;
        }

        const alreadyHidden = !!summary.querySelector('.whr-detail-overlay');
        if (alreadyHidden) {
            return;
        }

        summary.style.position = 'relative';

        const overlay = document.createElement('div');
        overlay.setAttribute('class', 'whr-detail-overlay whr-sm-txt');
        overlay.innerHTML = `
            <div class="whr-detail-overlay__opaquebg"></div>
            <p>Click to show rating</p>
        `;

        overlay.addEventListener("click", () => {
            overlay.classList.add('is-hidden');
        });

        summary.appendChild(overlay);
    };

    const observer = new MutationObserver(() => {
        const hasSummary = hasRatingSummary();
        const ratingItems = document.querySelectorAll('.timeline__item--rating[data-id]');

        let hasThisUserRated = false;
        ratingItems.forEach((x) => {
            const isOwnRating = !!x.querySelector('.act .glyph-link[data-ui="edit"]');
            hasThisUserRated = hasThisUserRated || isOwnRating;
        });

        if (!hasThisUserRated && hasSummary) {
            hideRatingSummary();
        }

        if (hasThisUserRated) {
            return;
        }

        for (const rating of ratingItems) {
            const alreadyOverlayed = !!rating.querySelector('.whr-detail-overlay');
            if (alreadyOverlayed) {
                continue;
            }

            rating.appendChild(createRatingOverlay(rating));
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
})();
