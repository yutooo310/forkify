<<<<<<< HEAD
import {elements} from './base';
import {limitRecipeTittle} from './searchView'

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTittle(like.title)}</h4>
                <p class="likes__author">${like.publisher}</p>
            </div>
        </a>
    </li>   
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
};
=======
>>>>>>> parent of 7851d77... renderlike
