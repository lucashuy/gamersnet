import {render, screen} from '@testing-library/react';

import {SignIn} from '../components/signin'

beforeEach(() => {
    render(<SignIn />);
})

describe('Unit test sign in component', () => {
    test('Render  sign in component', () => {
        
        expect(screen.getByText('Login to GamersNet')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    });
});