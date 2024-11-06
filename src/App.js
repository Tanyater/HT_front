import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [recipes, setRecipes] = useState([]);
    const [ipAddress, setIpAddress] = useState('');
    const [recipeText, setRecipeText] = useState('');

    // Function to get the user's IP address
    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error("Error fetching IP address:", error);
        }
    };

    // Function to fetch all recipes
    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://54.89.130.1:5000/recipes');
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    // Fetch IP address and recipes on component load
    useEffect(() => {
        fetchIpAddress();
        fetchRecipes();
    }, []);

    // Function to add a new recipe
    const handleAddRecipe = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit

        try {
            await axios.post('http://54.89.130.1:5000/recipes', {
                ip_address: ipAddress,
                recipe_text: recipeText,
            });

            // Refresh the list of recipes after adding a new one
            fetchRecipes();

            // Clear the input field
            setRecipeText('');
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    return (
        <div>
            <h1>Culinary Recipes</h1>

            <form onSubmit={handleAddRecipe}>
                <textarea
                    placeholder="Enter your recipe here"
                    value={recipeText}
                    onChange={(e) => setRecipeText(e.target.value)}
                    required
                />
                <button type="submit">Add Recipe</button>
            </form>

            <h2>All Recipes:</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <strong>{recipe.ip_address}</strong>: {recipe.recipe_text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
