import { render } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders without crashing', () => {
    render(<About />);
  });
});
