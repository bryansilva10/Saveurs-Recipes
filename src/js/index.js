//import from search module
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


//Global State of the App
// - Search Object
// - Current recipe object
// - shoping list object
// - Liked recipes
const state = {};

/****************
 * SEARCH CONROLLER
 * **************/
const controlSearch = async () => {
    //Get query from view
    const query = searchView.getInput();

    if (query) {
        //Create new search object and add it to state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //Search for recipes
            await state.search.getResults()

            //render results on UI after getting results from above
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Sorry, we do not have that recipe (yet)');
            clearLoader();
        }
    }
}

//adding event listener to search form
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

//addign event listener for pagination div
elements.searchResPages.addEventListener('click', e => {
    //variable that will find the target in the closes element containing the btn-inline class
    const btn = e.target.closest('.btn-inline');

    //if the button exists...
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //will get the data stored in data-goto on the markup
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

})

/****************
 * RECIPE CONROLLER
 * **************/
//method to add to event listener on hashchange
const controlRecipe = async () => {
    //variable for hash, get id from URL
    const id = window.location.hash.replace('#', ''); //replacing the symbol with nothing

    //if there is an id in the url
    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //highloght slected item (if there is a searched item)
        if (state.search) {
            // Find the index of the recipe in the result list
            const index = state.search.result.findIndex(
                el => el.recipe_id === id
            );

            // If found
            if (index !== -1) {
                // Clear current result page
                searchView.clearResults();

                // Go to the page where the recipe is located
                searchView.renderResults(
                    state.search.result,
                    Math.ceil((index + 1) / 10)
                );

                // Highlight the selected recipe
                searchView.highlightSelected(id);
            }
        }

        //create new recipe object and store it into state
        state.recipe = new Recipe(id)

        try {
            //get recipe data (async/await) and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and cooking time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            console.log(err);
            alert('Error processing Recipe');
        }
    }

}

//add events to the whole browser to keep track of hash change in url when it changes by click and by loading the page
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/****************
 * LIST CONROLLER
 * **************/
const controlList = () => {
    //create new list IF there is none
    if (!state.list) state.list = new List(); //initialize if it doesnt exist

    //Add each ingredient to the shopping list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient); //add item is on the model for lists it will also return an item that we can save into a const

        listView.renderItem(item); //use the metho from the view to render and pass it the item we already have from above
    })
}

//Handle delete and update events
elements.shopping.addEventListener('click', e => {
    //get the target correctly in order to get the ID
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delelte and update
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //delete from UI list
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        //read dat from interface and update it
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }

})

/****************
 * LIKES CONROLLER
 * **************/
const controlLike = () => {
    //create likes object if doesn't exist in state
    if (!state.likes) {
        state.likes = new Likes();
    }

    //constant for current ID
    const currentID = state.recipe.id;

    //check if item has not been previously liked
    if (!state.likes.isLiked(currentID)) {
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle like button UI
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);

        //if it was already liked...
    } else {
        //remove like from the state
        state.likes.deleteLike(currentID);

        //toggle like button UI
        likesView.toggleLikeBtn(false);

        //remove like from UI list
        likesView.deleteLike(currentID);
    }

    //show likes menu if there are recipes liked, hide if not
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore like recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

//handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    //check if the target matches a specific selector
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button is clicked (only if servings is greater than 1)
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            //now update the view
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        //now update the view
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //that above will check if the event delegation matches those selectors for adding to the shopping list

        //create new shopping list and add each ingredient
        controlList();

        //check if the target matches a click on the like button
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //call like controller to add it to the list of liked recipes
        controlLike();
    }
})


