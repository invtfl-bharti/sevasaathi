import React from "react";
import InfoScreen from "./InfoScreenProps";

function FindServicePage() {
  return (
    // <InfoScreen
    //   imgUrl="/Icon/Page3.png"
    //   imgHeight={420}
    //   imgWidth={420}
    //   title="Book the Appointment"
    //   subtitle="Book your services on your own time"
    // />
    <InfoScreen
      imgUrl="/Icon/Page3.png"
      title="Book The Appointment"
      subtitle="Book your services on your own time"
    />
  );
}

export default FindServicePage;

// function BookTheAppointment() {
//   return (
//     <div>
//           <div className="flex flex-col justify-center items-center gap-8">
//             <Image
//               className=""
//               src="/Icon/Page3.png"
//               height={420}
//               width={420}
//               alt="Welcome page logo"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <h2 className="text-black text-2xl font-bold">Book The Appointment</h2>
//             <p className="text-slate-600">
//             Book your services on your own time
//             </p>
//           </div>
//         </div>
//   );
// }

// export default BookTheAppointment;
