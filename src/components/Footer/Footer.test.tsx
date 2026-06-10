import { render } from '@testing-library/react';
import Footer from '@/components/Footer/Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });
});
