import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/');  // Redirect to login page if no token is found
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-800 p-4">
        <h2 className="text-white text-2xl">Dashboard</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/sales">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Sales
            </div>
          </Link>
          <Link href="/purchases">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Purchases
            </div>
          </Link>
          <Link href="/products">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Products
            </div>
          </Link>
          <Link href="/stocks">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Stocks
            </div>
          </Link>
          <Link href="/customers">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Customers
            </div>
          </Link>
          <Link href="/suppliers">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
            Suppliers
            </div>
          </Link>
          <Link href="/employees">
            <div className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Employees
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
