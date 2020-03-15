import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader} from './views/base';//DOM


/* Global state of the app
- search object
- current recipe object
- shopping list obj
- liked recipe
*/ 

const state = {};
window.state = state;

//-----search-----//
const controlSearch = async () => {
    // 1 get query form the view
    const query = searchView.getInput();


    if(query) {
        // 2 new search obj and add to state
        state.search = new Search(query);

        // 3 prepare UI for result
        searchView.cleanInput();
        searchView.cleanResults();
        renderLoader(elements.searchRes);
        try {
            // 4 search for recipes
            await state.search.getResult();
            
            // 5 render results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (error) {
            alert(`error from controlSearch`);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.cleanResults();
        searchView.renderResult(state.search.result, goToPage);
    }
});

//-----recipe----------//

const  controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace(`#`, ``);
    console.log(id); 

    if(id) {
        // prepare ui for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected recipe
        if(state.search)searchView.highlightSelected(id);

        // create new recipe obj
        state.recipe = new Recipe(id);
        
        try{
            
            // get recipe data and parse ingradeients
            await state.recipe.getRecipe();
            // console.log(state.recipe.Ingredients);
            state.recipe.parseIngredients();

            // cal time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch (error) {
            alert('error from render recipe');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));

//-----List-----//
const controlLIst = () => {
    // creat a new list IF there is none yet
    if(!state.list) state.list = new List();

    // add each ingredient to the list and user interface
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;//event deligation

    // handle the delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deletItem(id);
        // delete from UI
        listView.deletItem(id);

    // handle the value
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val) ;
        
    }
});



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease buton is clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        };
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase buton is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlLIst();
    }
    // console.log(state.recipe.ingredients);
});

window.l = new List();