import { User } from './user';

export class RecipeList {
    public results: Recipe[];
    public next: string;

    public constructor(init?: Partial<RecipeList>) {
        Object.assign(this, init);
    }
}

export class Recipe {
    public id: number = null;
    public title: string = '';
    public description: string = '';
    public cook_time: string = '';
    public servings: string = '';
    public datePosted: string = '';
    public image_file: string = '';
    public ingredients: string = '';
    public directions: string = '';
    public user: User = null;
    public made_it: boolean = false;
    public made_it_count: number = 0;

    public constructor(init?: Partial<Recipe>) {
        Object.assign(this, init);
    }
}
