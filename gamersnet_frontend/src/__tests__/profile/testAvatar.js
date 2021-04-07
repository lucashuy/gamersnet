import { render, screen, waitFor } from '@testing-library/react';
import ProfileChangeAvatar from '../../components/profileChangeAvatar';
import '@testing-library/jest-dom';
import { Simulate } from 'react-dom/test-utils';

beforeEach(() => {
    render(<ProfileChangeAvatar />);
});

describe('ProfileChangeAvatar Component Tests', () => {
    test('Render standard component', () => {
        expect(screen.getByLabelText('select image')).toBeInTheDocument();
    });

    // untested/incomplete code
    // test('Render standard component', () => {
    //     expect(screen.getByLabelText('select image')).toBeInTheDocument();

    //     const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    //     const imageInput = getByLabelText('choose image')
    //     Simulate.change(imageInput, { target: { files: [file] } })

    //     await waitFor(() => getByAltText('image-preview'))
    //     const dataURL = getByAltText('image-preview').src
    //     expect(dataURL).toMatchSnapshot(
    //         'data url in the image-preview src for this string: "(⌐□_□)"',
    //     )

    //     // ensure the form is submittable
    //     expect(getByText('Upload Image').type).toBe('submit')
    // });
});
