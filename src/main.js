import { getImagesByQuery } from "./js/pixabay-api";
import { clearGallery, createGallery, hideLoader, showLoader } from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const imageInput = form.querySelector('input[name="search-text"]');
form.addEventListener('submit', handleSubmit);
const loadMore = document.querySelector('.js-load-more');
loadMore.addEventListener('click', onLoadMore);

function handleSubmit(event) {
    event.preventDefault();

    const queryWord = imageInput.value;
    if (!queryWord.trim().length) {   
        iziToast.show({
            message: 'Input field is empty',
            position: `topRight`,
            messageColor: '#fffc3aff',
            backgroundColor: "#ec3939",
        });
        hideLoader();
        return; 
    }

    clearGallery();
    showLoader();
    
    getImagesByQuery(queryWord)
        .then(images => {
            if (images.hits.length > 0) {
                createGallery(images.hits);
                hideLoader();
                loadMore.classList.replace('hidden', 'js-load-more');                
            } else {
                iziToast.show({
                    message: 'Image did not find',
                    position: `topRight`,
                    messageColor: '#fffc3aff',
                    backgroundColor: "#ec3939",
                });
                hideLoader();
            }
        })
        .catch(error => {
            iziToast.show({
                message: error.message,
                position: `topRight`,
                messageColor: '#fffc3aff',
                backgroundColor: "#ec3939",
            });
            hideLoader();
            event.target.reset();
        });
}

let page = 1;
async function onLoadMore() {
    page++;
    loadMore.disabled = true;

    try {
        const data = await getImagesByQuery(imageInput.value, page);
        createGallery(data.hits);
        const totalPage = data.totalHits / data.hits.length;
        if (page >= totalPage) {
            loadMore.classList.replace('js-load-more', 'hidden');
            iziToast.show({
                message: "We're sorry, but you've reached the end of search results",
                position: `topRight`,
                messageColor: '#fffc3aff',
                backgroundColor: "#394becb4",
            });
        }
            const card = document.querySelector('.gallery-item');
            const info = card.getBoundingClientRect();
            const heightCard = info.height;
            window.scrollBy({
                top: heightCard * 2,
                behavior: 'smooth'
            })
    } catch (error) {
        iziToast.show({
        message: error.message,
        position: `topRight`,
        messageColor: '#fffc3aff',
        backgroundColor: "#ec3939",
    })
    } finally {
        loadMore.disabled = false;;
    }
}