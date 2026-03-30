'use client'

import { List, Datagrid, TextField, DateField, EmailField, SimpleList } from 'react-admin'
import { useMediaQuery, useTheme } from '@mui/material'

export function CustomersList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <List sort={{ field: 'created_at', order: 'DESC' }}>
      {isMobile ? (
        <SimpleList
          primaryText={(record) => record.full_name ?? '—'}
          secondaryText={(record) => record.email}
          tertiaryText={(record) => `${record.role} • Joined ${new Date(record.created_at).toLocaleDateString('en-GB')}`}
          linkType={false}
        />
      ) : (
        <Datagrid bulkActionButtons={false}>
          <TextField source="full_name" label="Name" emptyText="—" />
          <EmailField source="email" />
          <TextField source="role" />
          <DateField source="created_at" label="Joined" />
        </Datagrid>
      )}
    </List>
  )
}
