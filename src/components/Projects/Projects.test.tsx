import { render } from '@testing-library/react';
import Projects from './Projects';

describe('Projects', () => {
  it('renders without crashing', () => {
    render(<Projects />);
  });
});
