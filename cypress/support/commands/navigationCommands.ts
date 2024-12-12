// Navigate to a specific section
Cypress.Commands.add('navigateToSection', (section: string, buttonSelector: string, headerText: string) => {
    cy.get(buttonSelector).click();
    cy.url().should('include', `/${section}`);
    cy.get('h2').should('be.visible').and('have.text', headerText);
});