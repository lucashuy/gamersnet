import {render} from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import Register from "../../components/register";

describe('Register Component Tests', () => {

    test('Render standard component', () => {
        const {queryByText, queryByPlaceholderText} = render(<BrowserRouter><Register /></BrowserRouter>);

        const create = queryByText("Create a GamersNet account");
        expect(create).toBeTruthy();

        const username = queryByPlaceholderText("username");
        expect(username).toBeTruthy();

        const password = queryByPlaceholderText("password");
        expect([password]).toBeTruthy();
    });
});