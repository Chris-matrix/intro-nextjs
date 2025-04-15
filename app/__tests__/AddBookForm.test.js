import AddBookForm from '../components/AddBookForm';
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

describe('AddBookForm', () => {

    // Form submission with valid data calls fetch API with correct parameters
    it('should call fetch API with correct parameters when form is submitted with valid data', async () => {
      // Mock fetch API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
      });
  
      // Mock onBookAdded callback
      const mockOnBookAdded = jest.fn();
  
      // Render component
      const { getByLabelText, getByText } = render(<AddBookForm onBookAdded={mockOnBookAdded} />);
  
      // Fill form fields
      fireEvent.change(getByLabelText('Title'), { target: { value: 'Test Book' } });
      fireEvent.change(getByLabelText('Author'), { target: { value: 'Test Author' } });
      fireEvent.change(getByLabelText('Price ($)'), { target: { value: '19.99' } });
      fireEvent.change(getByLabelText('Quantity'), { target: { value: '5' } });
  
      // Submit form
      fireEvent.click(getByText('Add Book'));
  
      // Wait for async operations
      await waitFor(() => {
        // Verify fetch was called with correct parameters
        expect(fetch).toHaveBeenCalledWith('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Book',
            author: 'Test Author',
            price: 19.99,
            quantity: 5
          }),
        });
    
        // Verify callback was called
        expect(mockOnBookAdded).toHaveBeenCalled();
      });
    });

    // Form submission with empty fields shows validation error
    it('should display validation error when form is submitted with empty fields', async () => {
      // Mock fetch API
      global.fetch = jest.fn();
  
      // Render component
      const { getByText, queryByText } = render(<AddBookForm />);
  
      // Verify error message is not initially present
      expect(queryByText('All fields are required')).not.toBeInTheDocument();
  
      // Submit form without filling any fields
      fireEvent.click(getByText('Add Book'));
  
      // Verify error message is displayed
      expect(getByText('All fields are required')).toBeInTheDocument();
  
      // Verify fetch was not called
      expect(fetch).not.toHaveBeenCalled();
    });
});
