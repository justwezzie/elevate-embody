'use client'

import { List, Datagrid, TextField, DateField, EmailField } from 'react-admin'

export function CustomersList() {
  return (
    <List sort={{ field: 'created_at', order: 'DESC' }}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="full_name" label="Name" emptyText="—" />
        <EmailField source="email" />
        <TextField source="role" />
        <DateField source="created_at" label="Joined" />
      </Datagrid>
    </List>
  )
}
