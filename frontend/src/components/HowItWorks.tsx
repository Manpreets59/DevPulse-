import { Github, Brain, Database, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="card p-8 mb-8 animate-slide-in">
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <span className="mr-3">⚙️</span>
        How DevPulse Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <Step
          icon={Github}
          title="1. GitHub PR"
          description="Fetch PR data via API"
          color="blue"
        />
        <ArrowRight className="hidden md:block mx-auto text-gray-600 w-8 h-8" />
        <Step
          icon={Brain}
          title="2. AI Analysis"
          description="Groq AI evaluates code"
          color="purple"
        />
        <ArrowRight className="hidden md:block mx-auto text-gray-600 w-8 h-8" />
        <Step
          icon={Database}
          title="3. Store & Alert"
          description="Save results & notify"
          color="green"
        />
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, description, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
  };

  return (
    <div className="text-center">
      <div className={`${colorClasses[color as keyof typeof colorClasses]} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-all`}>
        <Icon className="w-10 h-10" />
      </div>
      <p className="font-bold mb-2">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}