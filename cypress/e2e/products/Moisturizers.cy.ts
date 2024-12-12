import { selectors } from '../../support/selectors';
import { constants } from '../../support/constants';

describe('Shopping for Moisturizers', () => {
    beforeEach(() => {
        cy.visit(constants.urls.moisturizer);

        cy.verifyProductStructure(selectors.products);
    });

    it('should verify moisturizer products exist', () => {
        cy.fixture('productData.json').then((productData) => {
            productData.moisturizer.forEach((product: any) => {
                cy.verifyProductsExist(product, selectors.products);
            });
        });
    });

    it('should add moisturizers, update the cart button, and verify least expensive items in the cart', () => {
        cy.assertCartButtonText(selectors.products, 'Empty');

        cy.fixture('productData.json').then((productData) => {
            const moisturizers = productData.moisturizer;

            cy.addProductAndCheckCartText(moisturizers[0], selectors.products, '1 item(s)');
            cy.addProductAndCheckCartText(moisturizers[1], selectors.products, '2 item(s)');

            cy.wrap([]).then((selectedPrices: number[]) => {
                cy.addLeastExpensiveProduct(moisturizers[0], selectors.products).then((price) => {
                    cy.log(`${moisturizers[0]} Product Price: ${price}`);
                    selectedPrices.push(price);
                });

                cy.addLeastExpensiveProduct(moisturizers[1], selectors.products).then((price) => {
                    cy.log(`${moisturizers[1]} Product Price: ${price}`);
                    selectedPrices.push(price);
                });

                cy.get(selectors.products.cartButton).should('be.visible').click();
                cy.url().should('include', '/cart');
                cy.get(selectors.products.tableRow).should('have.length', 2);
                cy.get(selectors.products.cartItemName).should('contain.text', moisturizers[0]).and('contain.text', moisturizers[1]);

                cy.get(selectors.products.cartItemPrice).each(($price, index) => {
                    const actualPrice = parseInt($price.text().trim());
                    cy.log(`Actual Price in Cart [Item ${index + 1}]: ${actualPrice}`);
                    expect(actualPrice).to.equal(selectedPrices[index]);
                });

                cy.wrap(null).then(() => {
                    const expectedTotal = selectedPrices.reduce((sum, price) => sum + price, 0);
                    cy.log(`Expected Total: ${expectedTotal}`);

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
});