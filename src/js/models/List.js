import uniqid from 'uniqid';

//exporting class for List
export default class List {
    constructor() {
        //empty array to push things there
        this.items = [];
    }

    //method to add something to the array
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        //push it to the array
        this.items.push(item);
        return item;
    }

    //method to delete an item
    deleteItem(id) {
        //find the index passed to the function
        const index = this.items.findIndex(el => el.id === id);

        //splice takes 2 arguments, where to start(the index found above) and how many to take (only take that one). It mutates original array
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        //find the actual element of that id, then modify its coutn to be the new count
        this.items.find(el => el.id === id).count = newCount;
    }
}