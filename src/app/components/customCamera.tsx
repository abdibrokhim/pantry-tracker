'use client';

import React, { useState, useRef, RefObject } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { Button, Box, IconButton, CircularProgress, Typography, Card, CardContent, CardMedia, TextField } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import OpenAI from 'openai';
import { firebaseConfig } from '../firebaseConfig';
import { Food } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export default function CameraComponent() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jsonResponse, setJsonResponse] = useState<Food | null>(null);
  const [editableData, setEditableData] = useState<Partial<Food>>({});

  const instructions = `You are given an image of food. Return json in string format with the following. make sure it's parsable: 
  [example]
  {
      "name": "apple",
      "shortInfo": "A fruit that is red and sweet",
      "benefits": "Apples are high in fiber and vitamin C",
      "quantity": 3,
      "recipes": [
          {
              "name": "apple pie",
              "ingredients": [
                  {
                      "name": "apple",
                      "quantity": 3
                  },
                  {
                      "name": "sugar",
                      "quantity": 1
                  },
                  {
                      "name": "flour",
                      "quantity": 1
                  }
              ],
              "instructions": "bake apples, sugar, and flour"
          },
          {
              "name": "apple sauce",
              "ingredients": [
                  {
                      "name": "apple",
                      "quantity": 3
                  },
                  {
                      "name": "sugar",
                      "quantity": 1
                  }
              ],
              "instructions": "boil apples and sugar"
          }
      ]
  }
  `;

  const handleTakePhoto = async () => {
    setLoading(true);
    const takenPhoto = camera.current?.takePhoto() as string;
    if (!takenPhoto) {
      setLoading(false);
      return;
    }
    setImage(takenPhoto);

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);
    await uploadString(storageRef, takenPhoto, 'data_url');
    const uploadedImageUrl = await getDownloadURL(storageRef);
    setImageUrl(uploadedImageUrl);

    // Get prediction from OpenAI
    const prediction = await predict(uploadedImageUrl);

    console.log('prediction:\n', prediction);

    // Extract JSON from markdown response
    const jsonMatch = prediction.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      const jsonResponse: Food = JSON.parse(jsonMatch[1].trim());
      setJsonResponse(jsonResponse);
      setEditableData(jsonResponse);
      console.log("jsonResponse: ", jsonResponse);
    } else {
      console.error('No JSON found in prediction:', prediction);
    }
    setLoading(false);
  };

  const predict = async (url: string): Promise<string> => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instructions },
            {
              type: "image_url",
              image_url: {
                "url": url,
              },
            },
          ],
        },
      ],
    });
    if (response.choices[0].message.content) {
      return response.choices[0].message.content;
    } else {
      return '';
    }
  };

  const handleSave = async () => {
    if (image && jsonResponse) {
      const docRef = doc(firestore, 'products', `${Date.now()}`);
      await setDoc(docRef, {
        imageUrl,
        jsonResponse: editableData,
      });
      alert('Data saved successfully!');

      // Reset state
      setImage(null);
      setImageUrl(null);
      setJsonResponse(null);
      setEditableData({});
    }
  };

  const handleChange = (field: keyof Food, value: any) => {
    setEditableData({
      ...editableData,
      [field]: value,
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Box width="100%" height="auto" mb={2}>
        <Camera
          ref={camera as RefObject<CameraType>}
          aspectRatio={1/1}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.',
          }}
        />
      </Box>
      <IconButton onClick={handleTakePhoto} color="primary" aria-label="take photo" size="large">
        <CameraAltIcon fontSize="large" />
      </IconButton>
      {loading && <CircularProgress />}
      {image && (
        <Box mt={2}>
          <img src={image} alt="Taken photo" width="100%" />
        </Box>
      )}
      {jsonResponse && (
        <>
        <Typography variant="h5" mt={2} mb={2}>Edit Data Before Saving</Typography>
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} alignItems="center" justifyContent="center" p={2}>
          <Card sx={{ maxWidth: 345, mb: 2 }}>
            <CardMedia component="img" width="140" image={imageUrl || ''} alt="Food image" />
            <CardContent>
              <TextField
                label="Name"
                variant="outlined"
                value={editableData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                value={editableData.shortInfo || ''}
                onChange={(e) => handleChange('shortInfo', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Benefits"
                variant="outlined"
                value={editableData.benefits || ''}
                onChange={(e) => handleChange('benefits', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Quantity"
                variant="outlined"
                type="number"
                value={editableData.quantity || 0}
                onChange={(e) => handleChange('quantity', Number(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" mt={1} mb={1}>Recipes:</Typography>
              {editableData.recipes?.map((recipe, index) => (
                <Box key={index} mb={1}>
                  <Typography variant="body2">Name: {recipe.name}</Typography>
                  <Typography variant="body2">Ingredients:</Typography>
                  {recipe.ingredients.map((ingredient, ingredientIndex) => (
                    <Typography key={ingredientIndex} variant="body2">
                      {ingredient.name}: {ingredient.quantity}
                    </Typography>
                  ))}
                  <Typography variant="body2">Instructions: {recipe.instructions}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
      </Box>
      </>
      )}
      {image && jsonResponse && (
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      )}
    </Box>
  );
}
