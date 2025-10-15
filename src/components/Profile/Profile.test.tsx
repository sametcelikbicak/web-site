import { render } from '@testing-library/react';
import Profile from '@/components/Profile/Profile';

describe('Profile', () => {
  it('renders without crashing', () => {
    render(<Profile />);
  });
});
