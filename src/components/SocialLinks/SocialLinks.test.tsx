import { render } from '@testing-library/react';
import SocialLinks from './SocialLinks';

describe('SocialLinks', () => {
  it('renders without crashing', () => {
    render(<SocialLinks />);
  });
});
