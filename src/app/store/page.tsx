'use client';

import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Box, Card, CardContent, CardMedia, Typography, CircularProgress } from '@mui/material';
import { Food } from '../components/types';
import { firebaseConfig } from '../firebaseConfig';
import Header from '../components/header';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function MyStore() {
  const [data, setData] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const foods: Food[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const food: Food = {
          name: data.jsonResponse.name,
          shortInfo: data.jsonResponse.shortInfo,
          benefits: data.jsonResponse.benefits,
          quantity: data.jsonResponse.quantity,
          recipes: data.jsonResponse.recipes,
            imageUrl: data.imageUrl,
        };
        foods.push(food);
      });
      setData(foods);
      setLoading(false);
    //   show the data
      console.log("data: ", data);
    };

    fetchData();

  }, []);

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
    </div>;
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center p-24">
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} alignItems="center" justifyContent="center" p={2}>
      {data.map((food, index) => (
        <Card key={index} sx={{ maxWidth: 345, mb: 2 }}>
          <CardMedia component="img" width="140" image={food.imageUrl || ''} alt="Food image" />
          <CardContent>
            <Typography variant="h6">Info</Typography>
            <Typography variant="body2">Name: {food.name}</Typography>
            <Typography variant="body2">Description: {food.shortInfo}</Typography>
            <Typography variant="body2">Benefits: {food.benefits}</Typography>
            <Typography variant="body2">Quantity: {food.quantity}</Typography>
            <Typography variant="body2" mt={1} mb={1}>Recipes:</Typography>
            {food.recipes.map((recipe: any, recipeIndex: any) => (
              <Box key={recipeIndex} mb={1}>
                <Typography variant="body2">Name: {recipe.name}</Typography>
                <Typography variant="body2">Ingredients:</Typography>
                {recipe.ingredients.map((ingredient: any, ingredientIndex: any) => (
                  <Typography key={ingredientIndex} variant="body2">
                    {ingredient.name}: {ingredient.quantity}
                  </Typography>
                ))}
                <Typography variant="body2">Instructions: {recipe.instructions}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
    </main>
    </>
  );
}