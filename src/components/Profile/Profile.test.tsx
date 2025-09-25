import { render } from '@testing-library/react';
import Profile from './Profile';

describe('Profile', () => {
  it('renders without crashing', () => {
    render(<Profile />);
  });
});
