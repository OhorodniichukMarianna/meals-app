import React from "react";
import { Container, ListGroup, Card, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Meal } from "../../models/Meal.model";

export function Favourites() {
    const meals = useSelector((state: any) => state.selectedMeals);
    const combinedIngredients: string[] = [];

    meals?.forEach((meal: Meal) => {
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "" && measure && measure.trim() !== "") {
                combinedIngredients.push(`${measure} ${ingredient}`);
            }
        }
    });

    return (
        <Container className="mt-4">
            <h2>Ingredients for Selected Meals</h2>
            <Row>
                {meals?.map((meal: Meal) => (
                    <Col key={meal.idMeal} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={meal.strMealThumb} />
                            <Card.Body>
                                <Card.Title>{meal.strMeal}</Card.Title>
                                <Card.Text>{meal.strCategory}</Card.Text>
                                <Card.Text>{meal.strArea}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h3>Combined Ingredients</h3>
            <ListGroup>
                {combinedIngredients?.map((ingredient, index) => (
                    <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}
