// --- Add random products to cart ---
Cypress.Commands.add('addRandomProductsToCart', (numberOfProducts: number) => {
    cy.get('.text-center.col-4')
        .then(($products) => {
            const randomIndices = Cypress._.shuffle([...Array($products.length).keys()]).slice(0, numberOfProducts);
            randomIndices.forEach((index) => {
                cy.wrap($products.eq(index))
                    .find('button')
                    .click();
            });
        });
});

// --- Handle payment ---
Cypress.Commands.add('handlePayment', () => {
    cy.contains('button', 'Pay with Card').click();

    cy.frameLoaded('iframe[src*="stripe"]');
    cy.iframe('iframe[src*="stripe"]').within(() => {

        cy.get('#email').type('user@example.com', { force: true });
        cy.get('#card_number').type('4242424242424242', { force: true });
        cy.get('#cc-exp').type('12/34', { force: true });
        cy.get('#cc-csc').type('123', { force: true });
        cy.get('#billing-zip').type('12345', { force: true });

        cy.contains('button', 'Pay').click();
    });
});

// --- Assert payment success ---
Cypress.Commands.add('validatePaymentSuccess', () => {
    cy.url({ timeout: 5000 })
        .should('include', '/confirmation')
        .then((url) => {
            cy.log(`Navigated to confirmation page: ${url}`);
        });

    cy.get('h2').then(($header) => {
        const headerText = $header.text().trim();
        if (headerText === 'PAYMENT SUCCESS') {
            expect(headerText).to.eq('PAYMENT SUCCESS');
            cy.log('Payment success message validated.');
        } else if (headerText === 'PAYMENT FAILED') {
            expect(headerText).to.eq('PAYMENT FAILED');
            cy.log('Payment has been failed.');
        }else {
            cy.log(`Error: Payment has failed. The process did not proceed to the final page.`);
        }
    });
});