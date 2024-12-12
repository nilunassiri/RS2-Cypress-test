import {constants} from "../../support/constants";
import {selectors} from "../../support/selectors";

describe('Weather Shopper - Sunscreen Shopping and Payment', () => {

    beforeEach(() => {
        cy.visit(constants.urls.moisturizer);
        cy.addRandomProductsToCart(2);
        cy.get(selectors.cart.cartButton).click();
        cy.url().should('include', '/cart');
        cy.get(selectors.cart.tableRow).should('have.length.greaterThan', 1);
    });

    it('should verify elements on the cart page', () => {
        cy.get('table').should('be.visible');
        cy.get(selectors.cart.tableRow)
            .should('exist')
            .and('have.length.greaterThan', 0)
            .then((rows) => {
                cy.log(`Number of rows in the cart: ${rows.length}`);
            });

        cy.get(selectors.cart.checkoutHeading)
            .should('be.visible')
            .and('contain.text', 'Checkout');

        cy.get(selectors.cart.tableHeadingItem)
            .should('be.visible')
            .and('contain.text', 'Item');

        cy.get(selectors.cart.tableHeadingPrice)
            .should('be.visible')
            .and('contain.text', 'Price');

        cy.get(selectors.cart.totalPrice).invoke('text').then((text) => {
            expect(text.trim()).to.match(/Total: Rupees \d+/);
        });

        cy.get(selectors.cart.stripeButton)
            .should('be.visible')
            .and('contain.text', 'Pay with Card');
    });

    it('should shop for sunscreens and complete the payment successfully', () => {
        cy.handlePayment();
        cy.validatePaymentSuccess();
    });
});