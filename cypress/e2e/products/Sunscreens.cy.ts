import { selectors } from '../../support/selectors';
import { constants } from '../../support/constants';

describe('Shopping for Sunscreens', () => {

    beforeEach(() => {
        cy.visit(constants.urls.sunscreen);
        cy.verifyProductStructure(selectors.products);
    });

    it('should verify products exist by SPF level', () => {
        cy.verifyProductsExist('SPF-50', selectors.products);
        cy.verifyProductsExist('SPF-30', selectors.products);
    });

    it('should add products, update the cart button, and verify least expensive items in the cart', () => {
        cy.assertCartButtonText(selectors.products, 'Empty');

        cy.addProductAndCheckCartText('SPF-50', selectors.products, '1 item(s)');
        cy.addProductAndCheckCartText('SPF-30', selectors.products, '2 item(s)');

        cy.wrap([]).then((selectedPrices: number[]) => {
            cy.addLeastExpensiveProduct('SPF-50', selectors.products).then((price) => {
                cy.log(`SPF-50 Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.addLeastExpensiveProduct('SPF-30', selectors.products).then((price) => {
                cy.log(`SPF-30 Product Price: ${price}`);
                selectedPrices.push(price);
            });

            cy.get(selectors.products.cartButton).should('be.visible').click();

            cy.url().should('include', '/cart');

            cy.get(selectors.products.tableRow).should('have.length', 2);

            cy.get(selectors.products.cartItemName)
                .should('contain.text', 'SPF-50')
                .and('contain.text', 'SPF-30');

            // Assert individual price
            cy.get(selectors.products.cartItemPrice).each(($price, index) => {
                const actualPrice = parseInt($price.text().trim());
                cy.log(`Actual Price in Cart [Item ${index + 1}]: ${actualPrice}`);
                expect(actualPrice).to.equal(selectedPrices[index]);
            });

            cy.wrap(null).then(() => {
                const expectedTotal = selectedPrices.reduce((sum, price) => sum + price, 0);
                cy.log(`Expected Total: ${expectedTotal}`);

                // Assert total price
                cy.get(selectors.products.totalPrice).then(($total) => {
                    const totalText = $total.text().match(/\d+/)?.[0];
                    const actualTotal = parseInt(totalText || '0');
                    cy.log(`Actual Total Displayed in Cart: ${actualTotal}`);
                    expect(actualTotal).to.equal(expectedTotal);
                });
            });
        });
    });
});