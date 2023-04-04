import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Users = () => {
  const { push } = useRouter();

  useEffect(() => {
    push('/');
  }, []);

  return <></>;
};

export default Users