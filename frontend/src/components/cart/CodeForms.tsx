
import React from 'react';
import VoucherCodeForm from './VoucherCodeForm';
import ReferralCodeForm from './ReferralCodeForm';
import { VoucherCode } from '@/contexts/cart/types';

interface CodeFormsProps {
  voucherCode: VoucherCode | null;
  referralCode: string | null;
  applyVoucherCode: (code: string) => void;
  removeVoucherCode: () => void;
  applyReferralCode: (code: string) => void;
  removeReferralCode: () => void;
}

const CodeForms: React.FC<CodeFormsProps> = ({
  voucherCode,
  referralCode,
  applyVoucherCode,
  removeVoucherCode,
  applyReferralCode,
  removeReferralCode
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      <VoucherCodeForm 
        voucherCode={voucherCode}
        applyVoucherCode={applyVoucherCode}
        removeVoucherCode={removeVoucherCode}
      />
      <ReferralCodeForm
        referralCode={referralCode}
        applyReferralCode={applyReferralCode}
        removeReferralCode={removeReferralCode}
      />
    </div>
  );
};

export default CodeForms;
