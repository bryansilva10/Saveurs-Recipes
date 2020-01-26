//export the class for the model
export default class Likes {
    constructor() {
        //likes is an array of liked recipes
        this.likes = [];
    }

    //method to addLiked items
    addLike(id, title, author, img) {
        //create like object to be pushed with each like
        const like = { id, title, author, img };
        //push to array of likes
        this.likes.push(like);

        //persist into local storage
        this.persistData();

        //return newly created like
        return like;
    }

    //method to delete liked item
    deleteLike(id) {
        //find the index passed to the function
        const index = this.likes.findIndex(el => el.id === id);

        //splice takes 2 arguments, where to start(the index found above) and how many to take (only take that one). It mutates original array
        this.likes.splice(index, 1);

        //persist into local storage
        this.persistData();
    }

    //method to test if the recipe is liked
    isLiked(id) {
        //test if id is in the array. If it returns -1 it is NOT in the array.
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    //method to get number of liked recipes
    getNumLikes() {
        return this.likes.length;
    }

    //method to persist data
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    //method to retrieve from local storage
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore likes from local storage
        if (storage) this.likes = storage;
    }
}