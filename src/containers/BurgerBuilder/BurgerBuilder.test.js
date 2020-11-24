// import {BurgerBuilder} from './BurgerBuilder'
// import React from 'react'
// import {configure, shallow} from 'enzyme'
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
// import BuildControls from '../../components/Burger/BuildControls/BuildControls'

// configure({adapter: new Adapter()})

// describe('<BurgerBuilder />', () => {
//   let wrapper
//   beforeEach(() => {
//     wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />)
//   })

//   it('should render <BuildControls > with ingr', () => {
//     wrapper.setProps({
//       ingredients: {salad: 0},
//     })
//     expect(wrapper.find(BuildControls)).toHaveLength(1)
//   })

//   it('should render 3 <NavigationItem /> elem if authenticated', () => {
//     wrapper.setProps({
//       isAuthenticated: true,
//     })
//     expect(wrapper.find(NavigationItem)).toHaveLength(3)
//   })

//   it('should render logout nav', () => {
//     wrapper.setProps({
//       isAuthenticated: true,
//     })
//     expect(
//       wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
//     ).toEqual(true)
//   })
// })
