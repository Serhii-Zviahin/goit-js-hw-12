import axios from "axios";
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
import { messageError } from "./render-functions";

const url = "https://pixabay.com/api/";
const myAPI_KEY = "52805725-7d516d36c1804a9cebba9806b";

export async function getImagesByQuery(queryWord, page = 1) {
    try {
        const response = await axios(url, {
            params: {
                key: myAPI_KEY,
                q: queryWord,                // слово з пошукового поля
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page,
                per_page: 15
            }
        });
        if (response.data.hits.length > 0) {
            return response.data;
        } else {
            messageError();
            return [];
        }
    } catch (error) {       
        iziToast.show({
        message: error.message,
        position: `topRight`,
        messageColor: '#fffc3aff',
        backgroundColor: "#ec3939",
    })}
};