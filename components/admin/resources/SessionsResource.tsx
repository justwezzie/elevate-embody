'use client'

import { useEffect, useState } from 'react'
import {
  List,
  Datagrid,
  SimpleList,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  FunctionField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  BooleanInput,
  DateTimeInput,
  FormDataConsumer,
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
  required,
  minValue,
  useRecordContext,
} from 'react-admin'
import { useMediaQuery, useTheme } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { getSupabaseClient } from '../dataProvider'

export function TypeBadge({ type }: { type?: string }) {
  const isYoga = type === 'yoga'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      background: isYoga ? '#BC4E70' : '#457359',
      color: '#fff',
    }}>
      {type ?? '—'}
    </span>
  )
}

export function SessionsList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <List sort={{ field: 'datetime', order: 'ASC' }}>
      {isMobile ? (
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => `${record.type} • ${record.is_published ? 'Published' : 'Draft'}`}
          tertiaryText={(record) =>
            `${new Date(record.datetime).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })} • ${record.spots_remaining}/${record.capacity} spots`
          }
          linkType="edit"
        />
      ) : (
        <Datagrid rowClick="edit" bulkActionButtons={false}>
          <TextField source="title" />
          <FunctionField label="Type" render={(record: { type?: string }) => <TypeBadge type={record.type} />} />
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
      )}
    </List>
  )
}

const sessionTypeChoices = [
  { id: 'yoga', name: 'Yoga' },
  { id: 'boxing', name: 'Boxing' },
]

function SavedAddressFields() {
  const [choices, setChoices] = useState<{ id: string; name: string }[]>([])
  const [isPending, setIsPending] = useState(true)
  const { setValue } = useFormContext()

  useEffect(() => {
    let active = true

    async function loadSavedAddresses() {
      try {
        const supabase = await getSupabaseClient()
        const { data, error } = await supabase
          .from('saved_addresses')
          .select('address')
          .order('address', { ascending: true })

        if (error) {
          setChoices([])
          return
        }

        if (!active) return

        setChoices(
          (data ?? []).flatMap((item) =>
            typeof item.address === 'string' && item.address
              ? [{ id: item.address, name: item.address }]
              : []
          )
        )
      } finally {
        if (active) {
          setIsPending(false)
        }
      }
    }

    void loadSavedAddresses()

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <SelectInput
        source="saved_address"
        label="Saved address"
        choices={choices}
        optionText="name"
        optionValue="id"
        emptyText={isPending ? 'Loading addresses...' : 'Choose a saved address'}
        helperText="Pick a saved address to fill the field below."
        fullWidth
        onChange={(event) => {
          const value = event.target.value
          if (value) {
            setValue('address', value, { shouldDirty: true, shouldTouch: true })
          }
        }}
      />
      <BooleanInput
        source="save_address"
        label="Save this address for future use"
        helperText="Stores the current address as a reusable option."
        defaultValue={false}
      />
    </>
  )
}

function SessionFormFields() {
  return (
    <>
      <TextInput source="title" validate={required()} helperText={false} fullWidth />
      <SelectInput
        source="type"
        choices={sessionTypeChoices}
        validate={required()}
        helperText={false}
      />
      <TextInput source="description" multiline rows={4} helperText={false} fullWidth />
      <TextInput
        source="address"
        label="Address"
        helperText="Type the class address or pick a saved one below."
        fullWidth
      />
      <SavedAddressFields />
      <TextInput
        source="instructor_name"
        validate={required()}
        helperText={false}
        fullWidth
      />
      <DateTimeInput source="datetime" validate={required()} helperText={false} />
      <NumberInput
        source="duration_mins"
        label="Duration (minutes)"
        validate={[required(), minValue(1)]}
        helperText={false}
      />
      <NumberInput
        source="capacity"
        validate={[required(), minValue(1)]}
        helperText={false}
      />
      <NumberInput
        source="price_cents"
        label="Price (pence, e.g. 1000 = £10)"
        validate={[required(), minValue(0)]}
        helperText="Enter amount in pence. £10 = 1000"
      />
      <BooleanInput
        source="is_published"
        label="Published"
        helperText={false}
        defaultValue={false}
      />
    </>
  )
}

function SessionRepeatFields() {
  return (
    <>
      <BooleanInput
        source="repeat_weekly"
        label="Repeat weekly"
        helperText="Create this class plus additional weekly occurrences."
        defaultValue={false}
      />
      <FormDataConsumer>
        {({ formData }) =>
          formData.repeat_weekly ? (
            <NumberInput
              source="repeat_count"
              label="Number of classes to publish"
              helperText="Includes the first class. For example, 4 creates 4 weekly classes."
              validate={[required(), minValue(2)]}
              defaultValue={4}
              sx={{ mt: 2 }}
            />
          ) : null
        }
      </FormDataConsumer>
    </>
  )
}

export function SessionsCreate() {
  return (
    <Create>
      <SimpleForm sx={{ maxWidth: 720, '& .ra-input': { width: '100%' } }}>
        <SessionFormFields />
        <SessionRepeatFields />
      </SimpleForm>
    </Create>
  )
}

function SessionEditToolbar() {
  const record = useRecordContext()
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <SaveButton />
      <DeleteWithConfirmButton
        confirmTitle={`Delete "${record?.title}"?`}
        confirmContent="This will permanently remove the session and cannot be undone."
        confirmColor="warning"
      />
    </Toolbar>
  )
}

export function SessionsEdit() {
  return (
    <Edit>
      <SimpleForm
        toolbar={<SessionEditToolbar />}
        sx={{ maxWidth: 720, '& .ra-input': { width: '100%' } }}
      >
        <SessionFormFields />
        <NumberField
          source="spots_remaining"
          label="Spots remaining (managed automatically)"
        />
      </SimpleForm>
    </Edit>
  )
}
