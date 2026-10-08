import express, { type Request, type Response, type NextFunction } from "express"

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000


const recipes = [
    { id: 1, name: "Spaghetti Bolognese", ingredients: ["spaghetti", "ground beef", "tomato sauce"] },
    { id: 2, name: "Chicken Curry", ingredients: ["chicken breast", "curry paste", "coconut milk"] }
]

app.get("/", (req: Request, res: Response) => {
    res.send("Töötab. Jah töötab.")
})

app.get("/recipes", (req: Request, res: Response) => {
    const result = recipes.map(recipe => ({ id: recipe.id, name: recipe.name, ingredients: recipe.ingredients }))   
    res.json(result)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})