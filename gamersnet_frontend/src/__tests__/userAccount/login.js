import {render} from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import SignIn from "../../components/signin";

describe('Sign In Component Tests', () => {

    test('Render standard component', () => {
        const {queryByText, queryByPlaceholderText} = render(<BrowserRouter><SignIn /></BrowserRouter>);

        const login = queryByText("Login to GamersNet");
        expect(login).toBeTruthy();

        const username = queryByPlaceholderText("username");
        expect(username).toBeTruthy();

        const password = queryByPlaceholderText("password");
        expect([password]).toBeTruthy();

    });
});