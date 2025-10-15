import { render } from '@testing-library/react';
import MoonIcon from '@/components/MoonIcon/MoonIcon';

describe('MoonIcon', () => {
  it('renders without crashing', () => {
    render(<MoonIcon />);
  });
});
