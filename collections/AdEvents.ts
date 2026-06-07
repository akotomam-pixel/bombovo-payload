import type { CollectionConfig } from 'payload'

export const AdEvents: CollectionConfig = {
  slug: 'ad-events',
  labels: {
    singular: 'Ad Event',
    plural: 'Ad Events',
  },
  admin: {
    group: 'Marketing',
    useAsTitle: 'type',
    defaultColumns: ['type', 'advertorial', 'destination', 'utmSource', 'utmCampaign', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  timestamps: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'View', value: 'view' },
        { label: 'Click', value: 'click' },
      ],
    },
    {
      name: 'advertorial',
      type: 'text',
      label: 'Advertorial',
      admin: { description: 'Which advertorial page sent this event, e.g. advertorial-3' },
    },
    {
      name: 'destination',
      type: 'text',
      label: 'Destination',
      admin: { description: 'Where the user was redirected (clicks only), e.g. /letne-tabory' },
    },
    {
      name: 'utmSource',
      type: 'text',
      label: 'UTM Source',
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: 'UTM Medium',
    },
    {
      name: 'utmCampaign',
      type: 'text',
      label: 'UTM Campaign',
    },
    {
      name: 'utmContent',
      type: 'text',
      label: 'UTM Content',
    },
    {
      name: 'fbclid',
      type: 'text',
      label: 'Facebook Click ID',
    },
    {
      name: 'ip',
      type: 'text',
      label: 'IP Address',
    },
    {
      name: 'userAgent',
      type: 'textarea',
      label: 'User Agent',
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
    },
  ],
}
