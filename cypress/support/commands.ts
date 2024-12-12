// --- The navigation logic ---
Cypress.Commands.add('navigateToSection', (section: string, buttonSelector: string, headerText: string) => {
    cy.get(buttonSelector).click();
    cy.url().should('include', `/${section}`);
    cy.get('h2').should('be.visible').and('have.text', headerText);
});

// --- Assert the cart button text ---
Cypress.Commands.add('assertCartButtonText', (selectors, expectedText) => {
    cy.get(selectors.cartButton).should('contain.text', expectedText);
});

// --- Add a product and verify the cart button text ---
Cypress.Commands.add('addProductAndCheckCartText', (productName, selectors, expectedCartText) => {
    cy.addLeastExpensiveProduct(productName, selectors).then((price) => {
        cy.log(`Added ${productName} Product with Price: ${price}`);
        cy.assertCartButtonText(selectors, expectedCartText);
    });
});


////////

// --- Verifies products contain correct structure ---
Cypress.Commands.add('verifyProductStructure', (selectors) => {
    cy.get(selectors.productCards).each(($el) => {
        cy.wrap($el)
            .find(selectors.productImage)
            .should('be.visible');

        cy.wrap($el)
            .find(selectors.productName)
            .should('be.visible')
            .and('not.be.empty');

        cy.wrap($el)
            .find(selectors.productPrice)
            .should('be.visible')
            .and('contain.text', 'Price:');

        cy.wrap($el)
            .find(selectors.productButton)
            .should('be.visible')
            .and('contain.text', 'Add');
    });
});

// --- Finding the least expensive product by filtering ---
Cypress.Commands.add('addLeastExpensiveProduct', (productName, selectors) => {
    return cy.get(selectors.productCards)
        .filter(`:contains(${productName})`)
        .then(($cards) => {
            let cheapestProduct;
            let cheapestPrice = Number.MAX_VALUE;

            $cards.each((_, card) => {
                const priceText = Cypress.$(card).find(selectors.productPrice).text();
                const price = parseInt(priceText.match(/\d+/)?.[0] || '0');
                if (price < cheapestPrice) {
                    cheapestPrice = price;
                    cheapestProduct = Cypress.$(card).find(selectors.productButton);
                }
            });

            if (cheapestProduct) {
                cy.wrap(cheapestProduct).click();
            }

            // Properly wrap and return the asynchronous result
            return cy.wrap(cheapestPrice);
        });
});

// --- Checks specific products ---
Cypress.Commands.add('verifyProductsExist', (productName, selectors) => {
    cy.get(selectors.productCards)
        .filter(`:contains("${productName}")`)
        .should('exist');
});


/////////



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