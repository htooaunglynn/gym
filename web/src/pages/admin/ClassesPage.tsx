import { motion } from "framer-motion"
import { Plus, Users, Clock, MapPin, Dumbbell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const classes = [
  {
    id: "1",
    name: "Morning Yoga Flow",
    instructor: "Sarah Chen",
    time: "07:00 AM - 08:00 AM",
    capacity: "12 / 20",
    location: "Studio A",
    category: "Yoga"
  },
  {
    id: "2",
    name: "High Intensity HIIT",
    instructor: "Alex Rivera",
    time: "09:30 AM - 10:30 AM",
    capacity: "25 / 30",
    location: "Main Floor",
    category: "Cardio"
  },
  {
    id: "3",
    name: "Heavy Lifting Intro",
    instructor: "Mike Johnson",
    time: "05:00 PM - 06:30 PM",
    capacity: "8 / 10",
    location: "Power Zone",
    category: "Strength"
  },
  {
    id: "4",
    name: "Evening Pilates",
    instructor: "Lena Meyer",
    time: "06:00 PM - 07:00 PM",
    capacity: "15 / 15",
    location: "Studio B",
    category: "Pilates"
  }
]

export default function ClassesPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Classes & Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage class bookings, instructors and venues.</p>
        </div>
        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
          <Plus className="mr-2 size-4" />
          Create Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-transform hover:translate-y-[-4px] group">
              <div className="h-2 w-full bg-amber-500" />
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 rounded-lg bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20">
                    {cls.category}
                  </Badge>
                  <CardTitle className="text-xl group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{cls.name}</CardTitle>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Dumbbell className="size-5 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="size-4" />
                  {cls.time}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="size-4" />
                  {cls.location}
                </div >
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Users className="size-4" />
                  {cls.capacity} members booked
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/10">
                  <span className="text-xs font-medium text-slate-400">Instructor: <span className="text-slate-900 dark:text-slate-200">{cls.instructor}</span></span>
                  <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs">Edit</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
