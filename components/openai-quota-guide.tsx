"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OpenAIQuotaGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OpenAIQuotaGuide({ open, onOpenChange }: OpenAIQuotaGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            OpenAI API Guide
          </DialogTitle>
          <DialogDescription>How to resolve OpenAI API issues and manage your API usage.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quota">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quota">Quota Issues</TabsTrigger>
            <TabsTrigger value="models">Model Access</TabsTrigger>
          </TabsList>

          <TabsContent value="quota" className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Why am I seeing "Quota Exceeded" errors?</h3>
            <p className="text-sm text-muted-foreground">
              This error occurs when your OpenAI API key has reached its usage limit. This can happen if:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>You're using a free tier account with limited credits that have been exhausted</li>
              <li>You've reached your monthly spending limit</li>
              <li>There's a billing issue with your OpenAI account</li>
              <li>Your payment method has been declined</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">How to fix this issue:</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>
                <strong>Check your OpenAI usage dashboard</strong>
                <p className="text-muted-foreground mt-1">
                  Visit your OpenAI dashboard to see your current usage, limits, and billing status.
                </p>
              </li>
              <li>
                <strong>Add or update payment information</strong>
                <p className="text-muted-foreground mt-1">
                  If you're on a free tier, you'll need to add payment information to continue using the API.
                </p>
              </li>
              <li>
                <strong>Increase your spending limit</strong>
                <p className="text-muted-foreground mt-1">
                  If you've hit your spending cap, you can increase it in your account settings.
                </p>
              </li>
            </ol>
          </TabsContent>

          <TabsContent value="models" className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Model Access Issues</h3>
            <p className="text-sm text-muted-foreground">
              Not all OpenAI accounts have access to all models. Here's what you need to know:
            </p>

            <div className="mt-4 space-y-4">
              <div className="border rounded-md p-3">
                <h4 className="font-medium">GPT-4o</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This is the latest model and may require a paid account with sufficient usage history.
                </p>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-medium">GPT-4</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Requires a paid account with billing information. Not available on free tier.
                </p>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-medium">GPT-3.5-turbo</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Available on free tier accounts with limited usage. Most widely accessible model.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-6">How to check your model access:</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>
                <strong>Visit the OpenAI API documentation</strong>
                <p className="text-muted-foreground mt-1">Check which models are available for your account type.</p>
              </li>
              <li>
                <strong>Check your account limits page</strong>
                <p className="text-muted-foreground mt-1">
                  This shows which models you can access with your current account.
                </p>
              </li>
            </ol>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-4 rounded-md mt-6">
          <h4 className="font-medium">In the meantime:</h4>
          <p className="text-sm text-muted-foreground mt-1">
            You can continue using the Theory of Change Builder with simulation mode, which provides AI-like suggestions
            without using the OpenAI API.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => window.open("https://platform.openai.com/account/limits", "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            OpenAI Account Limits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
