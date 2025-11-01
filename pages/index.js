import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TreeHole from '../components/TreeHole';
import RoleCustomizer from '../components/RoleCustomizer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="p-6">
        <h1 className="text-4xl font-bold text-center text-blue-800">EmoVibe</h1>
        <p className="text-center mt-2 text-gray-600">Professional emotional chat platform</p>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TreeHole />
          <RoleCustomizer />
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">Psychological Counseling</h2>
            <p>Access resources and professional help.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
