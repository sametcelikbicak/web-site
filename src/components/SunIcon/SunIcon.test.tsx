import { render } from '@testing-library/react';
import SunIcon from '@/components/SunIcon/SunIcon';

describe('SunIcon', () => {
  it('renders without crashing', () => {
    render(<SunIcon />);
  });
});
