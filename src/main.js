import { getImagesByQuery } from './js/pixabay-api.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const loadMoreButton = document.querySelector('.load-more-btn');

let query;
let page = 1;
const perPage = 15;

function showErrorToast(message) {
  iziToast.error({
    title: 'Помилка',
    message,
  });
}

function getTotalPages(totalHits) {
  return Math.ceil(Math.min(totalHits, 500) / perPage);
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  query = input.value.trim();
  hideLoadMoreButton();
  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Please enter a search query!',
    });
    return;
  }

  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      showErrorToast('Sorry, there are no images matching your search query. Please try again!');
      return;
    }
   
    createGallery(data.hits);
    const totalPages = getTotalPages(data.totalHits);
    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    showErrorToast('Something went wrong. Please try again!');
    console.log(error);
  } finally {
    hideLoader();
  }
});
 
loadMoreButton.addEventListener('click', async () => {
  const nextPage = page + 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, nextPage);

    if (data.hits.length === 0) {
      showErrorToast(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    page = nextPage;

    createGallery(data.hits);

    const totalPages = getTotalPages(data.totalHits);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    const gallery = document.querySelector('.gallery');
    const lastCard = gallery.lastElementChild;

    if (lastCard) {
      const { height: cardHeight } = lastCard.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    showErrorToast('Something went wrong. Please try again!');
    console.log(error);
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
});

