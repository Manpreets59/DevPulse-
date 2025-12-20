import Hero from './components/Hero';
import QuickDemo from './components/QuickDemo';
import StatsGrid from './components/StatsGrid';
import HowItWorks from './components/HowItWorks';
import Charts from './components/Charts';
import RecentAnalysis from './components/RecentAnalysis';
import CustomAnalysis from './components/CustomAnalysis';

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <QuickDemo />
        <StatsGrid />
        <HowItWorks />
        <Charts />
        <RecentAnalysis />
        <CustomAnalysis />
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
          <p className="mb-2">
            Built with <span className="text-purple-400 font-semibold">Motia Framework</span> • 
            Powered by <span className="text-blue-400 font-semibold">Groq AI</span>
          </p>
          <p>GitHub Integration • SQLite Database • Discord Notifications</p>
        </footer>
      </div>
    </div>
  );
}

export default App;