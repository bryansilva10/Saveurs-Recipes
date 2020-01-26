//API CALL RECIPE const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

//import axios
import axios from 'axios';

//export class Recipe
export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    //async function to do api call to geet recipe
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //all properties we need for the object
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    calcTime() {
        //variable for num of ingredients
        const numIng = this.ingredients.length;
        //variable for how many 15mim periods
        const periods = Math.ceil(numIng / 3);
        //property for cooking time (each 3 ingredients takes roughly 15 min)
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    //method to parse ingredients/units
    parseIngredients() {

        //variables for units long version
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        //variable for units short version
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        //new array to include different kinds of units (using destructuring to combine other arrays)
        const units = [...unitsShort, 'kg', 'g'];

        //map over all ingredients and transform them...
        const newIngredients = this.ingredients.map(el => {
            //1. uniform units
            //variable to store the current element of map into..
            let ingredient = el.toLowerCase();
            //we need the unit and the index of it too...
            unitsLong.forEach((unit, i) => {
                //overwrite ingredient, the replacement will be the short name (at index)
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. remove parantheses (using regex)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. parse ingredients
            //convert ingredient into array
            const arrIng = ingredient.split(' ');

            //find index of measuring unit
            //'includes' returns true/falsse if element is found in the array
            //then, 'findIndex' will find the position of the element that returned true...
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2))

            //object to return
            let objIng;

            //if something was found..(includes will return -1 if nothing is found)
            if (unitIndex > -1) {
                //slice from 0 until the unit.Example, if index is 2, that means index 0 and 1 is the count of ignredients (4 1/2 cups..)
                const arrCount = arrIng.slice(0, unitIndex);

                //count variable
                let count;

                //if count is just 1
                if (arrCount.length === 1) {
                    //then, count would be the first element
                    count = eval(arrIng[0].replace('-', '+')); //replace cases where there is a "-" in between
                } // if is bigger than one (example 4 1/2 cups)
                else {
                    //then join the two strings with a plus sign and evaluate them (eval does math with strings)
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    //count will be the result of mutating count above
                    count,
                    //unit is in the array of ingredients at the index of the unit
                    unit: arrIng[unitIndex],
                    //ingredient is also in the array, slice begining after the unit
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            }
            //if there is no unit found but the first element IS a number (we test only the first element of the array and parse it to int to coerce a true statement)
            else if (parseInt(arrIng[0], 10)) {
                //object would be like this
                objIng = {
                    //count would be first item in the array
                    count: parseInt(arrIng[0], 10),
                    //no unit..
                    unit: '',
                    //ingredient is entire array except first element(which is the count)
                    ingredient: arrIng.slice(1).join(' ') //we get that by slicing at second position all the way to the end, then we convert it from array to string with join
                }
            }
            //if nothing is found (no number and no unit)
            else if (unitIndex === -1) {
                //object would be like this...
                objIng = {
                    //the count will be 1 in case there is no count of ingredients 
                    count: 1,
                    //unit will be empty
                    unit: '',
                    //ingredient will be the ingredient object we already had
                    ingredient
                }
            }

            //return final mutated version of object
            return objIng;
        });
        //the new array of ingredients will overwrite the ingredient property
        this.ingredients = newIngredients;
    }

    //method to increse servings and ingredients accordingly
    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients (modify the ammount of ingredient for each ingrediet)
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}