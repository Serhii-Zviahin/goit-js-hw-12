import { getImagesByQuery } from "./js/pixabay-api";
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, showLoader, showLoadMoreButton } from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const imageInput = form.querySelector('input[name="search-text"]');

form.addEventListener('submit', handleSubmit);
const loadMore = document.querySelector('.js-load-more');
loadMore.addEventListener('click', onLoadMore);

hideLoadMoreButton();

let page = 1;
let queryWord = '';

function handleSubmit(event) {
    event.preventDefault();

    queryWord = imageInput.value;
    
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

    page = 1;
    
    hideLoadMoreButton();
    getImages();

    async function getImages() {
        try {
            const images = await getImagesByQuery(queryWord, page);
            if (images.hits.length > 0) {
                createGallery(images.hits);
                hideLoader();
                showLoadMoreButton();
            } else {
                iziToast.show({
                    message: 'Image did not find',
                    position: `topRight`,
                    messageColor: '#fffc3aff',
                    backgroundColor: "#ec3939",
                });
                hideLoader();
            }
        } catch (error) {
            iziToast.show({
                message: error.message,
                position: `topRight`,
                messageColor: '#fffc3aff',
                backgroundColor: "#ec3939",
            });
            hideLoader();
            event.target.reset();
        } finally {
            hideLoader();
        }
    }
}

async function onLoadMore() {
    page++;
    loadMore.disabled = true;

    try {
        showLoader();
        const data = await getImagesByQuery(queryWord, page);
        hideLoader();
        createGallery(data.hits);
        const totalPage = Math.ceil(data.totalHits / data.hits.length);
        if (page >= totalPage) {
            hideLoadMoreButton();
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