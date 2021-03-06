import { expect } from 'chai'

const angular = window.angular

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
    }
  ]
}

describe('facetValue.component', () => {

  let $sce
  let $componentController

  beforeEach(angular.mock.module('appBasketCase'))

  beforeEach(angular.mock.inject((_$sce_, _$componentController_) => {
    $sce = _$sce_
    $componentController = _$componentController_
  }))

  it('construction', () => {
    const controller = $componentController('facetValue', {})
    expect(controller).to.not.be.undefined
    expect(controller).to.not.be.null
    expect(controller).to.have.property('$sce')
  })

  it('getLabel', () => {
    const bindings = {
      facetId: facet.facetId,
      value: facet.facetValues[0],
      isRange: facet.isRange,
      onChange: angular.noop
    }
    const controller = $componentController('facetValue', {}, bindings)
    const label = controller.getLabel()
    expect($sce.getTrustedHtml(label)).to.equal('Beko (2)')
  })
})
