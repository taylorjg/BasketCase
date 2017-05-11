import { expect } from 'chai';

const angular = window.angular;

const facet = {
    facetId: 2,
    displayName: 'Brand',
    isRange: false,
    facetValues: [
        {
            index: 0,
            displayName: 'Beko',
            key: 'Beko',
            count: 2,
            selected: false
        },
        {
            index: 1,
            displayName: 'Hotpoint',
            key: 'Hotpoint',
            count: 7,
            selected: false
        },
        {
            index: 2,
            displayName: 'Indesit',
            key: 'Indesit',
            count: 5,
            selected: false
        }
    ]
};

const cloneFacet = () => JSON.parse(JSON.stringify(facet));

describe('facet.component', () => {

    let $componentController;

    beforeEach(angular.mock.module('appBasketCase'));

    beforeEach(angular.mock.inject(_$componentController_ => {
        $componentController = _$componentController_;
    }));

    it('construction', () => {
        const controller = $componentController('facet', {});
        expect(controller).to.not.be.undefined;
        expect(controller).to.not.be.null;
    });

    it('onReset() deselects all facet values', () => {
        const clonedFacet = cloneFacet();
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged: angular.noop
        };
        clonedFacet.facetValues.forEach(v => v.selected = true);

        const controller = $componentController('facet', {}, bindings);
        controller.onReset();

        clonedFacet.facetValues.forEach(v => expect(v.selected).to.equal(false));
    });

    it('onReset() invokes onFacetSelectionChanged', () => {
        const clonedFacet = cloneFacet();
        let invoked = false;
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged() { invoked = true; }
        };

        const controller = $componentController('facet', {}, bindings);
        controller.onReset();

        expect(invoked).to.equal(true);
    });

    it('onChange() invokes onFacetSelectionChanged', () => {
        const clonedFacet = cloneFacet();
        let invoked = false;
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged() { invoked = true; }
        };

        const controller = $componentController('facet', {}, bindings);
        controller.onChange(clonedFacet.facetValues[0]);

        expect(invoked).to.equal(true);
    });

    // TODO:
    // onChange(value) maintains selection state of all other values when isRange is false
    // onChange(value) deselects all other values when isRange is true

    it('anythingSelected() returns false when no values are selected', () => {
        const clonedFacet = cloneFacet();
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged: angular.noop
        };

        const controller = $componentController('facet', {}, bindings);
        const anythingSelected = controller.anythingSelected();

        expect(anythingSelected).to.equal(false);
    });

    it('anythingSelected() returns true when one value is selected', () => {
        const clonedFacet = cloneFacet();
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged: angular.noop
        };
        clonedFacet.facetValues[0].selected = true;

        const controller = $componentController('facet', {}, bindings);
        const anythingSelected = controller.anythingSelected();

        expect(anythingSelected).to.equal(true);
    });

    it('anythingSelected() returns true when all values are selected', () => {
        const clonedFacet = cloneFacet();
        const bindings = {
            facet: clonedFacet,
            onFacetSelectionChanged: angular.noop
        };
        clonedFacet.facetValues.forEach(v => v.selected = true);

        const controller = $componentController('facet', {}, bindings);
        const anythingSelected = controller.anythingSelected();

        expect(anythingSelected).to.equal(true);
    });
});
