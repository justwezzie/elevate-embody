'use client'

import { Menu } from 'react-admin'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
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
          width: '48px',
          minWidth: '48px',
          justifyContent: 'center',
          borderRadius: '12px',
          color: 'text.secondary',
          marginBottom: 0.5,
          paddingBlock: 0.75,
          paddingInline: 0,
        },
        '& .RaMenuItemLink-icon': {
          minWidth: 'unset',
          marginRight: 0,
        },
        '& .RaMenuItemLink-root .MuiTypography-root': {
          display: 'none',
        },
        '& .RaMenuItemLink-root .MuiListItemText-root': {
          display: 'none',
        },
        '& .RaMenuItemLink-active': {
          backgroundColor: 'rgba(69, 115, 89, 0.12)',
          color: 'primary.main',
        },
      }}
    >
      <Menu.DashboardItem />
      <Menu.ResourceItem name="sessions" />
      <Menu.ResourceItem name="bookings" />
      <Menu.ResourceItem name="users" />
      <Menu.Item to="/site-config" primaryText="Site Content" leftIcon={<TuneIcon />} />
      <Menu.Item to="/help" primaryText="Help Guide" leftIcon={<HelpOutlineIcon />} />
    </Menu>
  )
}
