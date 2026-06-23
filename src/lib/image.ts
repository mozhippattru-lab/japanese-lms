// Reads an image File the user picked, downscales it to a small square
// thumbnail entirely in the browser, and returns a compact JPEG data URL.
// This lets us store a profile photo inline (in profiles.avatar_url) with
// NO file-storage bucket required — ideal for the showcase build.
export function resizeImageToDataUrl(file: File, max = 160, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Please choose an image file.')); return }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load the image.'))
      img.onload = () => {
        // center-crop to a square, then scale down to `max`
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        const canvas = document.createElement('canvas')
        canvas.width = max
        canvas.height = max
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported.')); return }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, max, max)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
