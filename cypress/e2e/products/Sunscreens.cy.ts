describe('Shopping for Sunscreens', () => {
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
        cy.visit('https://weathershopper.pythonanywhere.com/sunscreen');
        cy.verifyProductStructure(selectors);
    });

    it('should verify products exist by SPF level', () => {
        cy.verifyProductsExist('SPF-50', selectors);
        cy.verifyProductsExist('SPF-30', selectors);
    });

    it('should add products, update the cart button, and verify least expensive items in the cart', () => {
        cy.assertCartButtonText(selectors, 'Empty');

        cy.addProductAndCheckCartText('SPF-50', selectors, '1 item(s)');
        cy.addProductAndCheckCartText('SPF-30', selectors, '2 item(s)');

        cy.wrap([]).then((selectedPrices: number[]) => {
            cy.addLeastExpensiveProduct('SPF-50', selectors).then((price) => {
                cy.log(`SPF-50 Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.addLeastExpensiveProduct('SPF-30', selectors).then((price) => {
                cy.log(`SPF-30 Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.get(selectors.cartButton).should('be.visible').click();

            cy.url().should('include', '/cart');

            cy.get(selectors.tableRow).should('have.length', 2);

            cy.get(selectors.cartItemName)
                .should('contain.text', 'SPF-50')
                .and('contain.text', 'SPF-30');

            // Assert individual price
            cy.get(selectors.cartItemPrice).each(($price, index) => {
                const actualPrice = parseInt($price.text().trim());
                cy.log(`Actual Price in Cart [Item ${index + 1}]: ${actualPrice}`);
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