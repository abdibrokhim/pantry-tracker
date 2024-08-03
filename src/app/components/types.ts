interface Ingredient {
    name: string;
    quantity: number;
  }
  
  interface Recipe {
    name: string;
    ingredients: Ingredient[];
    instructions: string;
  }
  
 export interface Food {
    name: string;
    shortInfo: string;
    benefits: string;
    quantity: number;
    recipes: Recipe[];
    imageUrl: string;
  }
  