"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"

interface Student {
  id: number
  name: string
  roll_number: string
  email: string
  room_number: string
  phone: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const res = await fetch("http://localhost:8000/api/admin/students/list", {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setStudents(data)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-600">Registered Students</h1>
        <UserNav isAdmin />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Student List</span>
            <Input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80"
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-auto">
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No students found.</p>
          ) : (
            <Table>
              <TableHeader className="bg-sky-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Room No</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name || "-"}</TableCell>
                    <TableCell>{s.roll_number || "-"}</TableCell>
                    <TableCell>{s.email || "-"}</TableCell>
                    <TableCell>{s.room_number || "-"}</TableCell>
                    <TableCell>{s.phone || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

