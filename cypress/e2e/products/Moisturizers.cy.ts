describe('Shopping for Moisturizers', () => {
    const selectors = {
        productCards: '.text-center.col-4',
        productImage: 'img',
        productName: 'p:first-of-type',
        productPrice: 'p:contains("Price:")',
        productButton: 'button',
        cartButton: 'button[onclick="goToCart()"]',
        tableRow: 'tbody tr',
        cartItemName: 'tbody tr td:first-child',
        cartItemPrice: 'tbody tr td:nth-child(2)',
        totalPrice: '#total',
    };

    beforeEach(() => {
        cy.visit('https://weathershopper.pythonanywhere.com/moisturizer');
        cy.verifyProductStructure(selectors);
    });

    it('should verify products exist by name', () => {
        cy.verifyProductsExist('Aloe', selectors);
        cy.verifyProductsExist('Almond', selectors);
    });

    it('should add products, update the cart button, and verify least expensive items in the cart', () => {
        cy.assertCartButtonText(selectors, 'Empty');

        cy.addProductAndCheckCartText('Aloe', selectors, '1 item(s)');
        cy.addProductAndCheckCartText('Almond', selectors, '2 item(s)');

        cy.wrap([]).then((selectedPrices: number[]) => {
            cy.addLeastExpensiveProduct('Aloe', selectors).then((price) => {
                cy.log(`Aloe Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.addLeastExpensiveProduct('Almond', selectors).then((price) => {
                cy.log(`Almond Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.get(selectors.cartButton).should('be.visible').click();

            cy.url().should('include', '/cart');

            cy.get(selectors.tableRow).should('have.length', 2);

            cy.get(selectors.cartItemName).should('contain.text', 'Aloe').and('contain.text', 'Almond');

            cy.get(selectors.cartItemPrice).each(($price, index) => {
                const actualPrice = parseInt($price.text().trim());
                cy.log(`Actual Price in Cart [Item ${index + 1}]: ${actualPrice}`);
                // Assert individual price
                expect(actualPrice).to.equal(selectedPrices[index]);
            });

            cy.wrap(null).then(() => {
                const expectedTotal = selectedPrices.reduce((sum, price) => sum + price, 0);
                cy.log(`Expected Total: ${expectedTotal}`);

                // Assert total price
                cy.get(selectors.totalPrice).then(($total) => {
                    const totalText = $total.text().match(/\d+/)?.[0];
                    const actualTotal = parseInt(totalText || '0');
                    cy.log(`Actual Total Displayed in Cart: ${actualTotal}`);
                    expect(actualTotal).to.equal(expectedTotal);
                });
            });
        });
    });
});