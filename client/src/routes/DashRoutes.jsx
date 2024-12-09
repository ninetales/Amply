import { DashContentLayout } from '../layouts/DashContentLayout';
import DashboardPage from '../pages/DashboardPage';
import { SellPage } from '../pages/SellPage';
import { BuyPage } from '../pages/BuyPage';

export const DashRoutes = [
  {
    index: true,
    element: <DashboardPage />,
    handle: {
      title: 'Dashboard',
    },
  },
  {
    path: 'buying',
    element: <DashContentLayout />,
    children: [
      {
        index: true,
        element: <BuyPage />,
        handle: {
          title: 'Buy Electricity',
        },
      },
    ],
  },
  {
    path: 'selling',
    element: <DashContentLayout />,
    children: [
      {
        index: true,
        element: <SellPage />,
        handle: {
          title: 'Sell Electricity',
        },
      },
    ],
  },
];
