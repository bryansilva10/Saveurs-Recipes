import {
    elements
} from './base';

//method to render the item in shopping list
export const renderItem = item => {
    //render markup
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    //add it to the html
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

//method to delete item from shopping list
export const deleteItem = id => {
    //select using the data atribute
    const item = document.querySelector(`[data-itemid=${id}]`);

    //remove the item
    item.parentElement.removeChild(item);
}