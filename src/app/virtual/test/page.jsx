
import dynamic from "next/dynamic";

// Dynamically import the IncompleteInternshipPage component with SSR disabled
const IncompleteInternshipPage = dynamic(() => import('@/components/virtualInternship/IncompleteInternship'), {
  ssr: false,  // Disable server-side rendering for this component
});

function Page() {
  return (
    <div>
      <IncompleteInternshipPage />
    </div>
  );
}

export default Page;
