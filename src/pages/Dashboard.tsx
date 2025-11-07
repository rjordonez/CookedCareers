import DashboardNav from "@/components/DashboardNav";
import { useAuthState } from "@/hooks";

const Dashboard = () => {
  const { isPro, isLoadingSubscription } = useAuthState();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        isPro={isPro}
        isLoadingSubscription={isLoadingSubscription}
      />

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
