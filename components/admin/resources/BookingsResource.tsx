'use client'

import {
  List,
  Datagrid,
  TextField,
  DateField,
  SimpleList,
  SelectInput,
  FilterButton,
  TopToolbar,
  NumberField,
} from 'react-admin'
import { useMediaQuery, useTheme } from '@mui/material'

function BookingListActions() {
  return (
    <TopToolbar>
      <FilterButton />
    </TopToolbar>
  )
}

const bookingFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: 'pending', name: 'Pending' },
      { id: 'confirmed', name: 'Confirmed' },
      { id: 'cancelled', name: 'Cancelled' },
    ]}
    alwaysOn
  />,
]

export function BookingsList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <List
      filters={bookingFilters}
      actions={<BookingListActions />}
      sort={{ field: 'created_at', order: 'DESC' }}
    >
      {isMobile ? (
        <SimpleList
          primaryText={(record) => record.customer_name ?? '—'}
          secondaryText={(record) => `${record.session_title} • ${record.status}`}
          tertiaryText={(record) =>
            new Date(record.session_datetime).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          }
          rowSx={() => ({ borderBottom: '1px solid #d7e1db' })}
          linkType={false}
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="customer_name" label="Customer" emptyText="—" />
          <TextField source="customer_email" label="Email" />
          <TextField source="session_title" label="Session" />
          <DateField source="session_datetime" showTime label="Session Date" />
          <TextField source="session_type" label="Type" />
          <NumberField
            source="session_price_cents"
            label="Price"
            options={{ style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }}
            transform={(v: number) => v / 100}
          />
          <TextField source="status" />
          <DateField source="created_at" label="Booked at" showTime />
        </Datagrid>
      )}
    </List>
  )
}
