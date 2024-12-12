import { selectors } from '../../support/selectors';
import { constants } from '../../support/constants';

describe('Weather Shopper - Homepage', () => {

    beforeEach(() => {
        cy.visit(constants.urls.homepage);
    });

    it('should display temperature and buttons', () => {
        cy.get(selectors.homepage.temperature).should('be.visible');
        cy.get(selectors.homepage.moisturizerButton).should('contain', 'Buy moisturizers');
        cy.get(selectors.homepage.sunscreenButton).should('contain', 'Buy sunscreens');
    });

    it('should navigate based on temperature', () => {
        cy.get(selectors.homepage.temperature).then(($temp) => {
            const temperature = parseInt($temp.text(), 10);
            if (temperature < constants.temperatureRange.low) {
                cy.navigateToSection('moisturizer', selectors.homepage.moisturizerButton, 'Moisturizers');
            } else if (temperature > constants.temperatureRange.high) {
                cy.navigateToSection('sunscreen', selectors.homepage.sunscreenButton, 'Sunscreens');
            } else {
                throw new Error(`Temperature (${temperature}) not in valid range!`);
            }
        });
    });
});