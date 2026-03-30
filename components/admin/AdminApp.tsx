'use client'

import clsx from 'clsx'
import { Box, Drawer, IconButton, useMediaQuery, useScrollTrigger, type Theme } from '@mui/material'
import { createTheme, styled } from '@mui/material/styles'
import {
  Admin,
  Resource,
  CustomRoutes,
  Layout,
  AppBar,
  TitlePortal,
  useLocale,
  useSidebarState,
  type SidebarProps,
  type LayoutProps,
} from 'react-admin'
import { reactRouterProvider } from 'ra-core'
import { Route } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import CloseIcon from '@mui/icons-material/Close'
import PeopleIcon from '@mui/icons-material/People'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { Dashboard } from './Dashboard'
import { AdminMenu } from './AdminMenu'
import { SessionsList, SessionsCreate, SessionsEdit } from './resources/SessionsResource'
import { BookingsList } from './resources/BookingsResource'
import { CustomersList } from './resources/CustomersResource'
import { SiteConfigEdit } from './resources/SiteConfigResource'

const DRAWER_WIDTH = 240
const CLOSED_DRAWER_WIDTH = 55
const RIGHT_SIDEBAR_OPEN_CLASS = 'AdminRightSidebar-open'
const RIGHT_SIDEBAR_CLOSED_CLASS = 'AdminRightSidebar-closed'

const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#166534',
      contrastText: '#f7f7f8',
    },
    secondary: {
      main: '#ea580c',
      contrastText: '#f7f7f8',
    },
    background: {
      default: '#f7f7f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#16302a',
      secondary: '#5f766f',
    },
    divider: '#d7e1db',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontSize: 14,
    fontFamily: 'var(--font-sans), sans-serif',
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'var(--font-heading), sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: 'var(--font-heading), sans-serif',
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.25,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f7f7f8',
          color: '#16302a',
        },
        '.RaListToolbar-root, .RaTopToolbar-root, [class*="RaListToolbar-root"], [class*="RaTopToolbar-root"]':
          {
            backgroundColor: 'transparent !important',
          },
        '.ra-input .MuiOutlinedInput-input, .ra-input .MuiSelect-select': {
          paddingTop: '18px !important',
          paddingBottom: '8px !important',
        },
        '.ra-input .MuiInputLabel-outlined': {
          transform: 'translate(14px, 14px) scale(1) !important',
        },
        '.ra-input .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          transform: 'translate(14px, 5px) scale(0.75) !important',
          transformOrigin: 'top left !important',
        },
        '.ra-input .MuiOutlinedInput-notchedOutline legend': {
          maxWidth: '0 !important',
        },
        '.ra-input .MuiOutlinedInput-notchedOutline legend span': {
          display: 'none !important',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.88)',
          color: '#16302a',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #d7e1db',
          boxShadow: 'none',
          marginTop: 0,
          minHeight: '50px',
          borderRadius: 0,
        },
      },
    },
    RaAppBar: {
      styleOverrides: {
        root: {
          '& .RaAppBar-toolbar': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .RaAppBar-title': {
            flex: 1,
          },
          '& .RaAppBar-menuButton': {
            order: 4,
            marginLeft: '0.5rem',
            marginRight: 0,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '50px',
          height: '50px',
          paddingTop: '20px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (min-width: 600px)': {
            minHeight: '50px',
            height: '50px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #d7e1db',
          borderRight: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 10px 30px rgba(14, 34, 27, 0.05)',
          border: '1px solid #d7e1db',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#166534',
          '&:hover': {
            backgroundColor: '#1f7a50',
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          backgroundColor: '#ea580c',
          '&:hover': {
            backgroundColor: '#c44908',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#d7e1db',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #d7e1db',
          fontSize: '0.875rem',
        },
        head: {
          color: '#5f766f',
          fontWeight: 700,
          fontSize: '0.875rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
          fontSize: '0.875rem',
          minHeight: 48,
          alignItems: 'center',
        },
        input: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
          padding: '18px 14px 8px',
        },
        notchedOutline: {
          borderColor: '#d7e1db',
          '& legend': {
            maxWidth: 0,
          },
          '& legend span': {
            display: 'none',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: '18px',
          paddingBottom: '8px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
        input: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          marginTop: 0,
          marginBottom: 0,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          marginBottom: 0,
        },
        outlined: {
          transform: 'translate(14px, 14px) scale(1)',
        },
        shrink: {
          transform: 'translate(14px, 5px) scale(0.75)',
          transformOrigin: 'top left',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#16302a',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          marginTop: 6,
          marginBottom: 5,
          fontSize: '0.75rem',
          lineHeight: 1.4,
          color: '#5f766f',
          '&:empty': {
            display: 'none',
            margin: 0,
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          fontFamily: 'var(--font-heading), sans-serif',
          fontWeight: 700,
          fontSize: '1.125rem',
        },
        subheader: {
          fontSize: '0.875rem',
        }
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
        },
        secondary: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    RaListToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          paddingInline: 0,
        },
      },
    },
    RaTopToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          paddingInline: 0,
          minHeight: 'unset',
        },
      },
    },
    RaSimpleForm: {
      styleOverrides: {
        root: {
          '& .RaSimpleForm-form': {
            display: 'grid',
            gap: 0,
          },
          '& .ra-input': {
            marginTop: 0,
            marginBottom: '20px',
          },
          '& .ra-input .MuiFormControlLabel-root': {
            marginTop: 0,
            marginBottom: 0,
          },
          '& .ra-input .MuiFormControl-root': {
            width: '100%',
          },
          '& .ra-input:last-of-type': {
            marginBottom: 0,
          },
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        contentWithSidebar: {
          flexDirection: 'row-reverse',
        },
      },
    },
  },
})

const RightSidebarDrawer = styled(Drawer)<{ open?: boolean }>(({ open, theme }) => ({
  height: 'calc(100vh - 3em)',
  marginTop: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&.RaSidebar-appBarCollapsed': {
    marginTop: theme.spacing(-6),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(-7),
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  '& .MuiPaper-root': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: open ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #d7e1db',
    borderRight: 'none',
    overflowX: 'hidden',
    [theme.breakpoints.only('xs')]: {
      marginTop: 0,
      height: '100vh',
      position: 'fixed',
      top: 0,
      right: 0,
    },
    [theme.breakpoints.up('md')]: {
      borderTop: 'none',
      borderBottom: 'none',
    },
    zIndex: theme.zIndex.drawer,
  },
  '& .RaMenu-root': {
    marginInline: 'auto',
  },
}))

function AdminLayout(props: LayoutProps) {
  return <Layout {...props} appBar={AdminTopBar} menu={AdminMenu} sidebar={RightSidebar} />
}

function AdminTopBar() {
  return (
    <AppBar toolbar={false}>
      <TitlePortal />
    </AppBar>
  )
}

function RightSidebar({ appBarAlwaysOn, children, ...rest }: SidebarProps) {
  const isXSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  const [open, setOpen] = useSidebarState()
  const trigger = useScrollTrigger()

  useLocale()

  const toggleSidebar = () => setOpen(!open)

  if (isXSmall) {
    return (
      <RightSidebarDrawer
        anchor="right"
        variant="temporary"
        open={open}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(22, 48, 42, 0.2)',
          },
          '& .MuiPaper-root': {
            width: DRAWER_WIDTH,
            maxWidth: '85vw',
            height: '100vh',
            top: 0,
            right: 0,
            borderLeft: '1px solid #d7e1db',
            boxShadow: '0 10px 30px rgba(14, 34, 27, 0.12)',
          },
        }}
        {...rest}
      >
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '0.75rem 0.75rem 0 0.75rem',
            }}
          >
            <IconButton
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              size="small"
              sx={{ color: '#16302a' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {children}
        </Box>
      </RightSidebarDrawer>
    )
  }

  return (
    <RightSidebarDrawer
      anchor="right"
      variant="permanent"
      open={open}
      onClose={toggleSidebar}
      className={clsx(
        trigger && !appBarAlwaysOn ? 'RaSidebar-appBarCollapsed' : '',
        open ? RIGHT_SIDEBAR_OPEN_CLASS : RIGHT_SIDEBAR_CLOSED_CLASS
      )}
      {...rest}
    >
      {children}
    </RightSidebarDrawer>
  )
}

function BrowserRouterWrapper({
  basename,
  children,
}: {
  basename?: string
  children: React.ReactNode
}) {
  const router = createBrowserRouter(
    [{ path: '*', element: <>{children}</> }],
    { basename }
  )

  return <RouterProvider router={router} />
}

const browserRouterProvider = {
  ...reactRouterProvider,
  RouterWrapper: BrowserRouterWrapper,
}

export default function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={AdminLayout}
      basename="/admin"
      routerProvider={browserRouterProvider}
      theme={adminTheme}
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
