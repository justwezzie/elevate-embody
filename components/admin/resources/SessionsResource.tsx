'use client'

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  BooleanInput,
  DateTimeInput,
  required,
  minValue,
} from 'react-admin'

export function SessionsList() {
  return (
    <List sort={{ field: 'datetime', order: 'ASC' }}>
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <TextField source="title" />
        <TextField source="type" label="Type" />
        <DateField source="datetime" showTime label="Date & Time" />
        <NumberField source="capacity" />
        <NumberField source="spots_remaining" label="Spots left" />
        <NumberField
          source="price_cents"
          label="Price (£)"
          options={{ style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }}
          transform={(v: number) => v / 100}
        />
        <BooleanField source="is_published" label="Published" />
      </Datagrid>
    </List>
  )
}

const sessionTypeChoices = [
  { id: 'yoga', name: 'Yoga' },
  { id: 'boxing', name: 'Boxing' },
]

function SessionFormFields() {
  return (
    <>
      <TextInput source="title" validate={required()} fullWidth />
      <SelectInput source="type" choices={sessionTypeChoices} validate={required()} />
      <TextInput source="description" multiline rows={4} fullWidth />
      <TextInput source="instructor_name" validate={required()} fullWidth />
      <DateTimeInput source="datetime" validate={required()} />
      <NumberInput source="duration_mins" label="Duration (minutes)" validate={[required(), minValue(1)]} />
      <NumberInput source="capacity" validate={[required(), minValue(1)]} />
      <NumberInput
        source="price_cents"
        label="Price (pence, e.g. 1000 = £10)"
        validate={[required(), minValue(0)]}
        helperText="Enter amount in pence. £10 = 1000"
      />
      <BooleanInput source="is_published" label="Published" defaultValue={false} />
    </>
  )
}

export function SessionsCreate() {
  return (
    <Create>
      <SimpleForm>
        <SessionFormFields />
      </SimpleForm>
    </Create>
  )
}

export function SessionsEdit() {
  return (
    <Edit>
      <SimpleForm>
        <SessionFormFields />
        <NumberField
          source="spots_remaining"
          label="Spots remaining (managed automatically)"
        />
      </SimpleForm>
    </Edit>
  )
}
