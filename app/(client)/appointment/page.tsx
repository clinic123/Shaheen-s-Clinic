"use client";

import dynamic from "next/dynamic";

// Dynamically import Appointment to prevent SSR issues during build
const Appointment = dynamic(() => import("@/components/AppointmentBook"), {
  ssr: false,
});

const AppointmentPage = () => {
  return (
    <div>
      <Appointment />
      {/* <div className="container pb-16">
        <InformationCard />
      </div> */}
    </div>
  );
};

export default AppointmentPage;
