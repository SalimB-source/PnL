import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProductsAdmin() {
  const [adminPassword, setAdminPassword] = useState('')
  const [products, setProducts] = useState([])

  useEffect(() => {
    const pw = localStorage.getItem('adminPassword') || ''
    setAdminPassword(pw)
    if (pw) fetchProducts(pw)
  }, [])

  function savePassword(pw) {
    localStorage.setItem('adminPassword', pw)
    setAdminPassword(pw)
    fetchProducts(pw)
  }

  async function fetchProducts(pw) {
    const res = await fetch('/api/admin/products', { headers: { 'x-admin-password': pw } })
    if (res.ok) {
      const data = await res.json()
      setProducts(data.products)
    } else {
      setProducts([])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin - Products</h1>
      {!adminPassword && (
        <div className="mt-4">
          <p>Enter admin password to manage products:</p>
          <input type="password" id="pw" className="border p-2 mt-2" />
          <button className="ml-2 px-3 py-2 bg-blue-600 text-white" onClick={() => savePassword((document.getElementById('pw') as HTMLInputElement).value)}>Save</button>
        </div>
      )}

      {adminPassword && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/admin/products/new"><button className="px-4 py-2 bg-green-600 text-white rounded">New Product</button></Link>
            <button className="px-3 py-2 bg-gray-200" onClick={() => { localStorage.removeItem('adminPassword'); setAdminPassword(''); setProducts([]) }}>Logout</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="border rounded p-3">
                <img src={p.images[0]?.url} alt="" className="w-full h-40 object-cover mb-2" />
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600">${(p.priceCents/100).toFixed(2)}</p>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/products/${p.id}/edit`}><button className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6"><Link href="/">Back to store</Link></div>
    </div>
  )
}
