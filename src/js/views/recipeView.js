import {
    elements
} from './base';
import {
    Fraction
} from 'fractional'; //external package for handling fractions

//method to clear recipes when loading a new one
export const clearRecipe = () => {
    elements.recipe.innerHTML = "";
}

//method to format the count into fractions
const formatCount = count => {
    //check if there is a count for the ingredient
    if (count) {
        //example: count = 2.5 => 2 1/2
        //destructure what is on the right to whats on the left
        // convert the count number into string then split in in half (using the dot as reference to split)
        //Then, map through all elements and convert each of the splitted strings into real numbers
        const newCount = Math.round(count * 10000) / 10000; //workaround to have decimals (round returns only integers)
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el));

        if (!dec) return newCount; //if there is no decimal, return the count

        //if first digit is 0
        if (int === 0) {
            //create a fraction base on the count
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`
        } //if the integer is NOT zero
        else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`
        }


    }
    return '?'; //return this in case there is no specified count of ingredient
}

//method to create ingredients and use later when mapping through each ingredient
const createIngredient = ingredient =>
    ` 
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
    `;


export const renderRecipe = (recipe, isLiked) => {
    const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>
        </div>
        <button class="recipe__love">
            <svg class="header__likes">
            <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(el => createIngredient(el)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>
        </a>
    </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

//method to render updated servings and ingredients
export const updateServingsIngredients = recipe => {
    //update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //update ingredients
    //convert to array
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        //format the count of each ingredient
        el.textContent = formatCount(recipe.ingredients[i].count);
    })
}