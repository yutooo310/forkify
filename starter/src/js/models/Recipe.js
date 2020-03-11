import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;        
    }


    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            alert(`error from getRecipe`);
        }    
    } 

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units=[...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {            
            // uniform units
            let ingredient = el.toLowerCase().trimStart();
            unitsLong.forEach((unit, i) => {ingredient = ingredient.replace(unit, units[i]);
            });


            // remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');            
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
            //There is a unit
            //Eg. 4 1/2 cups, arrCount = [4, 1/2] -> eval('4 + 1/2') -> 4.5
            //Eg. 4 cups, arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex);
                // console.log(`Array count: ${arrCount.length}`);
                let count;
                if (arrCount.length  === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else if (arrCount.length === 0) {
                    count = 1;
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                // Another way
                // if (arrCount === 1) {
                //     count = eval(arrIng[0]);
                // } else {
                //     count = eval(arrCount.join('+').replace('-', '+'));
                // }


                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }




            //There is NO unit , but 1st element is number
            } else if(parseInt(arrIng[0], 10)) {                
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                }

            //There is NO unit NO number in 1st position
            } else if(unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
} 
