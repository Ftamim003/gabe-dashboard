import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Pr3detor Fitness</CardTitle>
          <p className="text-gray-600 mt-2">Welcome to your fitness management platform</p>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/dashboard">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
