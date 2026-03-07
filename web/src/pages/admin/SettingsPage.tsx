import { motion } from "framer-motion"
import { User, Bell, Palette, Lock, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your admin experience and gym profile.</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl h-11 border border-slate-200 dark:border-white/10">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <User className="size-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Palette className="size-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Bell className="size-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Lock className="size-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="appearance">
            <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the dashboard looks for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <div className="space-y-0.5">
                    <Label className="text-base">Color Theme</Label>
                    <p className="text-sm text-slate-500">Switch between light, dark, or system default.</p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="space-y-2">
                   <Label>Interface Spacing</Label>
                   <div className="flex gap-2">
                     <Button variant="outline" className="flex-1 rounded-xl">Compact</Button>
                     <Button variant="outline" className="flex-1 rounded-xl border-amber-500 bg-amber-50 dark:bg-amber-400/10">Comfortable</Button>
                     <Button variant="outline" className="flex-1 rounded-xl">Wide</Button>
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                  <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
               <CardHeader>
                 <CardTitle>Gym Profile</CardTitle>
                 <CardDescription>Your public information and gym details.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label>Gym Name</Label>
                     <Input defaultValue="Iron Haven Gym" className="rounded-xl h-10" />
                   </div>
                   <div className="space-y-2">
                     <Label>Contact Email</Label>
                     <Input defaultValue="contact@ironhaven.com" className="rounded-xl h-10" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label>Location</Label>
                   <Input defaultValue="123 Fitness Ave, New York, NY" className="rounded-xl h-10" />
                 </div>
                 <div className="pt-4 flex justify-end">
                   <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
                     Update Profile
                   </Button>
                 </div>
               </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}
