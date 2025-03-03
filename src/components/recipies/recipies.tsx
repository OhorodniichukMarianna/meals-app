import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Pagination, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Meal, MealsResponse } from "../../models/Meal.model";
import { useDispatch, useSelector } from "react-redux";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
import React from "react";
import { setSelectedMeals } from "../../stores/actions";

function useMeals(value: string) {
    return useQuery({
        queryKey: ['meals', value],
        queryFn: async (): Promise<MealsResponse> => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
            return await response.json()
        },
    })
}

export function Recipies() {
    const dispatch = useDispatch();
    const selectedMeals = useSelector((state: any) => state.selectedMeals);
    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string | undefined>(undefined);
    const { status, data, error, isFetching } = useMeals(search);
    const searchRecipies = useDebouncedCallback(value => {
        setSearch(value);
    }, 500);
    const filteredMeals = useMemo(() => {
        if (!category) {
            return data?.meals || [];
        }
        return data?.meals.filter((m: Meal) => m.strCategory === category) || [];
    }, [data, category])
    const categories = useMemo(() => {
        return [...new Set(data?.meals.map((m: Meal) => m.strCategory))];
    }, [data])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil((data?.meals?.length || 0) / itemsPerPage)
    const handlePageChange = (page: number | string) => {
        if (typeof page === 'string') return;
        setCurrentPage(page);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMeals = useMemo(() => filteredMeals.slice(indexOfFirstItem, indexOfLastItem), [filteredMeals]);
    const visiblePages = () => {
        let pages = [];

        for (let i = 1; i <= Math.min(7, totalPages); i++) {
            pages.push(i);
        }

        if (totalPages > 7) {
            pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const handleSelectMeal = (meal: Meal) => {
        const mealsToUpdate = selectedMeals.find((m: Meal) => m.idMeal === meal.idMeal)
            ? selectedMeals.filter((m: Meal) => m.idMeal !== meal.idMeal)
            : [...selectedMeals, meal]
        dispatch(setSelectedMeals(mealsToUpdate));
    };

    const navigate = useNavigate();
    const openFavourites = () => {
        navigate("/favourites");
    };

    return <>
        <Container className="mt-4">
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
                <Form.Control
                    placeholder="Start typing"
                    aria-label="Recipy"
                    aria-describedby="basic-addon1"
                    onChange={e => searchRecipies(e.target.value)}
                />
                <InputGroup.Text id="basic-addon1">Category</InputGroup.Text>
                <Form.Select aria-label="Categories" onChange={e => setCategory(e.target.value)}>
                    <option>Select...</option>
                    {categories.map(c => (<option value={c}>{c}</option>))}
                </Form.Select>
            </InputGroup>
            <Row>
                {currentMeals?.map((meal: any) => (
                    <Col key={meal.idMeal} md={4} className="mb-4">

                        <Card>
                            <Link to={`/meal/${meal.idMeal}`}>
                                <Card.Img variant="top" src={meal.strMealThumb} />
                            </Link>
                            <Card.Body>
                                <Card.Title>{meal.strMeal}</Card.Title>
                                <Card.Text>{meal.strArea}</Card.Text>
                                <Card.Text>{meal.strCategory}</Card.Text>
                                <Form.Check
                                    type="checkbox"
                                    label="Select"
                                    onChange={() => handleSelectMeal(meal)}
                                    checked={selectedMeals?.some((m: Meal) => m.idMeal === meal.idMeal)}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination>
                {visiblePages().map((page, index) => {
                    if (page === "...") {
                        return <Pagination.Ellipsis key={index} />;
                    }

                    return (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    );
                })}
            </Pagination>
            <Button
                variant="primary"
                disabled={selectedMeals?.length === 0}
                onClick={openFavourites}>View Ingredients</Button>
        </Container>
    </>
}