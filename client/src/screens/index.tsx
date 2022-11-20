import Budget from './Budget'
import Home from './Home'
import NotFound from './NotFound'

export const SCREENS = {
  Home: {
    title: 'Home',
    path: '',
    component: Home,
    params: undefined,
  },
  Budget: {
    title: 'Budget',
    path: 'budget',
    component: Budget,
    params: undefined,
  },
  NotFound: {
    title: 'Not Found',
    path: '*',
    component: NotFound,
    params: undefined,
  },
}

export type RootStackParamList = {
  [key in keyof typeof SCREENS]: typeof SCREENS[key]['params']
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
