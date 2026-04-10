'use client'

import Link from 'next/link'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { Title } from 'react-admin'

function GuideImage({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: '100%',
        border: '1px solid #d7e1db',
        borderRadius: '12px',
        display: 'block',
        backgroundColor: '#fff',
      }}
    />
  )
}

function ScreenshotPlaceholder({ title }: { title: string }) {
  return (
    <Box
      sx={{
        border: '1px dashed #d7e1db',
        borderRadius: '12px',
        backgroundColor: '#f7f7f8',
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Add screenshot here:
        <br />
        {title}
      </Typography>
    </Box>
  )
}

function GuideShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        padding: { xs: 2, md: 3 },
        paddingTop: { xs: '96px', md: 3 },
        maxWidth: 920,
      }}
    >
      <Title title={title} />
      <Stack spacing={2.5}>
        <Typography variant="h5" color="primary.main">
          {title}
        </Typography>
        {children}
      </Stack>
    </Box>
  )
}

export function HelpHomePage() {
  return (
    <GuideShell title="Owner Guide">
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Important login details</Typography>
            <Typography>
              Email: <strong>elevateandembody@creatovationstudio.com</strong>
            </Typography>
            <Typography>
              Temporary password: <strong>xxxxxxxx</strong>
            </Typography>
            <Typography color="text.secondary">
              Please change the password after the first successful login in Supabase, Stripe, and the
              website admin account.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">What these guides cover</Typography>
            <Typography>1. How to log in and use the website admin.</Typography>
            <Typography>2. How to connect and set up the live Stripe account.</Typography>
            <Typography>3. What can be changed inside the admin area.</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button component={Link} href="/admin/help/stripe" variant="contained" color="primary">
          Stripe Setup Guide
        </Button>
        <Button component={Link} href="/admin/help/admin" variant="outlined" color="primary">
          Admin Walkthrough
        </Button>
      </Stack>
    </GuideShell>
  )
}

export function StripeGuidePage() {
  return (
    <GuideShell title="Stripe Setup Guide">
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Before you start</Typography>
            <Typography>
              Use this email to log in to Stripe:
              <strong> elevateandembody@creatovationstudio.com</strong>
            </Typography>
            <Typography>
              Temporary password:
              <strong> xxxxxxxx</strong>
            </Typography>
            <Typography color="text.secondary">
              As soon as you can log in, change the password to something private and safe.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Step 1: Log in to Stripe</Typography>
            <Typography>Go to the Stripe login page and sign in with the email and temporary password above.</Typography>
            <Typography>If Stripe asks for an email code, follow the on-screen steps.</Typography>
            <GuideImage src="/stripelogin.png" alt="Stripe login screen" />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Step 2: Activate the live account</Typography>
            <Typography>Inside Stripe, switch from test mode to live mode when asked.</Typography>
            <Typography>Complete the business details, bank details, and identity checks Stripe requests.</Typography>
            <Typography color="text.secondary">
              Stripe will not pay out real customer payments until this section is completed.
            </Typography>
            <GuideImage src="/stripe1.png" alt="Stripe go-live step 1" />
            <GuideImage src="/stripe2.png" alt="Stripe go-live step 2" />
            <GuideImage src="/stripe3.png" alt="Stripe go-live step 3" />
            <GuideImage src="/stripe4.png" alt="Stripe go-live step 4" />
            <GuideImage src="/stripe5.png" alt="Stripe go-live step 5" />
            <GuideImage src="/stripe6.png" alt="Stripe go-live step 6" />
            <GuideImage src="/stripe7.png" alt="Stripe go-live step 7" />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Step 3: Add the live webhook in Stripe</Typography>
            <Typography>In Stripe, go to Developers, then Webhooks.</Typography>
            <Typography>Add this endpoint URL:</Typography>
            <Typography>
              <strong>https://loquacious-malabi-038077.netlify.app/api/webhooks/stripe</strong>
            </Typography>
            <Typography>Subscribe to these events:</Typography>
            <Typography>1. checkout.session.completed</Typography>
            <Typography>2. checkout.session.expired</Typography>
            <Typography color="text.secondary">
              After saving, Stripe will show a webhook signing secret starting with <strong>whsec_</strong>.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Step 4: Add the webhook secret into Netlify</Typography>
            <Typography>In Netlify, open Site configuration, then Environment variables.</Typography>
            <Typography>Add or update:</Typography>
            <Typography>
              <strong>STRIPE_WEBHOOK_SECRET</strong> = the <strong>whsec_...</strong> value from Stripe
            </Typography>
            <Typography>Also confirm these are present:</Typography>
            <Typography>1. STRIPE_SECRET_KEY</Typography>
            <Typography>2. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</Typography>
            <Typography>3. NEXT_PUBLIC_APP_URL = https://loquacious-malabi-038077.netlify.app</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Step 5: Test a booking</Typography>
            <Typography>Open the live website, book a class, and complete payment.</Typography>
            <Typography>After payment, check that:</Typography>
            <Typography>1. the booking shows as confirmed</Typography>
            <Typography>2. spots remaining go down</Typography>
            <Typography>3. the booking appears in the admin area</Typography>
          </Stack>
        </CardContent>
      </Card>
    </GuideShell>
  )
}

export function AdminGuidePage() {
  return (
    <GuideShell title="Admin Walkthrough">
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">How to log in</Typography>
            <Typography>Go to the website sign-in page.</Typography>
            <Typography>
              Email: <strong>elevateandembody@creatovationstudio.com</strong>
            </Typography>
            <Typography>
              Temporary password: <strong>xxxxxxxx</strong>
            </Typography>
            <Typography>After signing in, open the Admin area from the navigation.</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">What you can do in the admin</Typography>
            <Typography>Sessions: create classes, edit class details, publish or unpublish classes.</Typography>
            <Typography>Bookings: view customer bookings.</Typography>
            <Typography>Customers: view users who have signed up.</Typography>
            <Typography>Site Content: update homepage text, images, and brand colours.</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">How to add a class</Typography>
            <Typography>1. Open Sessions.</Typography>
            <Typography>2. Choose create new session.</Typography>
            <Typography>3. Fill in the title, type, address, instructor, date, capacity, and price.</Typography>
            <Typography>4. Turn on Published if you want people to see it on the website.</Typography>
            <Typography>5. Save.</Typography>
            <Typography color="text.secondary">
              If you want to post a weekly run of classes, use the Repeat weekly option.
            </Typography>
            <ScreenshotPlaceholder title="Create session screen" />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">How to update the homepage</Typography>
            <Typography>1. Open Site Content.</Typography>
            <Typography>2. Edit the text, colours, or images you want to change.</Typography>
            <Typography>3. Press Save changes.</Typography>
            <Typography>4. Refresh the main website to see the update.</Typography>
            <ScreenshotPlaceholder title="Site content editor" />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Important notes</Typography>
            <Typography>Only published classes appear on the public website.</Typography>
            <Typography>Bookings update automatically after successful Stripe payment.</Typography>
            <Typography>If something looks wrong, check the admin first before changing Stripe settings.</Typography>
          </Stack>
        </CardContent>
      </Card>
    </GuideShell>
  )
}
