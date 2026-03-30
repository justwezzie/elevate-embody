'use client'

import { Menu } from 'react-admin'
import TuneIcon from '@mui/icons-material/Tune'

export function AdminMenu() {
  return (
    <Menu
      sx={{
        padding: 1.5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .RaMenuItemLink-root': {
          width: '100%',
          justifyContent: 'center',
          borderRadius: '12px',
          color: 'text.secondary',
          marginBottom: 0.5,
          paddingBlock: 0.75,
        },
        '& .RaMenuItemLink-icon': {
          minWidth: 'unset',
          marginRight: 0,
        },
        '& .RaMenuItemLink-label': {
          textAlign: 'center',
        },
        '& .RaMenuItemLink-active': {
          backgroundColor: 'rgba(31, 119, 80, 0.12)',
          color: 'primary.main',
        },
      }}
    >
      <Menu.DashboardItem />
      <Menu.ResourceItem name="sessions" />
      <Menu.ResourceItem name="bookings" />
      <Menu.ResourceItem name="users" />
      <Menu.Item to="/site-config" primaryText="Site Content" leftIcon={<TuneIcon />} />
    </Menu>
  )
}
