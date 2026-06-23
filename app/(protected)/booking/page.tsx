import BookingInfoCard from "@/components/BookingInfoCard";

const BookingPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">My Bookings</h1>
      <BookingInfoCard />
    </div>
  );
};

export default BookingPage;