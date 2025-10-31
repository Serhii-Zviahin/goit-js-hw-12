import { getImagesByQuery, per_page } from "./js/pixabay-api";
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, messageEndSearch,  messageNoImages,  messageNotImage,  messageNotInput,  messageSomethingWrong, showLoader, showLoadMoreButton } from "./js/render-functions";

const form = document.querySelector('.form');
const imageInput = form.querySelector('input[name="search-text"]');

form.addEventListener('submit', handleSubmit);
const loadMore = document.querySelector('.js-load-more');
loadMore.addEventListener('click', onLoadMore);

hideLoadMoreButton();

let page;
let queryWord;
let totalPages;

async function handleSubmit(event) {
    event.preventDefault();
    clearGallery();
    showLoader();
    hideLoadMoreButton();
    
    page = 1;
    queryWord = imageInput.value;
    
    if (!queryWord.trim().length) {   
        messageNotInput();
        hideLoader();
        form.reset();
        return; 
    }

        try {
            const images = await getImagesByQuery(queryWord, page);
            hideLoader();
            if (!images.totalHits) {
                messageNoImages(); 
                return;
            }

            totalPages = Math.ceil(images.totalHits / per_page);

            createGallery(images.hits);
            form.reset();
            
            if (page >= totalPages) {
                messageEndSearch();
                return;
            }
            
            showLoadMoreButton();
        
        } catch(error) {
            messageSomethingWrong();
            
        } finally {
            hideLoader();
        }
}

async function onLoadMore() {
    page++;
    loadMore.disabled = true;

    try {
        showLoader();
        const data = await getImagesByQuery(queryWord, page);
        createGallery(data.hits);

        if (page >= totalPages) {
            messageEndSearch(); 
            hideLoadMoreButton();
            return;
        }

        showLoadMoreButton();

        const card = document.querySelector('.gallery-item');
        const info = card.getBoundingClientRect();
        const heightCard = info.height;
        window.scrollBy({
            top: heightCard * 2,
            behavior: 'smooth'
        });

    } catch (error) {
        page--;
        messageSomethingWrong();  

    } finally {
        loadMore.disabled = false;
        hideLoader();
    }
}