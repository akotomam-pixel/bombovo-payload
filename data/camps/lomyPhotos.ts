// Shared photo helpers for the hardcoded Lomy camps (Halloween na Lomoch,
// Fest Halloween Fest). The URLs are the same UploadThing files the
// Payload-managed Lomy camps already use.

const thumbUrl = (url: string) => `/_next/image?url=${encodeURIComponent(url)}&w=384&q=75`

export function photo(fileKey: string): { src: string; thumb: string } {
  const src = `https://utfs.io/f/${fileKey}`
  return { src, thumb: thumbUrl(src) }
}

export const lomyStrediskoGallery = [
  'RRX2fWCU0K6iUgts1acsWFAELMdQZw9rbYkoXu8mBnChzx4K',
  'RRX2fWCU0K6i8Dq7MuRKeTsloEiNHr6XcaYRdb9mnZj52gBF',
  'RRX2fWCU0K6iANo6nj267HlILQDJg1EVkhSeZGcNFy0jbaR8',
  'RRX2fWCU0K6i2U3Lsd8jJGzoflrBIPKnAYmq8xwF5HsLZ9hW',
  'RRX2fWCU0K6iSEDoJlb16BH3KPxD49VRUJarIW2EysXwqZGm',
  'RRX2fWCU0K6iljESChFHdXDQg3bofsjtrpi4Guyq9xT8zJRE',
  'RRX2fWCU0K6ijwEvynTRAqy8DgEL9omvQ2nOPtkUCeFNrW3M',
  'RRX2fWCU0K6i1WSduInpez0286Z7fj5lnPguEDSw3tbNIKMW',
  'RRX2fWCU0K6iUrNmUYTcsWFAELMdQZw9rbYkoXu8mBnChzx4',
  'RRX2fWCU0K6i8QfI8QNRKeTsloEiNHr6XcaYRdb9mnZj52gB',
  'RRX2fWCU0K6i2jquKN8jJGzoflrBIPKnAYmq8xwF5HsLZ9hW',
].map(photo)
