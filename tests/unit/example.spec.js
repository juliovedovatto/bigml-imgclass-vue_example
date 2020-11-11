import TestComponent from '@/components/TestComponent.vue'
import { shallowMount } from '@vue/test-utils'

describe('TestComponent.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TestComponent, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
