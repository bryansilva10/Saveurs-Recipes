//importing elements for DOM from basejs
import {
    elements
} from './base';

//exporting method to get input value
export const getInput = () => {
    return elements.searchInput.value;
}

//method for clearing previous input
export const clearInput = () => {
    elements.searchInput.value = "";
}

//method to clear results from previous search
export const clearResults = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}

//method to hghlight selected recipe
export const highlightSelected = id => {
    //select all that have the results__link class and remove their --active class in each of them
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    //selecting "a" tags that have href of #id and then apply css class that will highlight
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

// method to limit the display of recipe title
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []; //variable array for new title
    //if the whole title is greater than 17...
    if (title.length > limit) {
        //split with spaces and use reduce...
        title.split(' ').reduce((acc, cur) => {
            //if the counter + length of current-word-in-array is less than limit...
            if (acc + cur.length <= limit) {
                //push it into new array
                newTitle.push(cur);
            }
            //return counter for next iteration (counter + length of current-word-in-array)
            return acc + cur.length;
        }, 0);

        //return the result (we have to join the array because it was previously an array fo words, now we need a string)
        return `${newTitle.join(' ')} ...`;
    }
    //if it is not greater than limit...just return the title as is...
    return title;
}

//private method to render just one recipe and re-use
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}

//method to create buttons
const createButton = (page, type) => {
    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
    `;
}

//private function to render buttons
const renderButtons = (page, numResults, resPerPage) => {
    //num of pages will be the result of...
    const pages = Math.ceil(numResults / resPerPage);

    //variable for button
    let button;

    //if we are on page 1 and there is more than 1 page
    if (page === 1 && pages > 1) {
        //button to go to next page...
        button = createButton(page, 'next');
    } //if current page is less than total num of pages
    else if (page < pages) {
        //both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;

    } //else if we are on the last page...
    else if (page === pages && pages > 1) {
        //button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

//exporting method to render results
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //variables to start and end the count for the slice method
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    //render recipe for each element within the range in slice
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
}