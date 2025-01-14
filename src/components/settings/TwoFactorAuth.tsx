import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

export function TwoFactorAuth() {
  const [method, setMethod] = useState<'email' | 'authenticator'>('email');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnable = async () => {
    // Here you would implement the actual 2FA setup logic
    setIsEnabled(true);
    toast.success('Two-factor authentication enabled');
  };

  const handleDisable = async () => {
    setIsEnabled(false);
    setShowQR(false);
    toast.success('Two-factor authentication disabled');
  };

  const handleVerify = async () => {
    if (verificationCode.length === 6) {
      // Here you would verify the code with your backend
      toast.success('Verification successful');
      setShowQR(false);
      setIsEnabled(true);
    } else {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Two-Factor Authentication
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add an extra layer of security to your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'email' | 'authenticator')}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            disabled={isEnabled}
          >
            <option value="email">Email</option>
            <option value="authenticator">Authenticator App</option>
          </select>

          {!isEnabled ? (
            <Button onClick={() => setShowQR(true)}>Enable 2FA</Button>
          ) : (
            <Button variant="outline" onClick={handleDisable}>Disable 2FA</Button>
          )}
        </div>

        {showQR && method === 'authenticator' && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white">
              <QRCodeSVG
                value="otpauth://totp/ScreenCast:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=ScreenCast"
                size={200}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Scan this QR code with your authenticator app
            </p>
            <div className="space-y-2">
              <Input
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit code"
              />
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        {showQR && method === 'email' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We'll send a verification code to your email address when you sign in
            </p>
            <Button className="w-full" onClick={handleEnable}>
              Enable Email 2FA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}