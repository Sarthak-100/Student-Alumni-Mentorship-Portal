describe('filter Alumni', () => {
    it('should be able to filter an alumni', () => {
        cy.visit('localhost:5000')
        cy.findByTestId('FilterAltIcon').click()
        cy.findByRole('combobox', {
            name: /batch/i
          }).click()
        cy.findByRole('option', {
        name: /2011/i
        }).click()
        cy.findByRole('IconButton', {
            name: /apply filters/i
          }).click()
        cy.findByText('2011').should('exist');
    })})