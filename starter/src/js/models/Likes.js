export default class Likes {
    constructor() {
        this.like = [];
    }

    addLike(id, title, publisher, image) {
        const like = { id, title, publisher, image};
        this.likes.push(like);
        return like;
    }
    
    deletLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}