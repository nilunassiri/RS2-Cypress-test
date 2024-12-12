describe('Weather Shopper - Sunscreen Shopping and Payment', () => {
    const selectors = {
        cartButton: 'button[onclick="goToCart()"]',
        tableRow: 'tbody tr',
        cartItemName: 'tbody tr td:first-child',
        cartItemPrice: 'tbody tr td:nth-child(2)',
        totalPrice: '#total',
        checkoutHeading: 'h2',
        tableHeadingItem: 'table thead tr th:nth-child(1)',
        tableHeadingPrice: 'table thead tr th:nth-child(2)',
        stripeButton: '.stripe-button-el > span',
    };

    beforeEach(() => {
        cy.visit('https://weathershopper.pythonanywhere.com/sunscreen');
        cy.addRandomProductsToCart(2);
        cy.get(selectors.cartButton).click();
        cy.url().should('include', '/cart');
        cy.get(selectors.tableRow).should('have.length.greaterThan', 0);
    });

    it('should verify elements on the cart page', () => {
        cy.get('table').should('be.visible');
        cy.get(selectors.tableRow)
            .should('exist')
            .and('have.length.greaterThan', 0)
            .then((rows) => {
                cy.log(`Number of rows in the cart: ${rows.length}`);
            });

        cy.get(selectors.checkoutHeading)
            .should('be.visible')
            .and('contain.text', 'Checkout');

        cy.get(selectors.tableHeadingItem)
            .should('be.visible')
            .and('contain.text', 'Item');

        cy.get(selectors.tableHeadingPrice)
            .should('be.visible')
            .and('contain.text', 'Price');

        cy.get(selectors.totalPrice).invoke('text').then((text) => {
            expect(text.trim()).to.match(/Total: Rupees \d+/);
        });

        cy.get(selectors.stripeButton)
            .should('be.visible')
            .and('contain.text', 'Pay with Card');
    });

    it('should shop for sunscreens and complete the payment successfully', () => {
        cy.handlePayment();
        cy.validatePaymentSuccess();
    });
});