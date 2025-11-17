import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { resetPassword } from '../../api/authApi';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await resetPassword(token!, password);
      alert('Password reset');
    } catch (error) {
      console.error('Error');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <InputField label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSubmit}>Reset</Button>
    </div>
  );
};

export default ResetPasswordPage;