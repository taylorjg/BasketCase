import { expect } from 'chai'

const angular = window.angular

const termsFacet = {
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
}

const rangeFacet = {
  facetId: 4,
  displayName: 'Price',
  isRange: true,
  facetValues: [
    {
      index: 0,
      displayName: '&pound;200 or less',
      key: '*-200.0',
      to: 200,
      count: 2,
      selected: false
    },
    {
      index: 1,
      displayName: '&pound;200 - &pound;250',
      key: '200.0-250.0',
      from: 200,
      to: 250,
      count: 7,
      selected: false
    },
    {
      index: 2,
      displayName: '&pound;250 or more',
      key: '250.0-*',
      from: 250,
      count: 5,
      selected: false
    }
  ]
}

const cloneTermsFacet = () => JSON.parse(JSON.stringify(termsFacet))
const cloneRangeFacet = () => JSON.parse(JSON.stringify(rangeFacet))

describe('facet.component', () => {

  let $componentController

  beforeEach(angular.mock.module('appBasketCase'))

  beforeEach(angular.mock.inject(_$componentController_ => {
    $componentController = _$componentController_
  }))

  it('construction', () => {
    const controller = $componentController('facet', {})
    expect(controller).to.not.be.undefined
    expect(controller).to.not.be.null
  })

  it('onReset() deselects all facet values', () => {
    const clonedFacet = cloneTermsFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }
    clonedFacet.facetValues.forEach(v => v.selected = true)

    const controller = $componentController('facet', {}, bindings)
    controller.onReset()

    clonedFacet.facetValues.forEach(v => expect(v.selected).to.equal(false))
  })

  it('onReset() invokes onFacetSelectionChanged', () => {
    const clonedFacet = cloneTermsFacet()
    let invoked = false
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged() { invoked = true }
    }

    const controller = $componentController('facet', {}, bindings)
    controller.onReset()

    expect(invoked).to.equal(true)
  })

  it('onChange() invokes onFacetSelectionChanged', () => {
    const clonedFacet = cloneTermsFacet()
    let invoked = false
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged() { invoked = true }
    }

    const controller = $componentController('facet', {}, bindings)
    controller.onChange(clonedFacet.facetValues[0])

    expect(invoked).to.equal(true)
  })

  it('onChange(value) maintains selection state of all other values for a terms facet', () => {
    const clonedFacet = cloneTermsFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }
    clonedFacet.facetValues[0].selected = false
    clonedFacet.facetValues[1].selected = true
    clonedFacet.facetValues[2].selected = false

    const controller = $componentController('facet', {}, bindings)
    clonedFacet.facetValues[0].selected = true
    controller.onChange(clonedFacet.facetValues[0])

    expect(clonedFacet.facetValues[0].selected).to.equal(true)
    expect(clonedFacet.facetValues[1].selected).to.equal(true)
    expect(clonedFacet.facetValues[2].selected).to.equal(false)
  })

  it('onChange(value) deselects all other values for a range facet', () => {
    const clonedFacet = cloneRangeFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }
    clonedFacet.facetValues[0].selected = false
    clonedFacet.facetValues[1].selected = true
    clonedFacet.facetValues[2].selected = false

    const controller = $componentController('facet', {}, bindings)
    clonedFacet.facetValues[0].selected = true
    controller.onChange(clonedFacet.facetValues[0])

    expect(clonedFacet.facetValues[0].selected).to.equal(true)
    expect(clonedFacet.facetValues[1].selected).to.equal(false)
    expect(clonedFacet.facetValues[2].selected).to.equal(false)
  })

  it('anythingSelected() returns false when no values are selected', () => {
    const clonedFacet = cloneTermsFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }

    const controller = $componentController('facet', {}, bindings)
    const anythingSelected = controller.anythingSelected()

    expect(anythingSelected).to.equal(false)
  })

  it('anythingSelected() returns true when one value is selected', () => {
    const clonedFacet = cloneTermsFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }
    clonedFacet.facetValues[0].selected = true

    const controller = $componentController('facet', {}, bindings)
    const anythingSelected = controller.anythingSelected()

    expect(anythingSelected).to.equal(true)
  })

  it('anythingSelected() returns true when all values are selected', () => {
    const clonedFacet = cloneTermsFacet()
    const bindings = {
      facet: clonedFacet,
      onFacetSelectionChanged: angular.noop
    }
    clonedFacet.facetValues.forEach(v => v.selected = true)

    const controller = $componentController('facet', {}, bindings)
    const anythingSelected = controller.anythingSelected()

    expect(anythingSelected).to.equal(true)
  })
})
