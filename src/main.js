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

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  query = input.value.trim();

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
      iziToast.error({
        title: 'Помилка',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
   
    createGallery(data.hits);
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Something went wrong. Please try again!',
    });
    console.log(error);
  } finally {
    hideLoader();
    showLoadMoreButton();
  }
});
 
loadMoreButton.addEventListener('click', async () => {
  page += 1;
  showLoader();
  let data;
  try {
    data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Помилка',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Something went wrong. Please try again!',
    });
    console.log(error);
  } finally {
    hideLoader();
    showLoadMoreButton();
  }
  const totalPages = Math.ceil(Math.min(data.totalHits, 500) / perPage);

  if (page >= totalPages) {
    hideLoadMoreButton();

    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }
}); 

const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
