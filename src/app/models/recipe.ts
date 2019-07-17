import { User } from './user';

export interface Recipe {
    id: number;
    title: string;
    description: string;
    cook_time: string;
    servings: string;
    datePosted: string;
    image_file: string;
    ingredients: string;
    directions: string;
    user: User;
}
