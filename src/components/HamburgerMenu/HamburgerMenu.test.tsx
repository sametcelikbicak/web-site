import { render } from '@testing-library/react';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';

describe('HamburgerMenu', () => {
  it('renders without crashing', () => {
    render(
      <HamburgerMenu open={false} onClose={() => {}}>
        <div>Menu Content</div>
      </HamburgerMenu>
    );
  });
});
