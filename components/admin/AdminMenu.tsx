'use client'

import { Menu } from 'react-admin'
import TuneIcon from '@mui/icons-material/Tune'

export function AdminMenu() {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="sessions" />
      <Menu.ResourceItem name="bookings" />
      <Menu.ResourceItem name="users" />
      <Menu.Item to="/site-config" primaryText="Site Content" leftIcon={<TuneIcon />} />
    </Menu>
  )
}
