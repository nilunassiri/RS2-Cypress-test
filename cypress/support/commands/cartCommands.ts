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
    cy.fixture('payment.json').then((paymentData) => {
        cy.contains('button', 'Pay with Card').click();

        cy.frameLoaded('iframe[src*="stripe"]');
        cy.iframe('iframe[src*="stripe"]').within(() => {

            cy.get('#email').type(paymentData.email, { force: true });
            cy.get('#card_number').type(paymentData.validCard.cardNumber, { force: true });
            cy.get('#cc-exp').type(paymentData.validCard.expiry, { force: true });
            cy.get('#cc-csc').type(paymentData.validCard.cvc, { force: true });
            cy.get('#billing-zip').type(paymentData.validCard.zip, { force: true });

            cy.contains('button', 'Pay').click();
        });
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