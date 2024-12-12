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

// --- Checks specific products ---
Cypress.Commands.add('verifyProductsExist', (productName, selectors) => {
    cy.get(selectors.productCards)
        .filter(`:contains("${productName}")`)
        .should('exist');
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
            return cy.wrap(cheapestPrice);
        });
});