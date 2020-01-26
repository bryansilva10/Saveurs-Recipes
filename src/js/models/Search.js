//UPDATED API CALL
//const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

//import axios
import axios from 'axios';

//export class
export default class Search {
    //constructor 
    constructor(query) {
        this.query = query;
    }

    //async method to get results from query
    async getResults(query) {
        //try-catch block for axios call API
        try {
            //store call result in variable
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //store the recipes in new class property
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}
