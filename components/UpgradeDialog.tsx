'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Infinity, Zap, Rocket, Shield, Check } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const advantages = [
    { icon: Infinity, text: "Unlimited contact views per day" },
    { icon: Zap, text: "Priority support and faster response times" },
    { icon: Rocket, text: "Advanced search and filtering options" },
    { icon: Shield, text: "Enhanced security and data protection" },
    { icon: Crown, text: "Premium badge and exclusive features" },
    { icon: Check, text: "Export contacts to CSV/Excel" },
  ];

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    console.log("Upgrade to Premium clicked");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto !bg-white rounded-2xl border border-gray-200 shadow-2xl p-0">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Stars */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full opacity-60"></div>
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-pink-300 rounded-full opacity-40"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-purple-300 rounded-full opacity-50"></div>
          
          {/* Wavy lines */}
          <div className="absolute top-16 left-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30 transform rotate-12"></div>
          <div className="absolute bottom-24 right-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-30 transform -rotate-12"></div>
          
          {/* Triangles */}
          <div className="absolute top-32 right-16 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-green-200 opacity-40"></div>
          <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-blue-200 opacity-30"></div>
          
          {/* Circles */}
          <div className="absolute top-24 right-1/3 w-3 h-3 border-2 border-cyan-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-28 left-1/3 w-4 h-4 border-2 border-emerald-200 rounded-full opacity-25"></div>
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
              It's Time for Your Upgrade!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Enjoy unlimited contact views and premium features
            </DialogDescription>
          </DialogHeader>

          {/* Large Diamond Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 transform rotate-45 rounded-lg shadow-xl flex items-center justify-center">
                <Crown className="h-12 w-12 text-white transform -rotate-45" />
              </div>
              {/* Sparkles around diamond */}
              <Sparkles className="absolute -top-2 -left-2 h-5 w-5 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-pulse delay-75" />
              <Sparkles className="absolute -bottom-2 -left-2 h-4 w-4 text-yellow-400 animate-pulse delay-150" />
              <Sparkles className="absolute -bottom-2 -right-2 h-5 w-5 text-yellow-400 animate-pulse delay-200" />
            </div>
          </div>

          {/* Advantages List */}
          <div className="mb-6 space-y-3">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700">{advantage.text}</p>
                </div>
              );
            })}
          </div>

          {/* Pricing Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              You will be charged a prorated amount of <span className="font-semibold">$29.00</span> for the monthly plan.
              <br />
              Regular price: <span className="line-through text-red-500">$49.00</span>{' '}
              <span className="font-semibold text-green-600">$29.00</span> per month
            </p>
          </div>

          {/* Call to Action Button */}
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg py-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            Get Premium Access
          </Button>

          {/* Maybe Later Link */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

