import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import BookList from '../components/BookList'; 

describe('BookList', () => {

    // Component renders a list of books when data is successfully fetched
    it('should render a list of books when data is successfully fetched', async () => {
      // Mock data
      const mockBooks = [
        { _id: '1', title: 'Book 1', author: 'Author 1', price: 10.99, quantity: 5 },
        { _id: '2', title: 'Book 2', author: 'Author 2', price: 12.99, quantity: 3 }
      ];
  
      // Mock fetch response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBooks)
      });
  
      // Render component
      const { findAllByRole, getByText } = render(<BookList />);
  
      // Wait for loading to complete
      await waitForElementToBeRemoved(() => screen.queryByText('Loading books...'));
  
      // Assert book list is rendered
      const listItems = await findAllByRole('listitem');
      expect(listItems).toHaveLength(2);
  
      // Check if book titles are displayed
      expect(getByText('Book 1')).toBeInTheDocument();
      expect(getByText('Book 2')).toBeInTheDocument();
  
      // Check if book authors are displayed
      expect(getByText('by Author 1')).toBeInTheDocument();
      expect(getByText('by Author 2')).toBeInTheDocument();
  
      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledWith('/api/books');
    });

    // Component handles empty book list by showing appropriate message
    it('should display empty state message when no books are available', async () => {
      // Mock empty books array
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([])
      });
  
      // Render component
      const { getByText } = render(<BookList />);
  
      // Wait for loading to complete
      await waitForElementToBeRemoved(() => screen.queryByText('Loading books...'));
  
      // Assert empty state message is displayed
      expect(getByText('No books in inventory. Add some books to get started!')).toBeInTheDocument();
  
      // Verify fetch was called
      expect(fetch).toHaveBeenCalledWith('/api/books');
    });
});
