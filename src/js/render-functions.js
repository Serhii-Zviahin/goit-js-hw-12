import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const loader = document.querySelector('.loader');
export const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery-link', {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250
});
const loadMore = document.querySelector('.js-load-more');

export function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
        </a>
        <div class="gallery-image-data">
            <p class="data-text"><span class="bold">Likes</span> ${likes}</p>
            <p class="data-text"><span class="bold">Views</span> ${views}</p>
            <p class="data-text"><span class="bold">Comments</span> ${comments}</p>
            <p class="data-text"><span class="bold">Downloads</span> ${downloads}</p>
        </div>
    </li>`)
        .join('');
    gallery.insertAdjacentHTML('beforeend', markup);    
    lightbox.refresh()
}

export function messageNoImages() {
    iziToast.show({
        title: 'Sorry',
        message: ', there are no images matching your search query. Please try again!',
        position: `topRight`,
        messageColor: '#fffc3aff',
        backgroundColor: "#ec3939",
    });
}

export function clearGallery() {
    gallery.innerHTML = '';
}

export function showLoader() {
    loader.classList.remove('hidden');
}

export function hideLoader() {
    loader.classList.add('hidden');
}

export function showLoadMoreButton() {
        loadMore.classList.remove('hidden');
} 

export function hideLoadMoreButton() {    
        loadMore.classList.add('hidden');
}
export function messageEndSearch() {
    iziToast.show({
                message: "We're sorry, but you've reached the end of search results",
                position: `topRight`,
                messageColor: '#fffc3aff',
                backgroundColor: "#394becb4",
            });
}
export function messageNotImage() {
    iziToast.show({
                    message: 'Image not found',
                    position: `topRight`,
                    messageColor: '#fffc3aff',
                    backgroundColor: "#ec3939",
                })
}
export function messageNotInput() {
    iziToast.show({
            message: 'Input field is empty',
            position: `topRight`,
            messageColor: '#fffc3aff',
            backgroundColor: "#ec3939",
        })
}
export function messageSomethingWrong() {
    iziToast.error({
            message: 'Sorry, something went wrong. Please try again!',
            position: "topRight",
        })
}