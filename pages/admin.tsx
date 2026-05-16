import Link from 'next/link'

export default function Admin() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin (minimal)</h1>
      <p className="mt-4">This project includes a minimal admin API protected by <code>ADMIN_PASSWORD</code>. Use a tool (curl/Postman) and send the header <code>x-admin-password</code> to call <code>/api/admin</code>.</p>
      <p className="mt-4">Examples:</p>
      <pre className="bg-gray-100 p-3 rounded">
        curl -H "x-admin-password: changeme" {`http://localhost:3000/api/admin`}
      </pre>
      <p className="mt-4"><Link href="/">Back to store</Link></p>
    </div>
  )
}
