import {
    elements
} from './base';
import { limitRecipeTitle } from './searchView';

//method to toggle like button
export const toggleLikeBtn = isLiked => {
    //decided which img to use if button is liked or not and store it into a string constat
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    //select button and set the href to the right recipe, dinamically using iconString above
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

//method to toggle the like menu
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

//method to render like menu list
export const renderLike = like => {
    //add the markup
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;

    //add it to the html
    elements.likesList.insertAdjacentHTML('beforeend', markup)
}

//delete method
export const deleteLike = id => {
    //select the parent element in the likes link class that have the specific id
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    //if the element exists remove iit
    if (el) el.parentElement.removeChild(el);

}