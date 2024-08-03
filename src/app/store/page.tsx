'use client';

import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Box, Card, CardContent, CardMedia, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { Food } from '../components/types';
import { firebaseConfig } from '../firebaseConfig';
import Header from '../components/header';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function MyStore() {
  const [data, setData] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Food>>({});
  const [showRecipes, setShowRecipes] = useState<{ [key: number]: boolean }>({});

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
      console.log("data: ", foods);
    };

    fetchData();
  }, []);

  const handleDelete = async (name: string) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      querySnapshot.forEach(async (doc) => {
        if (doc.data().jsonResponse.name === name) {
          await deleteDoc(doc.ref);
        }
      });
      setData(data.filter((food) => food.name !== name));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleUpdate = async (index: number) => {
    if (editIndex !== null) {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        querySnapshot.forEach(async (doc) => {
          if (doc.data().jsonResponse.name === data[index].name) {
            await updateDoc(doc.ref, {
              'jsonResponse.name': editData.name || data[index].name,
              'jsonResponse.shortInfo': editData.shortInfo || data[index].shortInfo,
              'jsonResponse.benefits': editData.benefits || data[index].benefits,
              'jsonResponse.quantity': editData.quantity || data[index].quantity,
            });
          }
        });
        setData(prevData =>
          prevData.map((food, i) =>
            i === index ? { ...food, ...editData } : food
          )
        );
        setEditIndex(null);
        setEditData({});
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  };

  const filteredData = data.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()) ||
    food.shortInfo.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
    </div>;
  }

  return (
    <>
      <Header />
      <p className='flex text-[32px] mt-8 items-center justify-center'>Collaborative Pantry</p>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} alignItems="center" justifyContent="center" p={2}>
          {filteredData.map((food, index) => (
            <Card key={index} sx={{ maxWidth: 345, mb: 2 }}>
              <CardMedia component="img" height="140" image={food.imageUrl || ''} alt="Food image" />
              <CardContent>
                {editIndex === index ? (
                  <>
                    <TextField
                      label="Name"
                      variant="outlined"
                      value={editData.name || food.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      value={editData.shortInfo || food.shortInfo}
                      onChange={(e) => setEditData({ ...editData, shortInfo: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Benefits"
                      variant="outlined"
                      value={editData.benefits || food.benefits}
                      onChange={(e) => setEditData({ ...editData, benefits: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Quantity"
                      variant="outlined"
                      value={editData.quantity || food.quantity}
                      onChange={(e) => setEditData({ ...editData, quantity: Number(e.target.value) })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(index)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">Name: {food.name}</Typography>
                    <Typography variant="body2">Description: {food.shortInfo}</Typography>
                    <Typography variant="body2">Benefits: {food.benefits}</Typography>
                    <Typography variant="body2">Quantity: {food.quantity}</Typography>
                    <Button variant="contained" color="primary" onClick={() => setEditIndex(index)} sx={{ mt: 2 }}>
                      Update
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(food.name)} sx={{ mt: 2, ml: 2 }}>
                      Delete
                    </Button>
                    <Button variant="contained" color="info" onClick={() => setShowRecipes({ ...showRecipes, [index]: !showRecipes[index] })} sx={{ mt: 2, ml: 2 }}>
                      {showRecipes[index] ? 'Hide Recipes' : 'Show Recipes'}
                    </Button>
                  </>
                )}
              </CardContent>
              {showRecipes[index] && (
                <Box sx={{ p: 2 }}>
                  {food.recipes.map((recipe, recipeIndex) => (
                    <Card key={recipeIndex} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">Recipe: {recipe.name}</Typography>
                        <Typography variant="body2">Ingredients:</Typography>
                        {recipe.ingredients.map((ingredient, ingredientIndex) => (
                          <Typography key={ingredientIndex} variant="body2">
                            {ingredient.name}: {ingredient.quantity}
                          </Typography>
                        ))}
                        <Typography variant="body2">Instructions: {recipe.instructions}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Card>
          ))}
        </Box>
      </main>
    </>
  );
}