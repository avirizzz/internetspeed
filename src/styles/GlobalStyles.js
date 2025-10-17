import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --toastify-color-dark: ${({ theme }) => theme.card};
    --toastify-color-success: ${({ theme }) => theme.success};
    --toastify-color-error: ${({ theme }) => theme.error};
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.backgroundGradient};
    color: ${({ theme }) => theme.text};
    min-height: 100vh;
    overflow-x: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button, input, select {
    font-family: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundDark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.primaryLight};
  }

  /* Selection color */
  ::selection {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.textLight};
  }
`;