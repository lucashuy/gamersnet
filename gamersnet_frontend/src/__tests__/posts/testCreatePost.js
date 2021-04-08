import {render, screen} from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';

import AddPost from "../../components/createPost";

describe('Sign In Component Tests', () => {

    test('Render standard component', () => {
        const {queryByText, queryByPlaceholderText} =  render(<BrowserRouter><AddPost /></BrowserRouter>);

        const newPost = queryByText("Create a Post:");
        expect(newPost).toBeTruthy();

        const des = queryByText("Description");
        expect(des).toBeTruthy();

        const addGameName = queryByText("Add Game Name you want to play:");
        expect(addGameName).toBeTruthy();

        const numPlayers = queryByText("Number of players to play with:");
        expect(numPlayers).toBeTruthy();

        const location = queryByText("Add location:");
        expect(location).toBeTruthy();

        const duration = queryByText("Duration to play:");
        expect(duration).toBeTruthy();

        expect(screen.getByPlaceholderText("eg. 1hr 30mins")).toBeTruthy();

        const date = queryByText("Select a date to play on:");
        expect(date).toBeTruthy();

        const post = queryByText("Post");
        expect(post).toBeTruthy();

    });
});