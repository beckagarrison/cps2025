import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CheckoutPageProps {
  priceId: string;
  planName: string;
  price: number;
  interval: 'month' | 'year';
  userId: string;
  userEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutPage({
  priceId,
  planName,
  price,
  interval,
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a24eaa40/stripe/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            priceId,
            userId,
            email: userEmail,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/pricing`,
            trialDays: planName.includes('Premium') && interval === 'month' ? 7 : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            You're upgrading to {planName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">{planName}</p>
                <p className="text-sm text-muted-foreground">
                  Billed {interval === 'month' ? 'monthly' : 'annually'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${price}</p>
                <p className="text-sm text-muted-foreground">
                  /{interval}
                </p>
              </div>
            </div>

            {planName.includes('Premium') && interval === 'month' && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="size-4" />
                <span>7-day free trial included</span>
              </div>
            )}
          </div>

          {/* What You'll Get */}
          <div>
            <h3 className="font-medium mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm">
              {planName.includes('Premium') ? (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Unlimited document uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>AI document analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Defense strategy generator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Motion templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Everything in Premium, PLUS:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>50M+ court opinions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multi-state law research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Professional reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Litigation tools</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>Continue to Payment</>
              )}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-xs text-muted-foreground text-center">
            <p>🔒 Secure payment powered by Stripe</p>
            <p className="mt-1">Cancel anytime. No long-term contracts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
