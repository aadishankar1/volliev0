"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { PageWrapper } from "../components/PageWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Moon, Sun, Globe, Lock, Eye, BellRing } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const { setTheme, theme } = useTheme()

  return (
    <PageWrapper className="py-8 pt-20">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-vollie-blue dark:text-vollie-blue">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Volunteen looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? "Light" : "Dark"} mode
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Choose your preferred language.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Globe className="h-5 w-5" />
                  <div className="flex-1">
                    <Label>Display Language</Label>
                    <p className="text-sm text-muted-foreground">English (United States)</p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <BellRing className="h-5 w-5" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser.</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Eye className="h-5 w-5" />
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile.</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5" />
                    <div>
                      <Label>Account Security</Label>
                      <p className="text-sm text-muted-foreground">Manage your account security settings.</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}

