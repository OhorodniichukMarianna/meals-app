import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import React from "react";
import { MealsResponse } from "../../../models/Meal.model";

function useMealDetail(value: string) {
    return useQuery({
        queryKey: ['meal', value],
        queryFn: async (): Promise<MealsResponse> => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`)
            return await response.json()
        },
    })
}

export function Meal() {
    const { id } = useParams<{ id: string }>();
    const { data, status, error } = useMealDetail(id as string);
    const meal = data?.meals.length !== 0 ? data?.meals[0] : undefined;

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Img variant="top" src={meal?.strMealThumb} />
                        <Card.Body>
                            <Card.Title>{meal?.strMeal}</Card.Title>
                            <Card.Text><strong>Category:</strong> {meal?.strCategory}</Card.Text>
                            <Card.Text><strong>Area:</strong> {meal?.strArea}</Card.Text>
                            <Card.Text><strong>Instructions:</strong> {meal?.strInstructions}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Details</Card.Title>
                            <ListGroup variant="flush">
                                {meal?.strTags && (
                                    <ListGroup.Item><strong>Tags:</strong> {meal.strTags}</ListGroup.Item>
                                )}
                                {meal?.strDrinkAlternate && (
                                    <ListGroup.Item><strong>Alternate Drink:</strong> {meal.strDrinkAlternate}</ListGroup.Item>
                                )}
                                {meal?.strSource && (
                                    <ListGroup.Item><strong>Source:</strong> <a href={meal.strSource} target="_blank" rel="noopener noreferrer">Link</a></ListGroup.Item>
                                )}
                                {meal?.strYoutube && (
                                    <ListGroup.Item><strong>YouTube:</strong> <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">Watch Video</a></ListGroup.Item>
                                )}
                                {meal?.strCreativeCommonsConfirmed && (
                                    <ListGroup.Item><strong>Creative Commons Confirmed:</strong> {meal.strCreativeCommonsConfirmed}</ListGroup.Item>
                                )}
                                {meal?.dateModified && (
                                    <ListGroup.Item><strong>Last Modified:</strong> {meal.dateModified}</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Ingredients</Card.Title>
                            <ListGroup variant="flush">
                                {Array.from({ length: 20 }).map((_, index: number) => {
                                    const ingredient = meal?.[`strIngredient${index + 1}`];
                                    const measure = meal?.[`strMeasure${index + 1}`];
                                    if (ingredient) {
                                        return (
                                            <ListGroup.Item key={index}>
                                                <strong>{ingredient}</strong>: {measure}
                                            </ListGroup.Item>
                                        );
                                    }
                                    return null;
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
