// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import {render, screen} from '@testing-library/react';
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true)
})

test("Spinner renders as expected", () => {
render(<Spinner />)
})

test("Spinner is there when spinnerOn", () => {
  const SpinnerComponent = render(<Spinner />);
  expect(SpinnerComponent).toMatchSnapshot();
  })

test("Spinner is there when spinnerOn, test 2", () => {
    render(<Spinner spinnerOn={true}/>)
    const displayText = screen.queryByText(/Please wait.../i);
    expect(displayText).not.toBeNull();
    })

test("Spinner is not there when !spinnerOn", () => {
    render(<Spinner spinnerOn={false}/>)
    const displayText = screen.queryByText(/Please wait.../i);
    expect(displayText).toBeNull();
    })