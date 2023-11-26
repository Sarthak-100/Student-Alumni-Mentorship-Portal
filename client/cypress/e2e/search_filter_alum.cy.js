describe('filter Alumni', () => {
    it('should be able to filter an alumni by name from searching', () => {
        cy.visit('localhost:5000')
        cy.findByRole('textbox').type('S')
        cy.findByRole('heading', {
            name: /swati gaba/i
          }).should('exist');
        cy.findByRole('heading', {
        name: /sagar khurana/i
        }).should('exist');
        cy.findByRole('heading', {
            name: /sarthak bajaj/i
        }).should('exist');
        cy.findByRole('heading', {
            name: /sahil yadav/i
          }).should('exist');
    })})