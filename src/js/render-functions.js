import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

const lightbox = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const container = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more-btn');
const loader = document.querySelector('.loader');

function itemTemplate({webformatURL, largeImageURL , tags, likes , views, comments, downloads}) {
  return `
    <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
            <img
                class="gallery-image"
                src="${webformatURL}"
                alt="${tags}"
            />
        </a>
        <div class="info">
            <p class="info-item">
                <b class="info-title">Likes</b> ${likes}
            </p>
            <p class="info-item">
                <b class="info-title">Views</b> ${views}
            </p>
            <p class="info-item">
                <b class="info-title">Comments</b> ${comments}
            </p>
            <p class="info-item">
                <b class="info-title">Downloads</b> ${downloads}
            </p>
        </div>
    </li>
    `;
}

function itemsTemplate(items) {
  return items.map(itemTemplate).join('');
}

export function createGallery(items) {
    container.insertAdjacentHTML('beforeend', itemsTemplate(items));
    lightbox.refresh();
}

export function clearGallery() {
    container.innerHTML = '';
}

export function showLoader() {
    loader.classList.remove('is-hidden');
}

export function hideLoader() {
    loader.classList.add('is-hidden');
}

export function showLoadMoreButton() {
   loadMoreButton.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
    loadMoreButton.classList.add('is-hidden');
}    