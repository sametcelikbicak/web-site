import { render } from '@testing-library/react';
import Header from './Header';
import { ThemeContext, ThemeContextProps } from '../../types/theme';
import { MemoryRouter } from 'react-router-dom';

const mockThemeContext: ThemeContextProps = {
  theme: 'light',
  toggleTheme: jest.fn(),
};

describe('Header', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ThemeContext value={mockThemeContext}>
          <Header />
        </ThemeContext>
      </MemoryRouter>
    );
  });
});
