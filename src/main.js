import { getImagesByQuery, per_page } from "./js/pixabay-api";
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, messageEndSearch,  messageNotImage,  messageNotInput,  messageSomethingWrong, showLoader, showLoadMoreButton } from "./js/render-functions";

const form = document.querySelector('.form');
const imageInput = form.querySelector('input[name="search-text"]');

form.addEventListener('submit', handleSubmit);
const loadMore = document.querySelector('.js-load-more');
loadMore.addEventListener('click', onLoadMore);

hideLoadMoreButton();

let page;
let queryWord;


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
            if (images.hits.length > 0) {
                createGallery(images.hits);
                showLoadMoreButton();
            }
            else {
                messageNotImage();
            }
            if (images.hits.length < per_page) {
                hideLoadMoreButton();
                messageEndSearch();
            }
        } catch(error) {
            messageSomethingWrong();      
            event.target.reset();
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

        const totalPage = Math.ceil(data.totalHits / per_page);

        if (page >= totalPage) {
            hideLoadMoreButton();
            messageEndSearch(); 
        }
            const card = document.querySelector('.gallery-item');
            const info = card.getBoundingClientRect();
            const heightCard = info.height;
            window.scrollBy({
                top: heightCard * 2,
                behavior: 'smooth'
            })
    } catch (error) {
        page--;
        showLoadMoreButton();
        messageSomethingWrong();  
    } finally {
        loadMore.disabled = false;
        hideLoader();
    }
}