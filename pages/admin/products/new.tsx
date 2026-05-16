import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function NewProduct() {
  const router = useRouter()
  const [adminPassword, setAdminPassword] = useState(localStorage.getItem('adminPassword') || '')
  const [collections, setCollections] = useState([])
  const [form, setForm] = useState({ title: '', slug: '', description: '', price: '', inventory: '0', collectionId: '' })
  const [images, setImages] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => { fetchCollections() }, [])

  async function fetchCollections() {
    const res = await fetch('/api/admin', { headers: { 'x-admin-password': adminPassword } })
    if (res.ok) {
      const data = await res.json()
      setCollections(data.collections)
    }
  }

  async function upload() {
    if (!file) return alert('Choose a file')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, headers: { 'x-admin-password': adminPassword } })
    const data = await res.json()
    if (data.url) setImages((s) => [...s, data.url])
  }

  async function submit(e) {
    e.preventDefault()
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      priceCents: Math.round(Number(form.price) * 100),
      inventory: Number(form.inventory),
      collectionId: form.collectionId ? Number(form.collectionId) : null,
      images,
    }
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword }, body: JSON.stringify(payload) })
    if (res.ok) router.push('/admin/products')
    else alert('Error')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">New Product</h1>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="block">Title</label>
          <input className="border p-2 w-full" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
        </div>
        <div>
          <label className="block">Slug</label>
          <input className="border p-2 w-full" value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea className="border p-2 w-full" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Price (USD)</label>
            <input className="border p-2 w-full" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} />
          </div>
          <div>
            <label>Inventory</label>
            <input className="border p-2 w-full" value={form.inventory} onChange={(e)=>setForm({...form,inventory:e.target.value})} />
          </div>
        </div>
        <div>
          <label>Collection</label>
          <select className="border p-2 w-full" value={form.collectionId} onChange={(e)=>setForm({...form,collectionId:e.target.value})}>
            <option value="">-- none --</option>
            {collections.map((c:any)=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label>Upload Image</label>
          <div className="flex gap-2 mt-2">
            <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
            <button type="button" className="px-3 py-2 bg-gray-200" onClick={upload}>Upload</button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((u,i)=> (
              <img key={i} src={u} className="h-24 object-cover" />
            ))}
          </div>
        </div>

        <div>
          <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
