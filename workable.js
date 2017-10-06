/*
 * - only hide rating if user didn't rate yet (need to know I am)
 *
 *
 */


/*
 * @param {Element} ratingItemElm
 */
const createRatingOverlay = (ratingItemElm) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'workable-ext-rating-overlay');

    const opaqueBg = document.createElement('div');
    opaqueBg.setAttribute('class', 'workable-ext-rating-overlay__opaquebg');
    overlay.appendChild(opaqueBg);

    const iconBlock = document.createElement('div');
    iconBlock.setAttribute('class', 'workable-ext-rating-overlay__iconblock');
    overlay.appendChild(iconBlock);

    const authorElm = ratingItemElm.querySelector(".summary strong:nth-child(1)")
    const author = authorElm ? authorElm.textContent : null;
    const note = document.createElement('p');
    if (author) {
        note.innerHTML = `<b>${author}</b>'s rating is hidden until your own rating is submitted.</br>Click to show the rating anyway.`;
    } else {
        note.innerHTML = `This rating is hidden until your own rating is submitted.</br>Click to show the rating anyway.`;
    }
    overlay.appendChild(note);

    overlay.addEventListener("click", () => {
        overlay.classList.add('is-hidden');
    })

    return overlay;
};

const hasRatings = () => {
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

    const alreadyHidden = !!summary.querySelector('.workable-ext-rating-overlay');
    if (alreadyHidden) {
        return;
    }

    summary.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'workable-ext-rating-overlay');

    const opaqueBg = document.createElement('div');
    opaqueBg.setAttribute('class', 'workable-ext-rating-overlay__opaquebg');
    overlay.appendChild(opaqueBg);

    const note = document.createElement('p');
    note.innerHTML = `Show rating`;
    overlay.appendChild(note);

    overlay.addEventListener("click", () => {
        overlay.classList.add('is-hidden');
    });

    summary.appendChild(overlay);
}

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
    console.log("mutate called")

    if (!hasRatings()) {
        return;
    }

	const ratingItems = document.querySelectorAll('.timeline__item--rating[data-id]');
    if (ratingItems.length === 0) {
        return;
    }

    let hasThisUserRated = false;
    ratingItems.forEach((x) => {
        const isOwnRating = !!x.querySelector('.act .glyph-link[data-ui="edit"]');
        hasThisUserRated = hasThisUserRated || isOwnRating;
    });
    if (hasThisUserRated) {
        return;
    }

    hideRatingSummary();

    for (const rating of ratingItems) {
        const alreadyOverlayed = !!rating.querySelector('.workable-ext-rating-overlay');
        if (alreadyOverlayed) {
            continue;
        }

        rating.appendChild(createRatingOverlay(rating));
    }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
