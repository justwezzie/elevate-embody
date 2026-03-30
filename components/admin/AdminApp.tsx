'use client'

import { Admin, Resource, CustomRoutes, Layout, type LayoutProps } from 'react-admin'
import { Route } from 'react-router-dom'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import PeopleIcon from '@mui/icons-material/People'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { Dashboard } from './Dashboard'
import { AdminMenu } from './AdminMenu'
import { SessionsList, SessionsCreate, SessionsEdit } from './resources/SessionsResource'
import { BookingsList } from './resources/BookingsResource'
import { CustomersList } from './resources/CustomersResource'
import { SiteConfigEdit } from './resources/SiteConfigResource'

function AdminLayout(props: LayoutProps) {
  return <Layout {...props} menu={AdminMenu} />
}

export default function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={AdminLayout}
      basename="/admin"
      loginPage={false}
      title="Elevate + Embody Admin"
    >
      <Resource
        name="sessions"
        list={SessionsList}
        create={SessionsCreate}
        edit={SessionsEdit}
        icon={CalendarMonthIcon}
        options={{ label: 'Sessions' }}
      />
      <Resource
        name="bookings"
        list={BookingsList}
        icon={BookOnlineIcon}
        options={{ label: 'Bookings' }}
      />
      <Resource
        name="users"
        list={CustomersList}
        icon={PeopleIcon}
        options={{ label: 'Customers' }}
      />
      <CustomRoutes>
        <Route path="/site-config" element={<SiteConfigEdit />} />
      </CustomRoutes>
    </Admin>
  )
}
