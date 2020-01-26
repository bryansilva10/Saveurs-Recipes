//DOM elements
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

//element strings //classes...
export const elementSrings = {
    loader: 'loader'
}

//method to attached spiner/loader to a container
export const renderLoader = parent => {
    const loader = `
        <div class="${elementSrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

//method to clear the loader after results are rendered
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementSrings.loader}`);

    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}