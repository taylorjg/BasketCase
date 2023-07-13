import { expect } from 'chai'

const angular = window.angular

const facet = {
  name: 'brand',
  displayName: 'Brand',
  type: 'multi',
  facetValues: [
    {
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
      facetName: facet.name,
      type: facet.type,
      value: facet.facetValues[0],
      onChange: angular.noop
    }
    const controller = $componentController('facetValue', {}, bindings)
    const label = controller.getLabel()
    expect($sce.getTrustedHtml(label)).to.equal('Beko (2)')
  })
})
